#!/usr/bin/env node

/**
 * Script pour tester la sauvegarde du champ hero_video
 */

const axios = require('axios')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

let axiosInstance

async function getAuthToken() {
  if (DIRECTUS_TOKEN) {
    return DIRECTUS_TOKEN
  }
  
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    return response.data.data.access_token
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error.response?.data || error.message)
    throw error
  }
}

async function initAxios() {
  const token = await getAuthToken()
  axiosInstance = axios.create({
    baseURL: DIRECTUS_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

async function testHeroVideoSave() {
  console.log('🧪 Test de sauvegarde du champ hero_video...\n')
  
  try {
    // 1. Récupérer les paramètres actuels (singleton - utiliser items avec limit=1)
    const current = await axiosInstance.get('/items/home_settings?limit=1')
    const currentData = current.data.data && current.data.data.length > 0 ? current.data.data[0] : null
    
    if (!currentData) {
      console.log('⚠️  Aucun enregistrement dans home_settings. Création...')
      // Pour un singleton, on peut créer avec POST mais il faut spécifier l'ID ou laisser Directus le gérer
      try {
        const createResponse = await axiosInstance.post('/items/home_settings', {})
        console.log('✅ Enregistrement créé:', createResponse.data.data.id)
        currentData = createResponse.data.data
      } catch (createError) {
        console.error('❌ Impossible de créer l\'enregistrement:', createError.response?.data || createError.message)
        console.log('💡 Créez manuellement un enregistrement depuis l\'interface Directus')
        return
      }
    }
    
    console.log('📋 Données actuelles:', JSON.stringify(currentData, null, 2))
    
    // 2. Chercher une vidéo dans la bibliothèque
    console.log('\n🔍 Recherche d\'une vidéo dans la bibliothèque...')
    const files = await axiosInstance.get('/files', {
      params: {
        filter: {
          type: {
            _starts_with: 'video/'
          }
        },
        limit: 5,
        fields: 'id,filename_download,type'
      }
    })
    
    if (files.data.data.length === 0) {
      console.log('⚠️  Aucune vidéo trouvée dans la bibliothèque')
      console.log('💡 Assurez-vous d\'avoir uploadé la vidéo "Intro Video Florine Clap" dans Directus')
      return
    }
    
    const videoFile = files.data.data[0]
    console.log(`✅ Vidéo trouvée: ${videoFile.filename_download} (ID: ${videoFile.id})`)
    
    // 3. Tester la sauvegarde (singleton - utiliser l'ID de l'enregistrement)
    console.log(`\n💾 Test de sauvegarde de la vidéo dans hero_video...`)
    const updateResponse = await axiosInstance.patch(`/items/home_settings/${currentData.id}`, {
      hero_video: videoFile.id
    })
    
    console.log('✅ Sauvegarde réussie!')
    console.log('📋 Données après sauvegarde:', JSON.stringify(updateResponse.data.data, null, 2))
    
    // 4. Vérifier que c'est bien sauvegardé
    const verify = await axiosInstance.get(`/items/home_settings/${currentData.id}?fields=*,hero_video.id,hero_video.filename_download`)
    const savedData = verify.data.data
    
    if (savedData.hero_video) {
      console.log(`\n✅ Vérification réussie!`)
      console.log(`   Vidéo sauvegardée: ${savedData.hero_video.filename_download || savedData.hero_video.id}`)
    } else {
      console.log(`\n❌ Problème: La vidéo n'a pas été sauvegardée`)
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message)
    if (error.response?.data) {
      console.error('   Détails:', JSON.stringify(error.response.data, null, 2))
    }
    throw error
  }
}

async function main() {
  await initAxios()
  await testHeroVideoSave()
  console.log('\n✅ Test terminé!')
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

