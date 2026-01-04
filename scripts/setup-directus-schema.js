#!/usr/bin/env node

/**
 * Script pour créer les collections Directus via l'API
 * 
 * Ce script configure toutes les collections nécessaires pour le site
 */

const axios = require('axios')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

let axiosInstance

// Fonction pour obtenir un token si nécessaire
async function getAuthToken() {
  if (DIRECTUS_TOKEN) {
    return DIRECTUS_TOKEN
  }
  
  // Obtenir un token via login admin
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    return response.data.data.access_token
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error.response?.data || error.message)
    throw error
  }
}

// Initialiser axiosInstance avec le token
async function initAxios() {
  const token = await getAuthToken()
  axiosInstance = axios.create({
    baseURL: DIRECTUS_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Crée une collection si elle n'existe pas
 */
async function createCollection(collection) {
  try {
    const existing = await axiosInstance.get(`/collections/${collection.collection}`)
    console.log(`  ✓ Collection "${collection.collection}" existe déjà`)
    return existing.data.data
  } catch (error) {
    if (error.response?.status === 403) {
      // Collection n'existe pas, on la crée
      await axiosInstance.post('/collections', collection)
      console.log(`  ✓ Collection "${collection.collection}" créée`)
    } else {
      throw error
    }
  }
}

/**
 * Liste tous les champs d'une collection
 */
async function listFields(collection) {
  try {
    const response = await axiosInstance.get(`/fields/${collection}`)
    return response.data.data || []
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des champs de "${collection}":`, error.response?.data || error.message)
    return []
  }
}

/**
 * Supprime un champ d'une collection
 */
async function deleteField(collection, fieldName) {
  try {
    await axiosInstance.delete(`/fields/${collection}/${fieldName}`)
    console.log(`    🗑️  Champ "${fieldName}" supprimé`)
    return true
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      console.log(`    ⏭️  Champ "${fieldName}" n'existe pas, ignoré`)
      return false
    } else {
      console.error(`    ❌ Erreur lors de la suppression du champ "${fieldName}":`, error.response?.data || error.message)
      return false
    }
  }
}

/**
 * Crée un champ dans une collection
 */
async function createField(collection, field) {
  try {
    await axiosInstance.get(`/fields/${collection}/${field.field}`)
    console.log(`    ✓ Champ "${field.field}" existe déjà`)
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      await axiosInstance.post(`/fields/${collection}`, field)
      console.log(`    ✓ Champ "${field.field}" créé`)
    } else {
      throw error
    }
  }
}

/**
 * Crée une relation pour un champ fichier
 */
async function createFileRelation(collection, field) {
  try {
    // Vérifier si la relation existe déjà
    const relationsResponse = await axiosInstance.get(`/relations/${collection}`)
    const relations = relationsResponse.data.data || []
    const exists = relations.some(rel => rel.field === field && rel.related_collection === 'directus_files')
    
    if (exists) {
      return // Relation existe déjà
    }

    // Créer la relation
    await axiosInstance.post('/relations', {
      collection: collection,
      field: field,
      related_collection: 'directus_files',
      schema: {
        on_delete: 'SET NULL',
      },
      meta: {
        one_field: null,
        sort_field: null,
        one_deselect_action: 'nullify',
        one_allowed_collections: null,
        junction_field: null,
      },
    })
    console.log(`    ✓ Relation créée pour "${field}"`)
  } catch (error) {
    // Ignorer les erreurs si la relation existe déjà
    if (error.response?.status !== 400) {
      console.warn(`    ⚠️  Impossible de créer la relation pour "${field}":`, error.response?.data?.errors?.[0]?.message || error.message)
    }
  }
}

/**
 * Nettoie les champs obsolètes d'une collection
 */
async function cleanupFields(collection, validFields) {
  const validFieldNames = new Set(validFields.map(f => f.field))
  const systemFields = new Set(['id', 'date_created', 'date_updated', 'user_created', 'user_updated'])
  
  const allFields = await listFields(collection)
  const fieldsToDelete = allFields
    .filter(f => !systemFields.has(f.field) && !validFieldNames.has(f.field))
    .map(f => f.field)
  
  if (fieldsToDelete.length > 0) {
    console.log(`    🧹 Nettoyage des champs obsolètes...`)
    for (const fieldName of fieldsToDelete) {
      await deleteField(collection, fieldName)
    }
  }
}

/**
 * Configure les collections
 */
async function setupSchema() {
  await initAxios()
  console.log('🔧 Configuration du schéma Directus...\n')

  // Collection Films
  console.log('📽️  Configuration de la collection "films"...')
  await createCollection({
    collection: 'films',
    meta: {
      collection: 'films',
      icon: 'movie',
      note: 'Films et documentaires',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: [
        { language: 'fr-FR', translation: 'Films', singular: 'Film', plural: 'Films' },
      ],
    },
    schema: {
      name: 'films',
    },
  })

  // Champs organisés par catégories logiques
  const filmFields = [
    // === Informations de base ===
    { field: 'id', type: 'uuid', meta: { hidden: true, interface: 'input', readonly: true } },
    { field: 'slug', type: 'string', meta: { required: true, interface: 'input', note: 'Identifiant unique (URL)' } },
    { field: 'title', type: 'string', meta: { required: true, interface: 'input', note: 'Titre du film' } },
    { field: 'image', type: 'uuid', meta: { interface: 'file-image', note: 'Image principale' } },
    { field: 'type', type: 'string', meta: { interface: 'input', note: 'Genre (Documentaire, Fiction, Documentaire/fiction)' } },
    { field: 'duree', type: 'string', meta: { interface: 'input', note: 'Durée du film' } },
    { field: 'annee', type: 'string', meta: { interface: 'input', note: 'Date de production' } },
    { field: 'langue', type: 'string', meta: { interface: 'input', note: 'Langue du film' } },
    { field: 'pays_production', type: 'string', meta: { interface: 'input', note: 'Pays de production' } },
    
    // === Synopsis et contenu ===
    { field: 'short_synopsis', type: 'text', meta: { interface: 'input-multiline', note: 'Synopsis court' } },
    { field: 'body', type: 'text', meta: { interface: 'input-code', note: 'Contenu détaillé (Markdown)' } },
    
    // === Équipe technique - Réalisation ===
    { field: 'realisation', type: 'string', meta: { interface: 'input', note: 'Réalisateur/trice' } },
    { field: 'scenario', type: 'string', meta: { interface: 'input', note: 'Scénario' } },
    
    // === Équipe technique - Image ===
    { field: 'assistants_images', type: 'string', meta: { interface: 'input', note: 'Assistants image' } },
    { field: 'steadycamer', type: 'string', meta: { interface: 'input', note: 'Steadycam' } },
    { field: 'etalonnage', type: 'string', meta: { interface: 'input', note: 'Étalonnage' } },
    
    // === Équipe technique - Son ===
    { field: 'son', type: 'string', meta: { interface: 'input', note: 'Son' } },
    { field: 'mixage', type: 'string', meta: { interface: 'input', note: 'Mixage' } },
    { field: 'montage_son', type: 'string', meta: { interface: 'input', note: 'Montage son' } },
    
    // === Équipe technique - Montage ===
    { field: 'montage', type: 'string', meta: { interface: 'input', note: 'Montage' } },
    
    // === Équipe technique - Autres ===
    { field: 'musique', type: 'string', meta: { interface: 'input', note: 'Musique' } },
    { field: 'assistants_mise_en_scene', type: 'string', meta: { interface: 'input', note: 'Assistants mise en scène' } },
    { field: 'assistante_mise_en_scene', type: 'string', meta: { interface: 'input', note: 'Assistante mise en scène' } },
    
    // === Casting ===
    { field: 'avec', type: 'text', meta: { interface: 'input-multiline', note: 'Avec (casting)' } },
    
    // === Production ===
    { field: 'production', type: 'string', meta: { interface: 'input', note: 'Production' } },
    { field: 'producteurs', type: 'string', meta: { interface: 'input', note: 'Producteur(s)' } },
    
    // === Captation (si nécessaire) ===
    { field: 'realisateur_captation', type: 'string', meta: { interface: 'input', note: 'Réalisateur captation' } },
    { field: 'image_captation', type: 'string', meta: { interface: 'input', note: 'Image captation' } },
    
    // === Diffusion et sélections ===
    { field: 'diffusion', type: 'json', meta: { interface: 'list', note: 'Liste des diffusions' } },
    { field: 'selection', type: 'json', meta: { interface: 'list', note: 'Liste des sélections' } },
    
    // === Liens ===
    { field: 'lien_film', type: 'string', meta: { interface: 'input', note: 'Lien externe vers le film (URL YouTube, etc.)' } },
    
    // === Métadonnées ===
    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
    { field: 'date_updated', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
  ]

  for (const field of filmFields) {
    await createField('films', field)
    // Créer la relation pour les champs de fichiers
    if (field.type === 'uuid' && (field.meta?.interface === 'file-image' || field.meta?.interface === 'file')) {
      await createFileRelation('films', field.field)
    }
  }

  // Collection Médiations
  console.log('\n🎓 Configuration de la collection "mediations"...')
  await createCollection({
    collection: 'mediations',
    meta: {
      collection: 'mediations',
      icon: 'school',
      note: 'Médiations et ateliers',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: [
        { language: 'fr-FR', translation: 'Médiations', singular: 'Médiation', plural: 'Médiations' },
      ],
    },
    schema: {
      name: 'mediations',
    },
  })

  const mediationFields = [
    { field: 'id', type: 'uuid', meta: { hidden: true, interface: 'input', readonly: true } },
    { field: 'slug', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'title', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'date', type: 'dateTime', meta: { required: true, interface: 'datetime' } },
    { field: 'lieu', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'duree', type: 'string', meta: { interface: 'input' } },
    { field: 'modalites', type: 'text', meta: { interface: 'input-multiline' } },
    { field: 'lien_inscription', type: 'string', meta: { interface: 'input' } },
    { field: 'gallery', type: 'uuid', meta: { interface: 'files', note: 'Galerie d\'images' } },
    { field: 'excerpt', type: 'text', meta: { interface: 'input-multiline' } },
    { field: 'tags', type: 'json', meta: { interface: 'tags', note: 'Tags' } },
    { field: 'cover', type: 'uuid', meta: { interface: 'file-image' } },
    { field: 'body', type: 'text', meta: { interface: 'input-code', note: 'Contenu MDX' } },
    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
    { field: 'date_updated', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
  ]

  for (const field of mediationFields) {
    await createField('mediations', field)
    // Créer la relation pour les champs de fichiers
    if (field.type === 'uuid' && (field.meta?.interface === 'file-image' || field.meta?.interface === 'file' || field.meta?.interface === 'files')) {
      await createFileRelation('mediations', field.field)
    }
  }

  // Collection Actus
  console.log('\n📰 Configuration de la collection "actus"...')
  await createCollection({
    collection: 'actus',
    meta: {
      collection: 'actus',
      icon: 'article',
      note: 'Actualités et news',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: [
        { language: 'fr-FR', translation: 'Actualités', singular: 'Actualité', plural: 'Actualités' },
      ],
    },
    schema: {
      name: 'actus',
    },
  })

  const actuFields = [
    { field: 'id', type: 'uuid', meta: { hidden: true, interface: 'input', readonly: true } },
    { field: 'slug', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'title', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'subtitle', type: 'string', meta: { interface: 'input' } },
    { field: 'date', type: 'dateTime', meta: { required: true, interface: 'datetime' } },
    { field: 'excerpt', type: 'text', meta: { interface: 'input-multiline' } },
    { field: 'tags', type: 'json', meta: { interface: 'tags' } },
    { field: 'cover', type: 'uuid', meta: { interface: 'file-image' } },
    { field: 'location', type: 'string', meta: { interface: 'input' } },
    { field: 'body', type: 'text', meta: { interface: 'input-code', note: 'Contenu MDX' } },
    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
    { field: 'date_updated', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
  ]

  for (const field of actuFields) {
    await createField('actus', field)
    // Créer la relation pour les champs de fichiers
    if (field.type === 'uuid' && (field.meta?.interface === 'file-image' || field.meta?.interface === 'file')) {
      await createFileRelation('actus', field.field)
    }
  }

  // Collection Pages
  console.log('\n📄 Configuration de la collection "pages"...')
  await createCollection({
    collection: 'pages',
    meta: {
      collection: 'pages',
      icon: 'description',
      note: 'Pages statiques',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: [
        { language: 'fr-FR', translation: 'Pages', singular: 'Page', plural: 'Pages' },
      ],
    },
    schema: {
      name: 'pages',
    },
  })

  const pageFields = [
    { field: 'id', type: 'uuid', meta: { hidden: true, interface: 'input', readonly: true } },
    { field: 'slug', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'title', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'portrait', type: 'uuid', meta: { interface: 'file-image' } },
    { field: 'hero_video', type: 'string', meta: { interface: 'input', note: 'URL vidéo hero' } },
    { field: 'hero_image', type: 'uuid', meta: { interface: 'file-image' } },
    { field: 'cta_text', type: 'string', meta: { interface: 'input' } },
    { field: 'cta_link', type: 'string', meta: { interface: 'input' } },
    { field: 'body', type: 'text', meta: { interface: 'input-code', note: 'Contenu MDX' } },
    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
    { field: 'date_updated', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
  ]

  for (const field of pageFields) {
    await createField('pages', field)
    // Créer la relation pour les champs de fichiers
    if (field.type === 'uuid' && (field.meta?.interface === 'file-image' || field.meta?.interface === 'file')) {
      await createFileRelation('pages', field.field)
    }
  }

  // Collection Videos Art
  console.log('\n🎬 Configuration de la collection "videos_art"...')
  await createCollection({
    collection: 'videos_art',
    meta: {
      collection: 'videos_art',
      icon: 'videocam',
      note: 'Vidéos artistiques',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: [
        { language: 'fr-FR', translation: 'Vidéos/art', singular: 'Vidéo/art', plural: 'Vidéos/art' },
      ],
    },
    schema: {
      name: 'videos_art',
    },
  })

  const videoArtFields = [
    { field: 'id', type: 'uuid', meta: { hidden: true, interface: 'input', readonly: true } },
    { field: 'slug', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'title', type: 'string', meta: { required: true, interface: 'input' } },
    { field: 'image', type: 'uuid', meta: { interface: 'file-image', note: 'Image principale' } },
    { field: 'type', type: 'string', meta: { interface: 'input' } },
    { field: 'duree', type: 'string', meta: { interface: 'input' } },
    { field: 'annee', type: 'string', meta: { interface: 'input' } },
    { field: 'vimeo_id', type: 'string', meta: { interface: 'input', note: 'ID Vimeo' } },
    { field: 'video_url', type: 'string', meta: { interface: 'input', note: 'URL vidéo alternative' } },
    { field: 'short_synopsis', type: 'text', meta: { interface: 'input-multiline' } },
    { field: 'realisation', type: 'string', meta: { interface: 'input' } },
    { field: 'mixage', type: 'string', meta: { interface: 'input' } },
    { field: 'texte', type: 'string', meta: { interface: 'input' } },
    { field: 'production', type: 'string', meta: { interface: 'input' } },
    { field: 'body', type: 'text', meta: { interface: 'input-code', note: 'Contenu MDX' } },
    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
    { field: 'date_updated', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
  ]

  for (const field of videoArtFields) {
    await createField('videos_art', field)
    // Créer la relation pour les champs de fichiers
    if (field.type === 'uuid' && (field.meta?.interface === 'file-image' || field.meta?.interface === 'file')) {
      await createFileRelation('videos_art', field.field)
      
      // Forcer la mise à jour du champ avec special: ['file'] pour videos_art
      if (field.field === 'image') {
        try {
          const currentField = await axiosInstance.get(`/fields/videos_art/${field.field}`)
          const currentMeta = currentField.data.data.meta || {}
          if (!currentMeta.special || !currentMeta.special.includes('file')) {
            await axiosInstance.patch(`/fields/videos_art/${field.field}`, {
              meta: {
                ...currentMeta,
                special: ['file'],
                interface: 'file-image',
                display: 'file-image',
              },
            })
            console.log(`    ✓ Propriété 'special' ajoutée au champ "${field.field}"`)
          }
        } catch (error) {
          console.warn(`    ⚠️  Impossible de mettre à jour le champ "${field.field}":`, error.response?.data?.errors?.[0]?.message || error.message)
        }
      }
    }
  }

  // Collection Home Settings (singleton pour les paramètres de la page d'accueil)
  console.log('\n🏠 Configuration de la collection "home_settings"...')
  await createCollection({
    collection: 'home_settings',
    meta: {
      collection: 'home_settings',
      icon: 'home',
      note: 'Paramètres de la page d\'accueil',
      display_template: 'Paramètres de la page d\'accueil',
      hidden: false,
      singleton: true,
      translations: [
        { language: 'fr-FR', translation: 'Paramètres Accueil', singular: 'Paramètres Accueil', plural: 'Paramètres Accueil' },
      ],
    },
    schema: {
      name: 'home_settings',
    },
  })

  const homeSettingsFields = [
    { field: 'id', type: 'uuid', meta: { hidden: true, interface: 'input', readonly: true } },
    { field: 'hero_video', type: 'uuid', meta: { interface: 'file', note: 'Vidéo hero depuis Directus', options: { folder: null } } },
    { field: 'hero_video_url', type: 'string', meta: { interface: 'input', note: 'URL de la vidéo hero externe (optionnel)' } },
    { field: 'bio_text', type: 'text', meta: { interface: 'input-code', note: 'Texte de la section bio (Markdown)' } },
    { field: 'bio_image', type: 'uuid', meta: { interface: 'file-image', note: 'Image de la section bio' } },
    { field: 'date_created', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
    { field: 'date_updated', type: 'timestamp', meta: { interface: 'datetime', readonly: true } },
  ]

  for (const field of homeSettingsFields) {
    await createField('home_settings', field)
    // Créer la relation pour les champs de fichiers
    if (field.type === 'uuid' && (field.meta?.interface === 'file-image' || field.meta?.interface === 'file')) {
      await createFileRelation('home_settings', field.field)
    }
  }

  // Nettoyer les champs obsolètes
  await cleanupFields('home_settings', homeSettingsFields)

  console.log('\n✅ Configuration du schéma terminée!')
}

setupSchema().catch((error) => {
  console.error('❌ Erreur lors de la configuration:', error.response?.data || error.message)
  process.exit(1)
})

