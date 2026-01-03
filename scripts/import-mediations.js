#!/usr/bin/env node

/**
 * Script pour importer des médiations dans Directus
 * 
 * Usage:
 *   node import-mediations.js --file data.json
 * 
 * Les images doivent être dans un dossier temporaire (ex: temp-mediations-images/)
 * ou déjà présentes dans Directus.
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
const projectRoot = path.resolve(__dirname, '..')
const TEMP_IMAGES_DIR = path.join(projectRoot, 'temp-mediations-images')

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
 * Obtient ou crée le dossier "Médiations" dans Directus
 */
async function getOrCreateMediationsFolder() {
  const folderName = 'Médiations'
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
 * Cherche si un fichier existe déjà dans Directus par son nom
 */
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

/**
 * Trouve ou upload une image dans Directus
 * Cherche d'abord si l'image existe déjà, sinon l'upload depuis le dossier temporaire
 */
async function findOrUploadImage(imageFilename) {
  if (!imageFilename) {
    return null
  }

  // Obtenir ou créer le dossier "Médiations"
  const folderId = await getOrCreateMediationsFolder()

  // D'abord, chercher si l'image existe déjà dans Directus
  console.log(`  🔍 Recherche de l'image dans Directus: ${imageFilename}`)
  const existing = await fileExistsInDirectus(imageFilename)
  if (existing) {
    console.log(`  📄 Image trouvée dans Directus: ${imageFilename} (ID: ${existing.id})`)
    
    // Vérifier si le fichier est dans le bon dossier
    if (existing.folder && existing.folder !== folderId) {
      try {
        await axiosInstance.patch(`/files/${existing.id}`, {
          folder: folderId
        })
        console.log(`  ✅ Déplacée dans le dossier "Médiations"`)
      } catch (error) {
        console.warn(`  ⚠️  Impossible de déplacer dans le dossier "Médiations":`, error.response?.data || error.message)
      }
    }
    
    return existing.id
  }

  // Si l'image n'existe pas, chercher dans le dossier temporaire pour l'uploader
  const imagePath = path.join(TEMP_IMAGES_DIR, imageFilename)
  console.log(`  🔍 Recherche dans le dossier temporaire: ${imagePath}`)
  
  if (!fs.existsSync(imagePath)) {
    console.warn(`  ⚠️  Image non trouvée dans Directus ni dans le dossier temporaire: ${imageFilename}`)
    console.warn(`  📁 Chemin recherché: ${imagePath}`)
    return null
  }
  
  console.log(`  ✅ Image trouvée dans le dossier temporaire, upload en cours...`)

  const fileStream = fs.createReadStream(imagePath)
  const formData = new FormData()
  formData.append('file', fileStream)
  formData.append('folder', folderId)

  try {
    console.log(`📤 Upload de l'image depuis le dossier temporaire: ${imageFilename}...`)
    const response = await axiosInstance.post('/files', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })
    console.log(`✅ Image uploadée: ${imageFilename} (ID: ${response.data.data.id})`)
    return response.data.data.id
  } catch (error) {
    console.error(`❌ Erreur lors de l'upload de ${imageFilename}:`)
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Data:`, JSON.stringify(error.response.data, null, 2))
    } else {
      console.error(`   Message:`, error.message)
    }
    return null
  }
}

/**
 * Crée ou met à jour une médiation dans Directus
 */
async function createOrUpdateMediation(mediationData) {
  try {
    // Vérifier si la médiation existe déjà
    const existing = await axiosInstance.get('/items/mediations', {
      params: { 
        filter: { slug: { _eq: mediationData.slug } },
        limit: 1
      },
    })

    if (existing.data.data.length > 0) {
      // Mise à jour
      const existingId = existing.data.data[0].id
      console.log(`🔄 Mise à jour de la médiation existante: ${mediationData.title}`)
      await axiosInstance.patch(`/items/mediations/${existingId}`, mediationData)
      console.log(`✅ Médiation mise à jour: ${mediationData.title}`)
      return existingId
    } else {
      // Création
      console.log(`➕ Création de la nouvelle médiation: ${mediationData.title}`)
      const response = await axiosInstance.post('/items/mediations', mediationData)
      console.log(`✅ Médiation créée: ${mediationData.title} (ID: ${response.data.data.id})`)
      return response.data.data.id
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la création/mise à jour:`, error.response?.data || error.message)
    throw error
  }
}

/**
 * Traite une médiation
 */
async function processMediation(data) {
  // Générer le slug si non fourni
  const slug = data.slug || generateSlug(data.title)
  
  if (!data.title) {
    throw new Error('Le titre est obligatoire')
  }

  // Trouver ou uploader l'image de couverture si fournie
  let coverId = null
  if (data.cover) {
    console.log(`\n🖼️  Traitement de l'image de couverture pour "${data.title}": ${data.cover}`)
    coverId = await findOrUploadImage(data.cover)
    if (!coverId) {
      console.warn(`⚠️  Aucune image de couverture trouvée ou uploadée pour "${data.title}"`)
    }
  }

  // Préparer les données pour Directus
  const mediationData = {
    slug,
    title: data.title,
    ...(coverId && { cover: coverId }),
    ...(data.date && { date: data.date }),
    ...(data.lieu && { lieu: data.lieu }),
    ...(data.duree && { duree: data.duree }),
    ...(data.modalites && { modalites: data.modalites }),
    ...(data.lien_inscription && { lien_inscription: data.lien_inscription }),
    ...(data.excerpt && { excerpt: data.excerpt }),
    ...(data.tags && { tags: data.tags }),
    ...(data.body && { body: data.body }),
  }

  // Créer ou mettre à jour dans Directus
  await createOrUpdateMediation(mediationData)
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

    console.log(`\n🎓 Import de ${items.length} médiation(s)...\n`)

    for (const item of items) {
      try {
        await processMediation(item)
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
      title: "Mon atelier",
      slug: "mon-atelier",
      cover: "mon-image.jpg",
      body: "Description de l'atelier...",
      excerpt: "Résumé court",
      date: "2024-01-15T10:00:00",
      lieu: "Lieu de l'atelier",
      duree: "2 heures",
      modalites: "Modalités d'inscription",
      lien_inscription: "https://example.com/inscription",
      tags: ["atelier", "vidéo"]
    }, null, 2))
    console.log('\n📁 Placez vos images dans:', TEMP_IMAGES_DIR)
  }
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

