#!/usr/bin/env node

/**
 * Script pour importer des films dans Directus
 * 
 * Usage:
 *   node import-films.js --file data.json
 *   node import-films.js --title "Mon titre" --image "image.jpg" --body "contenu..."
 * 
 * Les images doivent être dans un dossier temporaire (ex: temp-films-images/)
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
const TEMP_IMAGES_DIR = path.join(projectRoot, 'temp-films-images')

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
 * Obtient ou crée le dossier "Films" dans Directus
 */
async function getOrCreateFilmsFolder() {
  const folderName = 'Films'
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

  // Obtenir ou créer le dossier "Films"
  const folderId = await getOrCreateFilmsFolder()

  // D'abord, chercher si l'image existe déjà dans Directus
  const existing = await fileExistsInDirectus(imageFilename)
  if (existing) {
    console.log(`📄 Image trouvée dans Directus: ${imageFilename} (ID: ${existing.id})`)
    
    // Vérifier si le fichier est dans le bon dossier
    if (existing.folder && existing.folder !== folderId) {
      try {
        await axiosInstance.patch(`/files/${existing.id}`, {
          folder: folderId
        })
        console.log(`  ✅ Déplacée dans le dossier "Films"`)
      } catch (error) {
        console.warn(`  ⚠️  Impossible de déplacer dans le dossier "Films":`, error.response?.data || error.message)
      }
    }
    
    return existing.id
  }

  // Si l'image n'existe pas, chercher dans le dossier temporaire pour l'uploader
  const imagePath = path.join(TEMP_IMAGES_DIR, imageFilename)
  
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️  Image non trouvée dans Directus ni dans le dossier temporaire: ${imageFilename}`)
    return null
  }

  const fileStream = fs.createReadStream(imagePath)
  const formData = new FormData()
  formData.append('file', fileStream)
  formData.append('folder', folderId) // Spécifier le dossier

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
 * Crée ou met à jour un film dans Directus
 */
async function createOrUpdateFilm(filmData) {
  try {
    // Vérifier si le film existe déjà
    const existing = await axiosInstance.get('/items/films', {
      params: { 
        filter: { slug: { _eq: filmData.slug } },
        limit: 1
      },
    })

    if (existing.data.data.length > 0) {
      // Mise à jour
      const existingId = existing.data.data[0].id
      console.log(`🔄 Mise à jour du film existant: ${filmData.title}`)
      await axiosInstance.patch(`/items/films/${existingId}`, filmData)
      console.log(`✅ Film mis à jour: ${filmData.title}`)
      return existingId
    } else {
      // Création
      console.log(`➕ Création du nouveau film: ${filmData.title}`)
      const response = await axiosInstance.post('/items/films', filmData)
      console.log(`✅ Film créé: ${filmData.title} (ID: ${response.data.data.id})`)
      return response.data.data.id
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la création/mise à jour:`, error.response?.data || error.message)
    throw error
  }
}

/**
 * Traite un film
 */
async function processFilm(data) {
  // Générer le slug si non fourni
  const slug = data.slug || generateSlug(data.title)
  
  if (!data.title) {
    throw new Error('Le titre est obligatoire')
  }

  // Trouver ou uploader l'image si fournie
  let imageId = null
  if (data.image) {
    console.log(`\n🖼️  Traitement de l'image pour "${data.title}": ${data.image}`)
    imageId = await findOrUploadImage(data.image)
    if (!imageId) {
      console.warn(`⚠️  Aucune image trouvée ou uploadée pour "${data.title}" - le film sera créé sans image`)
    }
  } else {
    console.log(`\nℹ️  Aucune image spécifiée pour "${data.title}"`)
  }

  // Préparer les données pour Directus
  const filmData = {
    slug,
    title: data.title,
    ...(imageId && { image: imageId }),
    ...(data.type && { type: data.type }),
    ...(data.duree && { duree: data.duree }),
    ...(data.annee && { annee: data.annee }),
    ...(data.langue && { langue: data.langue }),
    ...(data.pays_production && { pays_production: data.pays_production }),
    ...(data.short_synopsis && { short_synopsis: data.short_synopsis }),
    ...(data.realisation && { realisation: data.realisation }),
    ...(data.mixage && { mixage: data.mixage }),
    ...(data.son && { son: data.son }),
    ...(data.musique && { musique: data.musique }),
    ...(data.montage && { montage: data.montage }),
    ...(data.avec && { avec: data.avec }),
    ...(data.production && { production: data.production }),
    ...(data.producteurs && { producteurs: data.producteurs }),
    ...(data.scenario && { scenario: data.scenario }),
    ...(data.assistants_mise_en_scene && { assistants_mise_en_scene: data.assistants_mise_en_scene }),
    ...(data.assistante_mise_en_scene && { assistante_mise_en_scene: data.assistante_mise_en_scene }),
    ...(data.assistants_images && { assistants_images: data.assistants_images }),
    ...(data.steadycamer && { steadycamer: data.steadycamer }),
    ...(data.etalonnage && { etalonnage: data.etalonnage }),
    ...(data.montage_son && { montage_son: data.montage_son }),
    ...(data.realisateur_captation && { realisateur_captation: data.realisateur_captation }),
    ...(data.image_captation && { image_captation: data.image_captation }),
    ...(data.diffusion && { diffusion: data.diffusion }),
    ...(data.selection && { selection: data.selection }),
    ...(data.lien_film && { lien_film: data.lien_film }),
    ...(data.body && { body: data.body }),
  }

  // Créer ou mettre à jour dans Directus
  await createOrUpdateFilm(filmData)
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

    console.log(`\n🎬 Import de ${items.length} film(s)...\n`)

    for (const item of items) {
      try {
        await processFilm(item)
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
      title: "Mon film",
      slug: "mon-film", // optionnel, généré automatiquement si absent
      image: "mon-image.jpg", // nom du fichier dans le dossier temporaire
      body: "Contenu markdown...",
      short_synopsis: "Synopsis court",
      type: "Documentaire",
      duree: "90 min",
      annee: "2024",
      langue: "Français",
      pays_production: "France",
      realisation: "Nom du réalisateur",
      mixage: "Nom du mixeur",
      son: "Nom du preneur de son",
      musique: "Compositeur",
      montage: "Monteur",
      avec: "Acteurs principaux",
      production: "Nom de la production",
      producteurs: "Producteur(s)",
      scenario: "Scénariste",
      assistants_mise_en_scene: "Assistants mise en scène",
      assistante_mise_en_scene: "Assistante mise en scène",
      assistants_images: "Assistants images",
      steadycamer: "Steadycam operator",
      etalonnage: "Étalonneur",
      montage_son: "Monteur son",
      realisateur_captation: "Réalisateur captation",
      image_captation: "Image captation",
      diffusion: ["Festival 1", "Festival 2"],
      selection: ["Sélection 1"],
      lien_film: "https://example.com/film"
    }, null, 2))
    console.log('\n📁 Placez vos images dans:', TEMP_IMAGES_DIR)
  }
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

