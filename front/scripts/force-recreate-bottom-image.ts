/**
 * Script pour forcer la recréation du champ bottom_image
 * Supprime l'enregistrement orphelin dans directus_fields si nécessaire
 * 
 * Usage: npx tsx scripts/force-recreate-bottom-image.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'
const DIRECTUS_STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || ''

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
 * Récupère la configuration complète du champ hero_image
 */
async function getHeroImageConfig(token: string): Promise<any> {
  const response = await fetch(`${DIRECTUS_URL}/fields/pages/hero_image`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la récupération de hero_image: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Supprime l'enregistrement orphelin dans directus_fields
 */
async function deleteOrphanField(token: string): Promise<void> {
  // Essayer de supprimer via l'API standard
  const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (response.ok || response.status === 404) {
    console.log('✅ Enregistrement supprimé (ou n\'existait pas)')
    // Attendre que Directus termine
    await new Promise(resolve => setTimeout(resolve, 3000))
  } else {
    const error = await response.text()
    console.log('⚠️  Impossible de supprimer via API:', error)
    console.log('   Le champ sera créé avec un nom temporaire puis renommé')
  }
}

/**
 * Crée le champ avec un nom temporaire puis le renomme
 */
async function createWithTempName(token: string, heroImageConfig: any): Promise<void> {
  const tempFieldName = 'bottom_image_temp_' + Date.now()
  
  console.log(`➕ Création du champ avec le nom temporaire: ${tempFieldName}...`)
  
  const fieldDefinition = {
    collection: 'pages',
    field: tempFieldName,
    type: heroImageConfig.type || 'uuid',
    schema: {
      ...heroImageConfig.schema,
      name: tempFieldName,
    },
    meta: {
      ...heroImageConfig.meta,
      collection: 'pages',
      field: tempFieldName,
      note: 'Image affichée en bas de la page (temporaire)',
    },
  }

  let response = await fetch(`${DIRECTUS_URL}/fields/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldDefinition),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la création: ${response.status} - ${error}`)
  }

  console.log('✅ Champ temporaire créé')
  console.log('🔄 Renommage en bottom_image...')
  
  // Renommer le champ
  const renameUpdate = {
    field: 'bottom_image',
    meta: {
      ...heroImageConfig.meta,
      collection: 'pages',
      field: 'bottom_image',
      note: 'Image affichée en bas de la page',
    },
  }

  response = await fetch(`${DIRECTUS_URL}/fields/pages/${tempFieldName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(renameUpdate),
  })

  if (!response.ok) {
    const error = await response.text()
    // Si le renommage échoue, supprimer le champ temporaire
    await fetch(`${DIRECTUS_URL}/fields/pages/${tempFieldName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    throw new Error(`Erreur lors du renommage: ${response.status} - ${error}`)
  }

  console.log('✅ Champ renommé en bottom_image avec succès!')
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

    console.log('📋 Récupération de la configuration de hero_image...')
    const heroImageConfig = await getHeroImageConfig(token)
    console.log('✅ Configuration de hero_image récupérée')
    console.log('   Type:', heroImageConfig.type)
    console.log('   Interface:', heroImageConfig.meta?.interface)
    console.log('')

    console.log('🗑️  Tentative de suppression de l\'enregistrement orphelin...')
    await deleteOrphanField(token)
    console.log('')

    console.log('➕ Création du champ bottom_image...')
    await createWithTempName(token, heroImageConfig)

    console.log('')
    console.log('✅ Script terminé avec succès!')
    console.log('')
    console.log('📝 Prochaines étapes:')
    console.log('   1. Rafraîchissez la page Directus')
    console.log('   2. Allez dans la collection "pages"')
    console.log('   3. Le champ "bottom_image" devrait maintenant avoir les mêmes options que "hero_image"')
  } catch (error: any) {
    console.error('❌ Erreur:', error.message || error)
    process.exit(1)
  }
}

// Exécuter le script
main()
