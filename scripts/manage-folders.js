#!/usr/bin/env node

/**
 * Script pour gérer les dossiers dans Directus
 * Nettoie tous les dossiers et ne garde que "Images", "Vidéos" et "Actualités"
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

/**
 * Liste tous les dossiers dans Directus
 */
async function listFolders() {
  try {
    const response = await axiosInstance.get('/folders', {
      params: {
        limit: -1,
        fields: 'id,name,parent'
      }
    })
    return response.data.data || []
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des dossiers:', error.response?.data || error.message)
    return []
  }
}

/**
 * Trouve un dossier par son nom
 */
async function findFolder(folderName) {
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
 * Liste les fichiers dans un dossier
 */
async function listFilesInFolder(folderId) {
  try {
    const response = await axiosInstance.get('/files', {
      params: {
        filter: {
          folder: {
            _eq: folderId
          }
        },
        limit: -1,
        fields: 'id,filename_download'
      }
    })
    return response.data.data || []
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des fichiers du dossier:`, error.response?.data || error.message)
    return []
  }
}

/**
 * Déplace un fichier vers la racine (sans dossier)
 */
async function moveFileToRoot(fileId) {
  try {
    await axiosInstance.patch(`/files/${fileId}`, {
      folder: null
    })
    return true
  } catch (error) {
    console.error(`❌ Erreur lors du déplacement du fichier ${fileId}:`, error.response?.data || error.message)
    return false
  }
}

/**
 * Supprime un dossier
 */
async function deleteFolder(folderId) {
  try {
    await axiosInstance.delete(`/folders/${folderId}`)
    return true
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression du dossier:`, error.response?.data || error.message)
    return false
  }
}

/**
 * Crée un dossier ou retourne son ID s'il existe déjà
 */
async function getOrCreateFolder(folderName) {
  try {
    const existing = await findFolder(folderName)
    if (existing) {
      return existing.id
    }
    
    const response = await axiosInstance.post('/folders', {
      name: folderName
    })
    return response.data.data.id
  } catch (error) {
    console.error(`❌ Erreur lors de la création du dossier "${folderName}":`, error.response?.data || error.message)
    throw error
  }
}

/**
 * Supprime les dossiers "Accueil - ..."
 */
async function removeAccueilFolders() {
  console.log('\n🗑️  Suppression des dossiers "Accueil - ..."...\n')
  
  const foldersToRemove = [
    'Accueil - Actualités',
    'Accueil - Films',
    'Accueil - Médiations',
    'Accueil - Vidéo/art',
    'Accueil - Vidéos/art' // Variante possible
  ]
  
  let removed = 0
  let errors = 0
  
  for (const folderName of foldersToRemove) {
    const folder = await findFolder(folderName)
    
    if (!folder) {
      console.log(`⏭️  Dossier "${folderName}" non trouvé, ignoré`)
      continue
    }
    
    console.log(`📁 Traitement du dossier "${folderName}" (ID: ${folder.id})...`)
    
    // Lister les fichiers dans ce dossier
    const files = await listFilesInFolder(folder.id)
    
    if (files.length > 0) {
      console.log(`   📄 ${files.length} fichier(s) trouvé(s), déplacement vers la racine...`)
      
      let moved = 0
      for (const file of files) {
        const success = await moveFileToRoot(file.id)
        if (success) {
          moved++
        } else {
          errors++
        }
      }
      
      console.log(`   ✅ ${moved} fichier(s) déplacé(s) vers la racine`)
    } else {
      console.log(`   📄 Aucun fichier dans ce dossier`)
    }
    
    // Supprimer le dossier
    const deleted = await deleteFolder(folder.id)
    if (deleted) {
      console.log(`   ✅ Dossier "${folderName}" supprimé\n`)
      removed++
    } else {
      console.log(`   ❌ Erreur lors de la suppression du dossier "${folderName}"\n`)
      errors++
    }
  }
  
  console.log(`\n✅ Suppression terminée!`)
  console.log(`   - ${removed} dossier(s) supprimé(s)`)
  if (errors > 0) {
    console.log(`   - ${errors} erreur(s)`)
  }
}

/**
 * Crée les dossiers "Images", "Vidéos" et "Actualités"
 */
