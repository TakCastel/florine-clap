#!/usr/bin/env node

/**
 * Script pour définir la vidéo hero dans home_settings via l'API
 * Usage: node scripts/set-hero-video.js [nom-du-fichier-video]
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

async function setHeroVideo(videoFilename = null) {
  console.log('🎬 Configuration de la vidéo hero...\n')
  
  try {
    // 1. Récupérer les paramètres actuels
    const current = await axiosInstance.get('/items/home_settings?limit=1')
    let currentData = current.data.data && current.data.data.length > 0 ? current.data.data[0] : null
    
    if (!currentData) {
      console.log('⚠️  Aucun enregistrement dans home_settings.')
      console.log('💡 Créez d\'abord un enregistrement depuis l\'interface Directus')
      return
    }
    
    console.log('📋 Enregistrement actuel trouvé (ID:', currentData.id, ')')
    
    // 2. Chercher la vidéo
    let videoFile = null
    
    if (videoFilename) {
      // Chercher par nom de fichier
      console.log(`🔍 Recherche de la vidéo "${videoFilename}"...`)
      const files = await axiosInstance.get('/files', {
        params: {
          filter: {
            filename_download: {
              _icontains: videoFilename
            }
          },
          limit: 5,
          fields: 'id,filename_download,type'
        }
      })
      
      if (files.data.data.length > 0) {
        videoFile = files.data.data.find(f => f.type && f.type.startsWith('video/')) || files.data.data[0]
      }
    } else {
      // Chercher toutes les vidéos et prendre la première ou celle qui contient "intro" ou "florine"
      console.log('🔍 Recherche de vidéos dans la bibliothèque...')
      const files = await axiosInstance.get('/files', {
        params: {
          filter: {
            type: {
              _starts_with: 'video/'
            }
          },
          limit: 20,
          fields: 'id,filename_download,type',
          sort: ['-uploaded_on']
        }
      })
      
      if (files.data.data.length > 0) {
        // Prioriser les vidéos avec "intro" ou "florine" dans le nom
        videoFile = files.data.data.find(f => 
          f.filename_download.toLowerCase().includes('intro') || 
          f.filename_download.toLowerCase().includes('florine')
        ) || files.data.data[0]
      }
    }
    
    if (!videoFile) {
      console.log('❌ Aucune vidéo trouvée dans la bibliothèque')
      console.log('💡 Assurez-vous d\'avoir uploadé la vidéo dans Directus')
      return
    }
    
    console.log(`✅ Vidéo trouvée: ${videoFile.filename_download} (ID: ${videoFile.id})`)
    
    // 3. Sauvegarder la vidéo dans hero_video
    console.log(`\n💾 Sauvegarde de la vidéo dans hero_video...`)
    const updateResponse = await axiosInstance.patch(`/items/home_settings/${currentData.id}`, {
      hero_video: videoFile.id
    })
    
    console.log('✅ Vidéo sauvegardée avec succès!')
    
    // 4. Vérifier
    const verify = await axiosInstance.get(`/items/home_settings/${currentData.id}?fields=*,hero_video.id,hero_video.filename_download`)
    const savedData = verify.data.data
    
    if (savedData.hero_video) {
      const videoInfo = typeof savedData.hero_video === 'object' 
        ? savedData.hero_video.filename_download || savedData.hero_video.id
        : savedData.hero_video
      console.log(`\n✅ Vérification réussie!`)
      console.log(`   Vidéo hero: ${videoInfo}`)
      console.log(`   URL Directus: ${DIRECTUS_URL}/assets/${typeof savedData.hero_video === 'object' ? savedData.hero_video.id : savedData.hero_video}`)
    } else {
      console.log(`\n⚠️  La vidéo n'a pas été sauvegardée correctement`)
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
  const videoFilename = process.argv[2] || null
  
  await initAxios()
  await setHeroVideo(videoFilename)
  console.log('\n✅ Terminé!')
  console.log('💡 Rechargez la page d\'accueil pour voir la vidéo')
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

