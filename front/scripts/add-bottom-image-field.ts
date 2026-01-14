/**
 * Script pour ajouter le champ bottom_image à la collection pages dans Directus
 * 
 * Usage: npx tsx scripts/add-bottom-image-field.ts
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
 * Vérifie si le champ existe déjà
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
 * Récupère la configuration du champ hero_image pour la copier
 */
async function getHeroImageFieldConfig(token: string): Promise<any> {
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
 * Met à jour le champ bottom_image en copiant la configuration de hero_image
 */
async function updateBottomImageField(token: string, heroImageConfig: any): Promise<void> {
  // Copier la configuration meta de hero_image mais forcer les options pour permettre l'upload
  const fieldUpdate = {
    meta: {
      ...heroImageConfig.meta,
      field: 'bottom_image',
      note: heroImageConfig.meta.note || 'Image affichée en bas de la page',
      // Forcer les options pour permettre l'upload direct
      options: {
        ...heroImageConfig.meta?.options,
        // Permettre à la fois l'upload et la sélection depuis la librairie
        selectMode: 'both', // 'both' permet upload ET sélection, 'list' = sélection uniquement
      },
    },
  }

  const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldUpdate),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de la mise à jour du champ: ${response.status} - ${error}`)
  }

  const result = await response.json()
  console.log('✅ Champ bottom_image mis à jour avec succès (upload direct activé)!')
}

/**
 * Ajoute le champ bottom_image à la collection pages en copiant la configuration de hero_image
 */
async function addBottomImageField(token: string, heroImageConfig: any): Promise<void> {
  // Copier la configuration schema de hero_image mais adapter pour bottom_image
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
      note: heroImageConfig.meta.note || 'Image affichée en bas de la page',
      // Forcer les options pour permettre l'upload direct
      options: {
        ...heroImageConfig.meta?.options,
        // Permettre à la fois l'upload et la sélection depuis la librairie
        selectMode: 'both', // 'both' permet upload ET sélection, 'list' = sélection uniquement
      },
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
    throw new Error(`Erreur lors de l'ajout du champ: ${response.status} - ${error}`)
  }

  const result = await response.json()
  console.log('✅ Champ bottom_image ajouté avec succès (upload direct activé)!')
}

/**
 * Fonction principale
 */
async function main() {
  try {
    console.log('🔐 Authentification dans Directus...')
    const token = await authenticate()
    console.log('✅ Authentification réussie')

    console.log('📋 Récupération de la configuration du champ hero_image...')
    const heroImageConfig = await getHeroImageFieldConfig(token)
    console.log('✅ Configuration de hero_image récupérée')
    console.log('   Interface:', heroImageConfig.meta?.interface)
    console.log('   Options actuelles:', JSON.stringify(heroImageConfig.meta?.options, null, 2))
    console.log('   ⚠️  Note: Les options seront modifiées pour permettre l\'upload direct (selectMode: "both")')

    console.log('🔍 Vérification si le champ bottom_image existe déjà...')
    const exists = await fieldExists(token)
    
    if (exists) {
      console.log('⚠️  Le champ bottom_image existe déjà dans la collection pages')
      console.log('🔄 Mise à jour du champ avec la configuration de hero_image...')
      await updateBottomImageField(token, heroImageConfig)
    } else {
      console.log('➕ Ajout du champ bottom_image à la collection pages...')
      await addBottomImageField(token, heroImageConfig)
    }

    console.log('✅ Script terminé avec succès!')
    console.log('')
    console.log('📝 Prochaines étapes:')
    console.log('   1. Ouvrez Directus: http://localhost:8055')
    console.log('   2. Allez dans la collection "pages"')
    console.log('   3. Le champ "bottom_image" devrait maintenant être visible')
    console.log('   4. Vous pouvez maintenant uploader ou sélectionner des images aux pages')
  } catch (error: any) {
    console.error('❌ Erreur:', error.message || error)
    process.exit(1)
  }
}

// Exécuter le script
main()
