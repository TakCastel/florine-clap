/**
 * Script pour supprimer les champs inutilisés de la collection pages dans Directus
 * Supprime: portrait, hero_video, cta_text, cta_link
 * 
 * Usage: npx tsx scripts/remove-unused-page-fields.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'
const DIRECTUS_STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || ''

// Champs à supprimer
const FIELDS_TO_REMOVE = ['portrait', 'hero_video', 'cta_text', 'cta_link']

/**
 * Authentification dans Directus
 */
async function authenticate(): Promise<string> {
  if (DIRECTUS_STATIC_TOKEN) {
    return DIRECTUS_STATIC_TOKEN
  }

  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur d'authentification: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data.access_token
}

/**
 * Vérifie si un champ existe
 */
async function fieldExists(token: string, fieldName: string): Promise<boolean> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/fields/pages/${fieldName}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Supprime un champ de la collection pages
 */
async function deleteField(token: string, fieldName: string): Promise<void> {
  const response = await fetch(`${DIRECTUS_URL}/fields/pages/${fieldName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la suppression du champ ${fieldName}: ${response.status} - ${error}`)
  }

  console.log(`✅ Champ ${fieldName} supprimé avec succès`)
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log('🔐 Authentification dans Directus...')
    const token = await authenticate()
    console.log('✅ Authentification réussie')
    console.log('')

    console.log('🔍 Vérification des champs à supprimer...')
    const fieldsToDelete: string[] = []

    for (const fieldName of FIELDS_TO_REMOVE) {
      const exists = await fieldExists(token, fieldName)
      if (exists) {
        fieldsToDelete.push(fieldName)
        console.log(`   ✓ ${fieldName} existe et sera supprimé`)
      } else {
        console.log(`   - ${fieldName} n'existe pas (déjà supprimé ou jamais créé)`)
      }
    }

    if (fieldsToDelete.length === 0) {
      console.log('')
      console.log('✅ Aucun champ à supprimer. Tous les champs ont déjà été retirés.')
      return
    }

    console.log('')
    console.log(`🗑️  Suppression de ${fieldsToDelete.length} champ(s)...`)
    console.log('')

    for (const fieldName of fieldsToDelete) {
      try {
        await deleteField(token, fieldName)
      } catch (error: any) {
        console.error(`❌ Erreur lors de la suppression de ${fieldName}:`, error.message || error)
      }
    }

    console.log('')
    console.log('✅ Script terminé!')
    console.log('')
    console.log('📝 Les champs suivants ont été supprimés de la collection "pages":')
    fieldsToDelete.forEach(field => console.log(`   - ${field}`))
    console.log('')
    console.log('💡 Vous pouvez maintenant vérifier dans Directus:')
    console.log('   Settings > Data Model > Collections > pages')
  } catch (error: any) {
    console.error('❌ Erreur:', error.message || error)
    process.exit(1)
  }
}

// Exécuter le script
main()
