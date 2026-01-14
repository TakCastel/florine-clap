/**
 * Script pour exporter le schéma Directus en snapshot
 * 
 * Usage: npm run directus:export
 * ou: npx tsx scripts/export-directus-schema.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN || ''
const SNAPSHOT_PATH = path.join(process.cwd(), 'directus/snapshots/schema.yaml')

async function exportSchema() {
  console.log('📸 Export du schéma Directus...\n')
  console.log(`URL: ${DIRECTUS_URL}`)
  console.log(`Snapshot: ${SNAPSHOT_PATH}\n`)

  if (!DIRECTUS_TOKEN) {
    console.error('❌ Erreur: DIRECTUS_STATIC_TOKEN ou DIRECTUS_ADMIN_TOKEN doit être défini dans .env')
    process.exit(1)
  }

  try {
    // Exporter le snapshot via l'API REST
    console.log('🔄 Récupération du schéma...')
    const response = await axios.get(`${DIRECTUS_URL}/schema/snapshot`, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
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
    console.error('❌ Erreur lors de l\'export:', error.message)
    if (error.response) {
      console.error('Réponse:', error.response.data)
    }
    process.exit(1)
  }
}

exportSchema()
