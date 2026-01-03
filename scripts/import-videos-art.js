#!/usr/bin/env node

/**
 * Script pour importer des contenus Art/vidéo dans Directus
 * 
 * Usage:
 *   node import-videos-art.js --file data.json
 *   node import-videos-art.js --title "Mon titre" --image "image.jpg" --body "contenu..."
 * 
 * Les images doivent être dans un dossier temporaire (ex: /tmp/videos-art-images/)
 * qui ne sera pas commité dans git.
 */

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

// Dossier temporaire pour les images (à ajouter dans .gitignore)
// Chercher à la racine du projet (un niveau au-dessus de scripts/)
const projectRoot = path.resolve(__dirname, '..')
const TEMP_IMAGES_DIR = path.join(projectRoot, 'temp-videos-art-images')

let axiosInstance

// Fonction pour obtenir un token si nécessaire
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

// Initialiser axiosInstance avec le token
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

/**
 * Génère un slug à partir d'un titre
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Vérifie si un dossier existe dans Directus
 */
async function folderExists(folderName) {
  try {
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
    return response.data.data && response.data.data.length > 0 ? response.data.data[0] : null
  } catch (error) {
    return null
  }
}

/**
 * Crée un dossier dans Directus
 */
async function createFolder(folderName) {
  try {
    const response = await axiosInstance.post('/folders', {
      name: folderName
    })
    return response.data.data
  } catch (error) {
    // Si le dossier existe déjà, récupérer son ID
    if (error.response?.status === 400) {
      const existing = await folderExists(folderName)
      if (existing) {
        return existing
      }
    }
    throw error
  }
}

/**
 * Obtient ou crée le dossier "video art" dans Directus
 */
async function getOrCreateVideoArtFolder() {
  const folderName = 'video art'
  let folder = await folderExists(folderName)
  
  if (!folder) {
    console.log(`📁 Création du dossier "${folderName}" dans Directus...`)
    folder = await createFolder(folderName)
    console.log(`✅ Dossier "${folderName}" créé (ID: ${folder.id})`)
  } else {
    console.log(`📁 Dossier "${folderName}" trouvé (ID: ${folder.id})`)
  }
  
  return folder.id
}

/**
 * Upload une image vers Directus depuis le dossier temporaire dans le dossier "video art"
 */
async function uploadImage(imageFilename) {
  if (!imageFilename) {
    return null
  }

  // Chercher l'image dans le dossier temporaire
  const imagePath = path.join(TEMP_IMAGES_DIR, imageFilename)
  
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️  Image non trouvée: ${imagePath}`)
    return null
  }

  // Obtenir ou créer le dossier "video art"
  const folderId = await getOrCreateVideoArtFolder()

  const fileStream = fs.createReadStream(imagePath)
  const formData = new FormData()
  formData.append('file', fileStream)
  formData.append('folder', folderId) // Spécifier le dossier

  try {
    console.log(`📤 Upload de l'image: ${imageFilename} dans le dossier "video art"...`)
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

/**
 * Crée ou met à jour un contenu Art/vidéo dans Directus
 */
async function createOrUpdateVideoArt(videoArtData) {
  try {
    // Vérifier si le contenu existe déjà
    const existing = await axiosInstance.get('/items/videos_art', {
      params: { 
        filter: { slug: { _eq: videoArtData.slug } },
        limit: 1
      },
    })

    if (existing.data.data.length > 0) {
      // Mise à jour
      const existingId = existing.data.data[0].id
      console.log(`🔄 Mise à jour du contenu existant: ${videoArtData.title}`)
      await axiosInstance.patch(`/items/videos_art/${existingId}`, videoArtData)
      console.log(`✅ Contenu mis à jour: ${videoArtData.title}`)
      return existingId
    } else {
      // Création
      console.log(`➕ Création du nouveau contenu: ${videoArtData.title}`)
      const response = await axiosInstance.post('/items/videos_art', videoArtData)
      console.log(`✅ Contenu créé: ${videoArtData.title} (ID: ${response.data.data.id})`)
      return response.data.data.id
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la création/mise à jour:`, error.response?.data || error.message)
    throw error
  }
}

/**
 * Traite un contenu Art/vidéo
 */
async function processVideoArt(data) {
  // Générer le slug si non fourni
  const slug = data.slug || generateSlug(data.title)
  
  if (!data.title) {
    throw new Error('Le titre est obligatoire')
  }

  // Upload de l'image si fournie
  let imageId = null
  if (data.image) {
    imageId = await uploadImage(data.image)
  }

  // Préparer les données pour Directus
  const videoArtData = {
    slug,
    title: data.title,
    ...(imageId && { image: imageId }),
    ...(data.type && { type: data.type }),
    ...(data.duree && { duree: data.duree }),
    ...(data.annee && { annee: data.annee }),
    ...(data.vimeo_id && { vimeo_id: data.vimeo_id }),
    ...(data.video_url && { video_url: data.video_url }),
    ...(data.short_synopsis && { short_synopsis: data.short_synopsis }),
    ...(data.realisation && { realisation: data.realisation }),
    ...(data.mixage && { mixage: data.mixage }),
    ...(data.texte && { texte: data.texte }),
    ...(data.production && { production: data.production }),
    ...(data.body && { body: data.body }),
  }

  // Créer ou mettre à jour dans Directus
  await createOrUpdateVideoArt(videoArtData)
}

/**
 * Fonction principale
 */
async function main() {
  await initAxios()

  // Vérifier que le dossier temporaire existe
  if (!fs.existsSync(TEMP_IMAGES_DIR)) {
    console.log(`📁 Création du dossier temporaire: ${TEMP_IMAGES_DIR}`)
    fs.mkdirSync(TEMP_IMAGES_DIR, { recursive: true })
  }

  // Parser les arguments
  const args = process.argv.slice(2)
  
  if (args.includes('--file')) {
    // Mode fichier JSON
    const fileIndex = args.indexOf('--file')
    const filePath = args[fileIndex + 1]
    
    if (!filePath) {
      console.error('❌ Veuillez spécifier un fichier JSON avec --file')
      process.exit(1)
    }

    if (!fs.existsSync(filePath)) {
      console.error(`❌ Fichier non trouvé: ${filePath}`)
      process.exit(1)
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    // Si c'est un tableau, traiter chaque élément
    const items = Array.isArray(data) ? data : [data]

    console.log(`\n🎬 Import de ${items.length} contenu(s) Art/vidéo...\n`)

    for (const item of items) {
      try {
        await processVideoArt(item)
        console.log('')
      } catch (error) {
        console.error(`❌ Erreur pour "${item.title || 'sans titre'}":`, error.message)
      }
    }

    console.log('✅ Import terminé!')
  } else {
    // Mode arguments individuels
    console.log('📝 Mode interactif - utilisez --file pour importer depuis un JSON\n')
    console.log('Exemple de fichier JSON:')
    console.log(JSON.stringify({
      title: "Mon œuvre vidéo",
      slug: "mon-oeuvre-video", // optionnel, généré automatiquement si absent
      image: "mon-image.jpg", // nom du fichier dans le dossier temporaire
      body: "Contenu markdown...",
      short_synopsis: "Synopsis court",
      duree: "10 min",
      annee: "2024",
      vimeo_id: "123456789", // optionnel
      realisation: "Nom du réalisateur",
      mixage: "Nom du mixeur",
      texte: "Auteur du texte",
      production: "Nom de la production"
    }, null, 2))
    console.log('\n📁 Placez vos images dans:', TEMP_IMAGES_DIR)
  }
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

