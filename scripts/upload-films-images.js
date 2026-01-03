#!/usr/bin/env node

/**
 * Script pour uploader toutes les images de temp-films-images dans Directus
 * et les associer aux films correspondants
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

const projectRoot = path.resolve(__dirname, '..')
const TEMP_IMAGES_DIR = path.join(projectRoot, 'temp-films-images')
const DATA_FILE = path.join(projectRoot, 'films-data.json')

let axiosInstance

async function getAuthToken() {
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

async function getOrCreateFolder(folderName) {
  try {
    // Vérifier si le dossier existe
    const response = await axiosInstance.get('/folders', {
      params: {
        filter: {
          name: {
            _eq: folderName
          }
        },
        limit: 1
      }
    })
    
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0].id
    }
    
    // Créer le dossier
    const createResponse = await axiosInstance.post('/folders', {
      name: folderName
    })
    return createResponse.data.data.id
  } catch (error) {
    console.error(`❌ Erreur lors de la création/récupération du dossier "${folderName}":`, error.response?.data || error.message)
    throw error
  }
}

async function fileExistsInDirectus(filename) {
  try {
    const response = await axiosInstance.get('/files', {
      params: {
        filter: {
          filename_download: {
            _eq: filename
          }
        },
        limit: 1
      }
    })
    return response.data.data && response.data.data.length > 0 ? response.data.data[0] : null
  } catch (error) {
    return null
  }
}

async function uploadImage(imageFilename, folderId) {
  const imagePath = path.join(TEMP_IMAGES_DIR, imageFilename)
  
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️  Image non trouvée: ${imagePath}`)
    return null
  }

  // Vérifier si le fichier existe déjà
  const existing = await fileExistsInDirectus(imageFilename)
  if (existing) {
    console.log(`📄 ${imageFilename}: Existe déjà (ID: ${existing.id})`)
    
    // Vérifier si le fichier est dans le bon dossier
    if (existing.folder !== folderId) {
      try {
        await axiosInstance.patch(`/files/${existing.id}`, {
          folder: folderId
        })
        console.log(`  ✅ Déplacé dans le dossier "Films"`)
      } catch (error) {
        console.error(`  ❌ Erreur lors du déplacement:`, error.response?.data || error.message)
      }
    }
    
    return existing.id
  }

  const fileStream = fs.createReadStream(imagePath)
  const formData = new FormData()
  formData.append('file', fileStream)
  formData.append('folder', folderId)

  try {
    console.log(`📤 Upload de l'image: ${imageFilename}...`)
    const response = await axiosInstance.post('/files', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    })
    console.log(`✅ Image uploadée: ${imageFilename} (ID: ${response.data.data.id})`)
    return response.data.data.id
  } catch (error) {
    console.error(`❌ Erreur lors de l'upload de ${imageFilename}:`, error.response?.data || error.message)
    return null
  }
}

async function updateFilmImage(slug, imageId) {
  try {
    // Récupérer l'item existant
    const response = await axiosInstance.get('/items/films', {
      params: {
        filter: {
          slug: {
            _eq: slug
          }
        },
        limit: 1
      }
    })
    
    if (!response.data.data || response.data.data.length === 0) {
      console.warn(`⚠️  Film non trouvé pour le slug: ${slug}`)
      return false
    }
    
    const item = response.data.data[0]
    
    // Mettre à jour l'image
    await axiosInstance.patch(`/items/films/${item.id}`, {
      image: imageId
    })
    
    console.log(`  ✅ Image associée à "${item.title}"`)
    return true
  } catch (error) {
    console.error(`  ❌ Erreur lors de la mise à jour:`, error.response?.data || error.message)
    return false
  }
}

async function main() {
  await initAxios()
  
  console.log('📤 Upload des images films dans Directus...\n')
  
  // 1. Obtenir ou créer le dossier "Films"
  const folderId = await getOrCreateFolder('Films')
  console.log(`📁 Dossier "Films" (ID: ${folderId})\n`)
  
  // 2. Lire le fichier de données pour le mapping
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Fichier de données non trouvé: ${DATA_FILE}`)
    console.log(`💡 Créez un fichier ${DATA_FILE} avec un tableau JSON contenant les données des films`)
    console.log(`   Chaque film doit avoir au minimum: { "slug": "...", "image": "nom-fichier.jpg" }`)
    process.exit(1)
  }
  
  const dataContent = fs.readFileSync(DATA_FILE, 'utf-8')
  const filmsData = JSON.parse(dataContent)
  
  // 3. Créer un mapping image filename -> slug
  const imageToSlugMap = new Map()
  for (const item of filmsData) {
    if (item.image && item.slug) {
      imageToSlugMap.set(item.image, item.slug)
    }
  }
  
  // 4. Lister les images dans le dossier temporaire
  const imageFiles = fs.readdirSync(TEMP_IMAGES_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'].includes(ext)
    })
  
  console.log(`📋 ${imageFiles.length} image(s) trouvée(s) dans temp-films-images\n`)
  
  // 5. Uploader chaque image et l'associer au film correspondant
  let uploaded = 0
  let associated = 0
  let skipped = 0
  
  for (const imageFile of imageFiles) {
    console.log(`\n🖼️  Traitement de: ${imageFile}`)
    
    // Uploader l'image
    const imageId = await uploadImage(imageFile, folderId)
    
    if (!imageId) {
      skipped++
      continue
    }
    
    uploaded++
    
    // Trouver le slug correspondant
    const slug = imageToSlugMap.get(imageFile)
    
    if (slug) {
      const success = await updateFilmImage(slug, imageId)
      if (success) {
        associated++
      }
    } else {
      console.log(`  ⚠️  Aucun film trouvé pour cette image`)
    }
  }
  
  console.log(`\n\n✅ Upload terminé!`)
  console.log(`📊 Résumé:`)
  console.log(`   - ${uploaded} image(s) uploadée(s)`)
  console.log(`   - ${associated} image(s) associée(s) à des films`)
  console.log(`   - ${skipped} image(s) ignorée(s)`)
  console.log(`\n💡 Vérifiez dans Directus que les images sont bien associées aux films`)
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

