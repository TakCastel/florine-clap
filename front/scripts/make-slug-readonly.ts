/**
 * Script pour rendre les champs slug en lecture seule dans Directus
 * Les slugs seront générés automatiquement par l'extension hook
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';

// Charger les variables d'environnement depuis la racine du projet
const rootEnvPath = path.join(process.cwd(), '..', '.env');
const localEnvPath = path.join(process.cwd(), '.env');

// Essayer d'abord la racine, puis le dossier front
let envLoaded = false;
let envPath = '';
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: true });
  envLoaded = true;
  envPath = rootEnvPath;
  console.log(`📄 Fichier .env chargé depuis: ${rootEnvPath}`);
} else if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true });
  envLoaded = true;
  envPath = localEnvPath;
  console.log(`📄 Fichier .env chargé depuis: ${localEnvPath}`);
} else {
  // Essayer sans chemin spécifique (cherche automatiquement)
  dotenv.config({ override: true });
  console.log('📄 Tentative de chargement automatique du .env');
}

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// Fonction pour valider le format d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fonction pour obtenir un token via l'authentification email/password
async function getAuthToken(): Promise<string> {
  const email = process.env.DIRECTUS_ADMIN_EMAIL?.trim();
  const password = process.env.DIRECTUS_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.error('\n❌ Variables d\'environnement manquantes:');
    console.error(`   DIRECTUS_ADMIN_EMAIL: ${email ? '✅ défini' : '❌ manquant ou vide'}`);
    console.error(`   DIRECTUS_ADMIN_PASSWORD: ${password ? '✅ défini' : '❌ manquant ou vide'}`);
    console.error('\n💡 Assurez-vous que ces variables sont définies dans votre fichier .env à la racine du projet');
    throw new Error('DIRECTUS_ADMIN_EMAIL et DIRECTUS_ADMIN_PASSWORD doivent être définis dans .env');
  }

  if (!isValidEmail(email)) {
    console.error(`\n❌ Format d'email invalide: "${email}"`);
    throw new Error(`DIRECTUS_ADMIN_EMAIL doit être une adresse email valide (actuellement: "${email}")`);
  }

  try {
    console.log(`   Email utilisé: "${email}"`);
    console.log(`   URL Directus: ${DIRECTUS_URL}`);
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email,
      password,
      mode: 'json'
    });

    return response.data.data.access_token;
  } catch (error: any) {
    if (error.response) {
      const errorMsg = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
      console.error(`\n   Détails de l'erreur:`);
      console.error(`   - Email envoyé: "${email}"`);
      console.error(`   - Longueur email: ${email?.length || 0} caractères`);
      console.error(`   - Réponse Directus: ${errorMsg}`);
      throw new Error(`Erreur d'authentification: ${errorMsg}`);
    }
    throw error;
  }
}

// Collections avec un champ slug
const COLLECTIONS_WITH_SLUG = ['actus', 'films', 'mediations', 'pages', 'videos_art'];

async function makeSlugReadonly() {
  console.log('🔧 Configuration des champs slug en lecture seule...\n');

  try {
    // Obtenir un token d'authentification
    console.log('🔐 Authentification...');
    const token = await getAuthToken();
    console.log('✅ Authentification réussie\n');

    for (const collection of COLLECTIONS_WITH_SLUG) {
      console.log(`📝 Traitement de la collection: ${collection}`);

      try {
        // Récupérer les informations du champ slug
        const fieldsResponse = await axios.get(`${DIRECTUS_URL}/fields/${collection}/slug`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const fieldData = fieldsResponse.data;
        const fieldMeta = fieldData.data?.meta || {};

        // Mettre à jour le champ pour le rendre en lecture seule et non requis
        const updateResponse = await axios.patch(
          `${DIRECTUS_URL}/fields/${collection}/slug`,
          {
            meta: {
              ...fieldMeta,
              readonly: true,
              required: false, // Rendre non requis car généré automatiquement
              note: 'Généré automatiquement à partir du titre',
              interface: 'input',
              options: {
                ...fieldMeta.options,
                placeholder: 'Généré automatiquement',
              },
            },
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(`   ✅ Champ slug configuré en lecture seule pour ${collection}`);
      } catch (error: any) {
        if (error.response) {
          const errorMsg = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data);
          console.error(`   ❌ Erreur pour ${collection}: ${errorMsg}`);
        } else {
          console.error(`   ❌ Erreur pour ${collection}:`, error.message);
        }
      }
    }

    console.log('\n✅ Configuration terminée!');
    console.log('\n📌 Note: Les slugs seront maintenant générés automatiquement à partir du titre.');
    console.log('   Si des titres sont similaires, les slugs seront uniques avec des suffixes numériques.');
  } catch (error: any) {
    console.error('❌ Erreur fatale:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

makeSlugReadonly().catch((error) => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
