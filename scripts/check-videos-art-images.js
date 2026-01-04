#!/usr/bin/env node

/**
 * Script pour vérifier les images de videos_art dans la base de données
 */

const axios = require('axios')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
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

async function checkVideosArtImages() {
  await initAxios()
  console.log('🔍 Vérification des images de videos_art...\n')

  try {
    // Récupérer tous les videos_art avec l'API admin (qui retourne les UUIDs bruts)
    console.log('📋 Récupération des videos_art avec l\'API admin...')
    const response = await axiosInstance.get('/items/videos_art', {
      params: {
        fields: 'id,title,image',
        limit: -1,
      },
    })
    
    const videoArts = response.data.data || []
    console.log(`✅ ${videoArts.length} videos_art récupérés\n`)
    
    // Afficher les images
    console.log('📦 Images dans la base de données:')
    for (const video of videoArts) {
      console.log(`   - "${video.title}" (ID: ${video.id}): image = ${video.image || 'null'}`)
    }
    
    // Vérifier les fichiers correspondants
    console.log('\n📋 Vérification des fichiers...')
    const videosWithImages = videoArts.filter(v => v.image)
    console.log(`✅ ${videosWithImages.length} videos_art avec des images\n`)
    
    for (const video of videosWithImages) {
      try {
        const fileResponse = await axiosInstance.get(`/files/${video.image}`)
        console.log(`   ✅ "${video.title}": Fichier trouvé - ${fileResponse.data.data.filename_download}`)
      } catch (error) {
        console.log(`   ❌ "${video.title}": Fichier introuvable (UUID: ${video.image})`)
      }
    }
    
    // Test avec la requête publique
    console.log('\n📋 Test avec la requête publique (sans auth)...')
    const publicResponse = await axios.get(`${DIRECTUS_URL}/items/videos_art`, {
      params: {
        fields: 'id,title,image.id,image.filename_download',
        limit: 3,
      },
    })
    
    const publicVideoArts = publicResponse.data.data || []
    console.log(`✅ ${publicVideoArts.length} videos_art récupérés avec l'API publique\n`)
    
    for (const video of publicVideoArts) {
      console.log(`   - "${video.title}":`)
      console.log(`     image: ${JSON.stringify(video.image)}`)
      console.log(`     imageType: ${typeof video.image}`)
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message)
    if (error.response?.data?.errors) {
      console.error('Détails:', error.response.data.errors)
    }
    process.exit(1)
  }
}

checkVideosArtImages().catch((error) => {
  console.error('❌ Erreur lors de la vérification:', error.response?.data || error.message)
  process.exit(1)
})

