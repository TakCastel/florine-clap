/**
 * Script pour corriger le champ bottom_image et permettre l'upload direct
 * comme pour hero_image
 * 
 * Usage: npx tsx scripts/fix-bottom-image-upload.ts
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
 * Récupère la configuration actuelle du champ bottom_image
 */
async function getBottomImageConfig(token: string): Promise<any> {
  const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la récupération de bottom_image: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data
}

/**
 * Met à jour le champ bottom_image pour qu'il ait exactement les mêmes options que hero_image
 */
async function updateBottomImageToMatchHeroImage(token: string, heroImageConfig: any): Promise<void> {
  console.log('📋 Configuration actuelle de hero_image:')
  console.log('   Interface:', heroImageConfig.meta?.interface)
  console.log('   Options:', JSON.stringify(heroImageConfig.meta?.options, null, 2))
  console.log('')

  // Copier exactement la configuration meta de hero_image
  const update = {
    meta: {
      ...heroImageConfig.meta,
      field: 'bottom_image',
      note: 'Image affichée en bas de la page',
    },
  }

  console.log('🔄 Mise à jour de bottom_image avec la configuration de hero_image...')
  console.log('   Nouvelles options:', JSON.stringify(update.meta.options, null, 2))
  console.log('')

  const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la mise à jour: ${response.status} - ${error}`)
  }

  const result = await response.json()
  console.log('✅ Champ bottom_image mis à jour avec succès!')
  console.log('')
  
  // Vérifier la configuration mise à jour
  const updatedConfig = await getBottomImageConfig(token)
  console.log('✅ Configuration vérifiée:')
  console.log('   Interface:', updatedConfig.meta?.interface)
  console.log('   Options:', JSON.stringify(updatedConfig.meta?.options, null, 2))
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
    console.log('')

    console.log('📋 Récupération de la configuration actuelle de bottom_image...')
    const bottomImageConfig = await getBottomImageConfig(token)
    console.log('✅ Configuration de bottom_image récupérée')
    console.log('')

    console.log('🔍 Comparaison des configurations...')
    console.log('Hero Image - Interface:', heroImageConfig.meta?.interface)
    console.log('Hero Image - Options:', JSON.stringify(heroImageConfig.meta?.options, null, 2))
    console.log('Bottom Image - Interface:', bottomImageConfig.meta?.interface)
    console.log('Bottom Image - Options:', JSON.stringify(bottomImageConfig.meta?.options, null, 2))
    console.log('')

    // Vérifier si les configurations sont différentes
    const heroOptions = JSON.stringify(heroImageConfig.meta?.options || {})
    const bottomOptions = JSON.stringify(bottomImageConfig.meta?.options || {})
    
    if (heroOptions === bottomOptions && heroImageConfig.meta?.interface === bottomImageConfig.meta?.interface) {
      console.log('✅ Les deux champs ont déjà la même configuration!')
      console.log('   Aucune modification nécessaire.')
      return
    }

    console.log('⚠️  Les configurations sont différentes')
    console.log('🔄 Mise à jour de bottom_image pour correspondre à hero_image...')
    console.log('')

    await updateBottomImageToMatchHeroImage(token, heroImageConfig)

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
    if (error.message?.includes('404')) {
      console.error('')
      console.error('💡 Le champ bottom_image n\'existe peut-être pas encore.')
      console.error('   Exécutez d\'abord: npx tsx scripts/add-bottom-image-field.ts')
    }
    process.exit(1)
  }
}

// Exécuter le script
main()