async function createMediaFolders() {
  console.log('\n📁 Création des dossiers "Images", "Vidéos" et "Actualités"...\n')
  
  try {
    const imagesFolderId = await getOrCreateFolder('Images')
    console.log(`✅ Dossier "Images" créé ou trouvé (ID: ${imagesFolderId})`)
    
    const videosFolderId = await getOrCreateFolder('Vidéos')
    console.log(`✅ Dossier "Vidéos" créé ou trouvé (ID: ${videosFolderId})`)
    
    const actusFolderId = await getOrCreateFolder('Actualités')
    console.log(`✅ Dossier "Actualités" créé ou trouvé (ID: ${actusFolderId})\n`)
    
    return { imagesFolderId, videosFolderId, actusFolderId }
  } catch (error) {
    console.error(`❌ Erreur lors de la création des dossiers:`, error.message)
    throw error
  }
}

/**
 * Supprime tous les dossiers sauf "Images", "Vidéos" et "Actualités"
 */
async function cleanupAllFolders() {
  console.log('\n🧹 Nettoyage de tous les dossiers (sauf "Images", "Vidéos" et "Actualités")...\n')
  
  const foldersToKeep = ['Images', 'Vidéos', 'Actualités']
  const allFolders = await listFolders()
  
  let removed = 0
  let errors = 0
  
  for (const folder of allFolders) {
    // Ignorer les dossiers à garder
    if (foldersToKeep.includes(folder.name)) {
      console.log(`⏭️  Dossier "${folder.name}" conservé`)
      continue
    }
    
    console.log(`📁 Traitement du dossier "${folder.name}" (ID: ${folder.id})...`)
    
    // Lister les fichiers dans ce dossier
    const files = await listFilesInFolder(folder.id)
    
    if (files.length > 0) {
      console.log(`   📄 ${files.length} fichier(s) trouvé(s), déplacement vers la racine...`)
      
      let moved = 0
      for (const file of files) {
        const success = await moveFileToRoot(file.id)
        if (success) {
          moved++
        } else {
          errors++
        }
      }
      
      console.log(`   ✅ ${moved} fichier(s) déplacé(s) vers la racine`)
    } else {
      console.log(`   📄 Aucun fichier dans ce dossier`)
    }
    
    // Supprimer le dossier
    const deleted = await deleteFolder(folder.id)
    if (deleted) {
      console.log(`   ✅ Dossier "${folder.name}" supprimé\n`)
      removed++
    } else {
      console.log(`   ❌ Erreur lors de la suppression du dossier "${folder.name}"\n`)
      errors++
    }
  }
  
  console.log(`\n✅ Nettoyage terminé!`)
  console.log(`   - ${removed} dossier(s) supprimé(s)`)
  if (errors > 0) {
    console.log(`   - ${errors} erreur(s)`)
  }
}

/**
 * Affiche tous les dossiers
 */
async function listAllFolders() {
  console.log('\n📁 Liste de tous les dossiers:\n')
  
  const folders = await listFolders()
  
  if (folders.length === 0) {
    console.log('   Aucun dossier trouvé')
    return
  }
  
  folders.forEach(folder => {
    const parentInfo = folder.parent ? ` (parent: ${folder.parent})` : ' (racine)'
    console.log(`   📁 ${folder.name}${parentInfo} (ID: ${folder.id})`)
  })
  
  console.log(`\n   Total: ${folders.length} dossier(s)`)
}

/**
 * Affiche l'aide
 */
function showHelp() {
  console.log(`
📋 Script de gestion des dossiers dans Directus

Usage: node manage-folders.js [commande]

Commandes disponibles:
  cleanup         Supprime tous les dossiers sauf "Images", "Vidéos" et "Actualités"
                  Les fichiers sont déplacés vers la racine avant suppression
  create-media    Crée les dossiers "Images", "Vidéos" et "Actualités"
  list            Liste tous les dossiers
  all             Exécute toutes les opérations (cleanup + create-media)
  help            Affiche cette aide

Exemples:
  node manage-folders.js list
  node manage-folders.js cleanup
  node manage-folders.js create-media
  node manage-folders.js all

Configuration requise dans .env:
  - DIRECTUS_PUBLIC_URL ou NEXT_PUBLIC_DIRECTUS_URL
  - DIRECTUS_STATIC_TOKEN (recommandé) ou DIRECTUS_ADMIN_EMAIL + DIRECTUS_ADMIN_PASSWORD
`)
}

async function main() {
  const command = process.argv[2] || 'help'
  
  await initAxios()
  
  switch (command) {
    case 'cleanup':
      await cleanupAllFolders()
      break
    case 'create-media':
      await createMediaFolders()
      break
    case 'list':
      await listAllFolders()
      break
    case 'all':
      await cleanupAllFolders()
      await createMediaFolders()
      await listAllFolders()
      break
    case 'help':
    default:
      showHelp()
      break
  }
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

