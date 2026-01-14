/**
 * Script pour exporter le schéma Directus en snapshot
 * 
 * Usage: npm run directus:export
 * ou: npx tsx scripts/export-directus-schema.ts
 * 
 * Note: À exécuter depuis le dossier front/
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'

// Charger les variables d'environnement depuis la racine du projet
const rootEnvPath = path.join(process.cwd(), '..', '.env')
const localEnvPath = path.join(process.cwd(), '.env')

// Essayer d'abord la racine, puis le dossier front
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath })
} else if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath })
} else {
  // Essayer sans chemin spécifique (cherche automatiquement)
  dotenv.config()
}

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const SNAPSHOT_PATH = path.join(process.cwd(), '..', 'directus', 'snapshots', 'schema.yaml')

// Fonction pour obtenir un token via l'authentification email/password
async function getAuthToken(): Promise<string> {
  const email = process.env.DIRECTUS_ADMIN_EMAIL
  const password = process.env.DIRECTUS_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('DIRECTUS_ADMIN_EMAIL et DIRECTUS_ADMIN_PASSWORD doivent être définis dans .env')
  }

  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email,
      password,
      mode: 'json'
    })

    return response.data.data.access_token
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Erreur d'authentification: ${error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data)}`)
    }
    throw error
  }
}

async function exportSchema() {
  console.log('📸 Export du schéma Directus...\n')
  console.log(`URL: ${DIRECTUS_URL}`)
  console.log(`Snapshot: ${SNAPSHOT_PATH}\n`)

  try {
    // Obtenir un token via l'authentification
    console.log('🔐 Authentification...')
    const token = await getAuthToken()
    console.log('✅ Authentifié\n')

    // Exporter le snapshot via l'API REST
    console.log('🔄 Récupération du schéma...')
    const response = await axios.get(`${DIRECTUS_URL}/schema/snapshot`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const snapshot = response.data

    // S'assurer que le dossier existe
    const snapshotDir = path.dirname(SNAPSHOT_PATH)
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true })
    }

    // Sauvegarder le snapshot en JSON (plus facile à versionner)
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2))
    
    console.log(`✅ Snapshot exporté avec succès vers ${SNAPSHOT_PATH}`)
    console.log(`\n💡 N'oubliez pas de committer le snapshot:`)
    console.log(`   git add directus/snapshots/schema.yaml`)
    console.log(`   git commit -m "Mise à jour du schéma Directus"`)
    console.log(`   git push\n`)
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    if (error.response) {
      console.error('Réponse:', error.response.data)
    }
    process.exit(1)
  }
}

exportSchema()
