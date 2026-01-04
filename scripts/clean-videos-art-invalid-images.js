#!/usr/bin/env node

/**
 * Script pour nettoyer les valeurs invalides dans le champ image de videos_art
 * avant de créer la relation avec directus_files
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

async function cleanInvalidImages() {
  await initAxios()
  console.log('🧹 Nettoyage des valeurs invalides dans videos_art.image...\n')

  try {
    // 1. Récupérer tous les videos_art
    console.log('📋 Récupération de tous les videos_art...')
    const videosResponse = await axiosInstance.get('/items/videos_art?fields=id,title,image')
    const videos = videosResponse.data.data || []
    
    console.log(`📦 ${videos.length} videos_art trouvés\n`)

    // 2. Récupérer tous les fichiers valides
    console.log('📋 Récupération de tous les fichiers Directus...')
    const filesResponse = await axiosInstance.get('/files?limit=-1&fields=id')
    const validFileIds = new Set((filesResponse.data.data || []).map(f => f.id))
    console.log(`📦 ${validFileIds.size} fichiers valides trouvés\n`)

    // 3. Identifier les videos_art avec des images invalides
    const videosToClean = []
    for (const video of videos) {
      if (video.image) {
        // Vérifier si l'image est valide
        if (!validFileIds.has(video.image)) {
          videosToClean.push({
            id: video.id,
            title: video.title,
            invalidImage: video.image,
          })
        }
      }
    }

    if (videosToClean.length === 0) {
      console.log('✅ Aucune valeur invalide trouvée. Tous les videos_art ont des images valides.\n')
      return true
    }

    console.log(`⚠️  ${videosToClean.length} videos_art avec des images invalides trouvés:\n`)
    videosToClean.forEach(v => {
      console.log(`   - "${v.title}" (ID: ${v.id}) - Image invalide: ${v.invalidImage}`)
    })

    // 4. Nettoyer les valeurs invalides
    console.log(`\n🧹 Nettoyage des valeurs invalides...`)
    let cleaned = 0
    for (const video of videosToClean) {
      try {
        await axiosInstance.patch(`/items/videos_art/${video.id}`, {
          image: null,
        })
        console.log(`   ✅ "${video.title}" nettoyé`)
        cleaned++
      } catch (error) {
        console.error(`   ❌ Erreur lors du nettoyage de "${video.title}":`, error.response?.data || error.message)
      }
    }

    console.log(`\n✅ Nettoyage terminé: ${cleaned}/${videosToClean.length} videos_art nettoyés`)
    return true

  } catch (error) {
    console.error(`❌ Erreur:`, error.response?.data || error.message)
    if (error.response?.data?.errors) {
      console.error(`Détails:`, error.response.data.errors)
    }
    return false
  }
}

cleanInvalidImages().then((success) => {
  if (success) {
    console.log('\n💡 Vous pouvez maintenant exécuter le script fix-videos-art-image-field.js pour créer la relation.')
    process.exit(0)
  } else {
    process.exit(1)
  }
}).catch((error) => {
  console.error('❌ Erreur lors du nettoyage:', error.response?.data || error.message)
  process.exit(1)
})

