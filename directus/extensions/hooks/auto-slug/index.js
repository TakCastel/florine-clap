/**
 * Extension hook pour générer automatiquement les slugs à partir du titre
 * Fonctionne pour toutes les collections avec un champ slug et title
 */

export default {
	id: 'auto-slug',
	name: 'Auto Slug Generator',
	api: registerHook,
};

// Collections qui ont un champ slug et title
const COLLECTIONS_WITH_SLUG = ['actus', 'films', 'mediations', 'pages', 'videos_art'];

/**
 * Fonction pour générer un slug à partir d'un titre
 * @param {string} title - Le titre à convertir en slug
 * @returns {string} - Le slug généré
 */
function generateSlug(title) {
	if (!title || typeof title !== 'string') {
		return '';
	}

	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
		.replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
		.replace(/^-+|-+$/g, '') // Supprimer les tirets en début et fin
		.replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
		.substring(0, 100); // Limiter la longueur à 100 caractères
}

/**
 * Vérifie si une collection a besoin d'un slug généré automatiquement
 * @param {string} collection - Le nom de la collection
 * @returns {boolean}
 */
function needsAutoSlug(collection) {
	return COLLECTIONS_WITH_SLUG.includes(collection);
}

/**
 * Génère un slug unique en ajoutant un suffixe numérique si nécessaire
 * @param {object} database - L'objet database Directus (knex)
 * @param {string} collection - Le nom de la collection
 * @param {string} baseSlug - Le slug de base
 * @param {string} excludeId - L'ID à exclure de la vérification (pour les mises à jour)
 * @returns {Promise<string>} - Le slug unique
 */
async function ensureUniqueSlug(database, collection, baseSlug, excludeId = null) {
	let slug = baseSlug;
	let counter = 1;
	const maxAttempts = 100;

	while (counter < maxAttempts) {
		// Vérifier si le slug existe déjà
		let query = database.select('id').from(collection).where('slug', slug);

		if (excludeId) {
			query = query.whereNot('id', excludeId);
		}

		const existing = await query.first();

		if (!existing) {
			return slug;
		}

		// Ajouter un suffixe numérique
		slug = `${baseSlug}-${counter}`;
		counter++;
	}

	// Si on n'a pas trouvé de slug unique après 100 tentatives, ajouter un timestamp
	return `${baseSlug}-${Date.now()}`;
}

function registerHook({ filter, action }, { services, database, getSchema }) {
	const { ItemsService } = services;

	// Hook pour la création d'items - filtre avant la création
	filter('items.create', async (input, meta, context) => {
		const collection = meta.collection || meta;
		
		// Vérifier si cette collection a besoin d'un slug auto-généré
		if (!needsAutoSlug(collection)) {
			return input;
		}

		// Traiter chaque item (peut être un seul objet ou un tableau)
		const items = Array.isArray(input) ? input : [input];

		for (const item of items) {
			// Ignorer si un slug est déjà fourni et n'est pas vide
			if (item.slug && item.slug.trim() !== '') {
				continue;
			}

			// Si pas de titre, ne rien faire
			if (!item.title || item.title.trim() === '') {
				continue;
			}

			// Générer le slug à partir du titre
			const baseSlug = generateSlug(item.title);

			if (!baseSlug) {
				continue;
			}

			// S'assurer que le slug est unique
			const uniqueSlug = await ensureUniqueSlug(database, collection, baseSlug);

			// Mettre à jour l'item avec le slug généré
			item.slug = uniqueSlug;
		}

		return input;
	});

	// Hook pour la mise à jour d'items - filtre avant la mise à jour
	filter('items.update', async (input, meta, context) => {
		const collection = meta.collection || meta;
		const keys = meta.keys || meta;
		
		// Vérifier si cette collection a besoin d'un slug auto-généré
		if (!needsAutoSlug(collection)) {
			return input;
		}

		// Si le slug est modifié explicitement dans le payload, ne rien faire
		if (input.slug !== undefined) {
			return input;
		}

		// Si le titre est modifié, générer un nouveau slug si nécessaire
		if (input.title && input.title.trim() !== '') {
			// Récupérer les items existants pour vérifier leurs slugs actuels
			const currentSchema = await getSchema();
			const itemsService = new ItemsService(collection, {
				schema: currentSchema,
				accountability: context.accountability || meta.accountability,
			});

			const existingItems = await itemsService.readMany(keys, {
				fields: ['id', 'title', 'slug'],
			});

			for (const existingItem of existingItems) {
				// Si l'item n'a pas de slug ou que le slug est vide, générer un nouveau slug
				if (!existingItem.slug || existingItem.slug.trim() === '') {
					const baseSlug = generateSlug(input.title || existingItem.title);

					if (baseSlug) {
						const uniqueSlug = await ensureUniqueSlug(
							database,
							collection,
							baseSlug,
							existingItem.id
						);

						// Mettre à jour le slug dans le payload
						input.slug = uniqueSlug;
					}
				}
			}
		}

		return input;
	});
}
