/**
 * Script pour régénérer les slugs manquants pour les contenus existants
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

// Charger les variables d'environnement depuis la racine du projet
const rootEnvPath = path.join(process.cwd(), '..', '.env');
const localEnvPath = path.join(process.cwd(), '.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: true });
  console.log(`📄 Fichier .env chargé depuis: ${rootEnvPath}`);
} else if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
  console.log(`📄 Fichier .env chargé depuis: ${localEnvPath}`);
} else {
  dotenv.config({ override: true });
  console.log('📄 Tentative de chargement automatique du .env');
}

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// Collections avec un champ slug
const COLLECTIONS_WITH_SLUG = ['actus', 'films', 'mediations', 'pages', 'videos_art'];

// Fonction pour valider le format d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction pour vérifier que Directus est accessible
async function checkDirectusAccess(): Promise<boolean> {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/server/info`, {
      timeout: 5000,
      validateStatus: (status) => status < 500 // Accepter les codes < 500
    });
    return true;
  } catch (error: any) {
    console.error(`\n❌ Impossible de se connecter à Directus à l'adresse: ${DIRECTUS_URL}`);
    console.error(`   Erreur: ${error.message}`);
    console.error(`\n💡 Vérifiez que:`);
    console.error(`   1. Directus est démarré (docker-compose up -d)`);
    console.error(`   2. L'URL est correcte dans votre .env (DIRECTUS_PUBLIC_URL ou NEXT_PUBLIC_DIRECTUS_URL)`);
    return false;
  }
}

// Fonction pour obtenir un token via l'authentification email/password
async function getAuthToken(): Promise<string> {
  const email = process.env.DIRECTUS_ADMIN_EMAIL?.trim();
  const password = process.env.DIRECTUS_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.error('\n❌ Variables d\'environnement manquantes:');
    console.error(`   DIRECTUS_ADMIN_EMAIL: ${email ? '✅ défini' : '❌ manquant ou vide'}`);
    console.error(`   DIRECTUS_ADMIN_PASSWORD: ${password ? '✅ défini' : '❌ manquant ou vide'}`);
    throw new Error('DIRECTUS_ADMIN_EMAIL et DIRECTUS_ADMIN_PASSWORD doivent être définis dans .env');
  }

  if (!isValidEmail(email)) {
    throw new Error(`DIRECTUS_ADMIN_EMAIL doit être une adresse email valide`);
  }

  console.log(`   URL Directus: ${DIRECTUS_URL}`);
  console.log(`   Email: ${email}`);

  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email,
      password,
      mode: 'json'
    }, {
      timeout: 10000 // Timeout de 10 secondes
    });

    return response.data.data.access_token;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.message.includes('socket hang up')) {
      console.error(`\n❌ Impossible de se connecter à Directus`);
      console.error(`   URL: ${DIRECTUS_URL}`);
      console.error(`   Erreur: ${error.message}`);
      throw new Error(`Connexion à Directus échouée. Vérifiez que Directus est démarré et accessible.`);
    }
    if (error.response) {
      const errorMsg = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      throw new Error(`Erreur d'authentification: ${errorMsg}`);
    }
    throw error;
  }
}

// Fonction pour générer un slug à partir d'un titre
function generateSlug(title: string): string {
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

// Fonction pour vérifier si un slug existe déjà
async function slugExists(token: string, collection: string, slug: string, excludeId?: string): Promise<boolean> {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/items/${collection}`, {
      params: {
        filter: {
          slug: { _eq: slug }
        },
        fields: ['id']
      },
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const items = response.data.data || [];
    if (excludeId) {
      return items.some((item: any) => item.id !== excludeId);
    }
    return items.length > 0;
  } catch (error) {
    return false;
  }
}

// Fonction pour générer un slug unique
async function ensureUniqueSlug(token: string, collection: string, baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  const maxAttempts = 100;

  while (counter < maxAttempts) {
    const exists = await slugExists(token, collection, slug, excludeId);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return `${baseSlug}-${Date.now()}`;
}

async function regenerateMissingSlugs() {
  console.log('🔄 Régénération des slugs manquants...\n');

  try {
    // Vérifier que Directus est accessible
    console.log('🔍 Vérification de l\'accessibilité de Directus...');
    const isAccessible = await checkDirectusAccess();
    if (!isAccessible) {
      process.exit(1);
    }
    console.log('✅ Directus est accessible\n');

    console.log('🔐 Authentification...');
    const token = await getAuthToken();
    console.log('✅ Authentification réussie\n');

    for (const collection of COLLECTIONS_WITH_SLUG) {
      console.log(`📝 Traitement de la collection: ${collection}`);

      try {
        // Récupérer tous les items sans slug ou avec slug vide/null
        const response = await axios.get(`${DIRECTUS_URL}/items/${collection}`, {
          params: {
            filter: {
              _or: [
                { slug: { _null: true } },
                { slug: { _empty: true } }
              ]
            },
            fields: ['id', 'title', 'slug']
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const items = response.data.data || [];
        console.log(`   Trouvé ${items.length} item(s) sans slug`);

        for (const item of items) {
          if (!item.title || item.title.trim() === '') {
            console.log(`   ⚠ Item ${item.id}: pas de titre, ignoré`);
            continue;
          }

          const baseSlug = generateSlug(item.title);
          if (!baseSlug) {
            console.log(`   ⚠ Item ${item.id}: impossible de générer un slug depuis "${item.title}"`);
            continue;
          }

          const uniqueSlug = await ensureUniqueSlug(token, collection, baseSlug, item.id);

          // Mettre à jour l'item avec le nouveau slug
          await axios.patch(
            `${DIRECTUS_URL}/items/${collection}/${item.id}`,
            { slug: uniqueSlug },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(`   ✅ ${item.title} → ${uniqueSlug}`);
        }
      } catch (error: any) {
        if (error.response) {
          const errorMsg = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
          console.error(`   ❌ Erreur pour ${collection}: ${errorMsg}`);
        } else {
          console.error(`   ❌ Erreur pour ${collection}:`, error.message);
        }
      }
    }

    console.log('\n✅ Régénération terminée!');
  } catch (error: any) {
    console.error('❌ Erreur fatale:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

regenerateMissingSlugs().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
