/**
 * Script pour supprimer et recréer le champ bottom_image avec le bon type (comme hero_image)
 * 
 * Usage: npx tsx scripts/recreate-bottom-image-field.ts
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
 * Vérifie si le champ bottom_image existe
 */
async function fieldExists(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
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
 * Supprime le champ bottom_image
 */
async function deleteField(token: string): Promise<void> {
  console.log('🗑️  Tentative de suppression du champ bottom_image...')
  const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = `Erreur lors de la suppression: ${response.status} - ${errorText}`
    
    // Si l'erreur est 404, le champ n'existe pas, c'est OK
    if (response.status === 404) {
      console.log('   ℹ️  Le champ n\'existe pas (déjà supprimé ou jamais créé)')
      return
    }
    
    // Si c'est une autre erreur, on la lance
    throw new Error(errorMessage)
  }

  console.log('✅ Champ bottom_image supprimé')
  
  // Attendre un peu pour que Directus termine la suppression
  await new Promise(resolve => setTimeout(resolve, 1000))
}

/**
 * Crée ou met à jour le champ bottom_image avec la même configuration que hero_image
 */
async function createOrUpdateBottomImageField(token: string, heroImageConfig: any): Promise<void> {
  // Copier exactement la configuration de hero_image
  const fieldDefinition = {
    collection: 'pages',
    field: 'bottom_image',
    type: heroImageConfig.type || 'uuid',
    schema: {
      ...heroImageConfig.schema,
      name: 'bottom_image',
    },
    meta: {
      ...heroImageConfig.meta,
      collection: 'pages',
      field: 'bottom_image',
      note: 'Image affichée en bas de la page',
    },
  }

  // D'abord essayer de créer
  let response = await fetch(`${DIRECTUS_URL}/fields/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldDefinition),
  })

  // Si ça échoue avec une erreur de duplication, essayer de mettre à jour seulement le meta
  if (!response.ok) {
    const errorText = await response.text()
    try {
      const errorJson = JSON.parse(errorText)
      if (errorJson.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log('⚠️  Le champ existe déjà dans la base, mise à jour de la configuration...')
        // Mettre à jour seulement le meta (pas le schema qui ne peut pas être modifié)
        const metaUpdate = {
          meta: {
            ...heroImageConfig.meta,
            collection: 'pages',
            field: 'bottom_image',
            note: 'Image affichée en bas de la page',
          },
        }
        response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metaUpdate),
        })
      } else {
        throw new Error(`Erreur lors de la création: ${response.status} - ${errorText}`)
      }
    } catch (parseError) {
      throw new Error(`Erreur lors de la création: ${response.status} - ${errorText}`)
    }
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la création/mise à jour: ${response.status} - ${error}`)
  }

  const result = await response.json()
  console.log('✅ Champ bottom_image créé/mis à jour avec succès!')
  console.log('   Type:', result.data?.type || fieldDefinition.type)
  console.log('   Interface:', result.data?.meta?.interface || fieldDefinition.meta?.interface)
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

    console.log('🔍 Vérification si le champ bottom_image existe...')
    const exists = await fieldExists(token)
    
    if (exists) {
      console.log('✅ Le champ bottom_image existe')
      console.log('🔄 Mise à jour de la configuration pour correspondre à hero_image...')
      
      const metaUpdate = {
        meta: {
          ...heroImageConfig.meta,
          collection: 'pages',
          field: 'bottom_image',
          note: 'Image affichée en bas de la page',
        },
      }
      
      const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metaUpdate),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Erreur lors de la mise à jour: ${response.status} - ${error}`)
      }

      const result = await response.json()
      console.log('✅ Champ bottom_image mis à jour avec succès!')
      console.log('   Interface:', result.data?.meta?.interface || metaUpdate.meta?.interface)
    } else {
      console.log('ℹ️  Le champ bottom_image n\'existe pas')
      console.log('➕ Création du champ bottom_image avec la configuration de hero_image...')
      
      // Créer le champ avec la configuration complète
      const fieldDefinition = {
        collection: 'pages',
        field: 'bottom_image',
        type: heroImageConfig.type || 'uuid',
        schema: {
          ...heroImageConfig.schema,
          name: 'bottom_image',
        },
        meta: {
          ...heroImageConfig.meta,
          collection: 'pages',
          field: 'bottom_image',
          note: 'Image affichée en bas de la page',
        },
      }

      const response = await fetch(`${DIRECTUS_URL}/fields/pages`, {
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

      const result = await response.json()
      console.log('✅ Champ bottom_image créé avec succès!')
      console.log('   Type:', result.data?.type || fieldDefinition.type)
      console.log('   Interface:', result.data?.meta?.interface || fieldDefinition.meta?.interface)
    }

    console.log('')
    console.log('✅ Script terminé avec succès!')
    console.log('')
    console.log('📝 Prochaines étapes:')
    console.log('   1. Rafraîchissez la page Directus')
    console.log('   2. Allez dans la collection "pages"')
    console.log('   3. Le champ "bottom_image" devrait maintenant avoir les mêmes options que "hero_image"')
    console.log('   4. Vous devriez pouvoir uploader directement, sélectionner depuis la librairie, ou utiliser un lien')
  } catch (error: any) {
    console.error('❌ Erreur:', error.message || error)
    process.exit(1)
  }
}

// Exécuter le script
main()
