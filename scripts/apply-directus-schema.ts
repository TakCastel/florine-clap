/**
 * Script pour appliquer le schéma Directus depuis un snapshot
 * 
 * Usage: npm run directus:apply
 * ou: npx tsx scripts/apply-directus-schema.ts [--dry-run]
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
const DRY_RUN = process.argv.includes('--dry-run')

async function applySchema() {
  console.log(DRY_RUN ? '🔍 Prévisualisation de l\'application du schéma Directus...\n' : '🔄 Application du schéma Directus...\n')
  console.log(`URL: ${DIRECTUS_URL}`)
  console.log(`Snapshot: ${SNAPSHOT_PATH}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (aucune modification)' : 'APPLICATION'}\n`)

  if (!DIRECTUS_TOKEN) {
    console.error('❌ Erreur: DIRECTUS_STATIC_TOKEN ou DIRECTUS_ADMIN_TOKEN doit être défini dans .env')
    process.exit(1)
  }

  // Vérifier que le fichier existe
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error(`❌ Erreur: Le fichier snapshot n'existe pas: ${SNAPSHOT_PATH}`)
    console.error('   Exécutez d\'abord: npm run directus:export')
    process.exit(1)
  }

  try {
    // Lire le snapshot
    const snapshotContent = fs.readFileSync(SNAPSHOT_PATH, 'utf-8')
    const snapshot = JSON.parse(snapshotContent)

    if (DRY_RUN) {
      console.log('📋 Contenu du snapshot:')
      console.log(JSON.stringify(snapshot, null, 2))
      console.log('\n💡 Pour appliquer réellement, exécutez sans --dry-run')
    } else {
      // Appliquer le snapshot via l'API REST
      console.log('🔄 Application du snapshot...')
      await axios.post(`${DIRECTUS_URL}/schema/apply`, snapshot, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('✅ Schéma appliqué avec succès!')
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'application:', error.message)
    if (error.response) {
      console.error('Réponse:', error.response.data)
    }
    process.exit(1)
  }
}

applySchema()
