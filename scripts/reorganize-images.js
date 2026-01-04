#!/usr/bin/env node

/**
 * Script pour réorganiser les images dans Directus
 * Permet de lister, déplacer et réorganiser les images entre dossiers
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
 * Crée un dossier ou retourne son ID s'il existe déjà
 */
async function getOrCreateFolder(folderName, parentId = null) {
  try {
    // Vérifier si le dossier existe
    const filter = { name: { _eq: folderName } }
    if (parentId) {
      filter.parent = { _eq: parentId }
    } else {
      filter.parent = { _null: true }
    }
    
    const response = await axiosInstance.get('/folders', {
      params: {
        filter,
        limit: 1
      }
    })
    
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0].id
    }
    
    // Créer le dossier
    const createData = { name: folderName }
    if (parentId) {
      createData.parent = parentId
    }
    
    const createResponse = await axiosInstance.post('/folders', createData)
    return createResponse.data.data.id
  } catch (error) {
    console.error(`❌ Erreur lors de la création/récupération du dossier "${folderName}":`, error.response?.data || error.message)
    throw error
  }
}

/**
 * Liste tous les fichiers dans Directus avec leurs dossiers
 */
async function listFiles(folderId = null, limit = -1) {
  try {
    const params = {
      limit,
      fields: 'id,filename_download,title,type,folder,width,height,filesize,uploaded_on'
    }
    
    if (folderId) {
      params.filter = { folder: { _eq: folderId } }
    }
    
    const response = await axiosInstance.get('/files', { params })
    return response.data.data || []
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des fichiers:', error.response?.data || error.message)
    return []
  }
}

/**
 * Déplace un fichier vers un autre dossier
 */
async function moveFile(fileId, targetFolderId) {
  try {
    await axiosInstance.patch(`/files/${fileId}`, {
      folder: targetFolderId
    })
    return true
  } catch (error) {
    console.error(`❌ Erreur lors du déplacement du fichier ${fileId}:`, error.response?.data || error.message)
    return false
  }
}

/**
 * Affiche la structure des dossiers et fichiers
 */
async function displayStructure() {
  console.log('\n📁 Structure des dossiers et fichiers dans Directus:\n')
  
  const folders = await listFolders()
  const allFiles = await listFiles()
  
  // Créer un map folderId -> folder
  const folderMap = new Map()
  folders.forEach(folder => {
    folderMap.set(folder.id, folder)
  })
  
  // Grouper les fichiers par dossier
  const filesByFolder = new Map()
  const filesWithoutFolder = []
  
  allFiles.forEach(file => {
    if (file.folder) {
      if (!filesByFolder.has(file.folder)) {
        filesByFolder.set(file.folder, [])
      }
      filesByFolder.get(file.folder).push(file)
    } else {
      filesWithoutFolder.push(file)
    }
  })
  
  // Afficher les dossiers avec leurs fichiers
  folders.forEach(folder => {
    const files = filesByFolder.get(folder.id) || []
    const parentName = folder.parent && folderMap.get(folder.parent) 
      ? ` (dans "${folderMap.get(folder.parent).name}")` 
      : ''
    console.log(`📁 ${folder.name}${parentName} (ID: ${folder.id})`)
    if (files.length > 0) {
      files.forEach(file => {
        const size = file.filesize ? ` (${(file.filesize / 1024).toFixed(1)} KB)` : ''
        console.log(`   📄 ${file.filename_download}${size}`)
      })
      console.log(`   Total: ${files.length} fichier(s)`)
    } else {
      console.log(`   (vide)`)
    }
    console.log()
  })
  
  // Afficher les fichiers sans dossier
  if (filesWithoutFolder.length > 0) {
    console.log(`📁 Fichiers sans dossier (${filesWithoutFolder.length}):`)
    filesWithoutFolder.forEach(file => {
      const size = file.filesize ? ` (${(file.filesize / 1024).toFixed(1)} KB)` : ''
      console.log(`   📄 ${file.filename_download}${size}`)
    })
    console.log()
  }
  
  console.log(`\n📊 Statistiques:`)
  console.log(`   - ${folders.length} dossier(s)`)
  console.log(`   - ${allFiles.length} fichier(s) total`)
}

/**
 * Réorganise les fichiers par type (extension)
 */
async function reorganizeByType() {
  console.log('\n🔄 Réorganisation des fichiers par type...\n')
  
  const allFiles = await listFiles()
  const filesByType = new Map()
  
  // Grouper par extension
  allFiles.forEach(file => {
    const ext = path.extname(file.filename_download).toLowerCase().replace('.', '') || 'autres'
    if (!filesByType.has(ext)) {
      filesByType.set(ext, [])
    }
    filesByType.get(ext).push(file)
  })
  
  let moved = 0
  let errors = 0
  
  for (const [ext, files] of filesByType.entries()) {
    if (files.length === 0) continue
    
    const folderName = ext.charAt(0).toUpperCase() + ext.slice(1)
    const folderId = await getOrCreateFolder(folderName)
    
    console.log(`📁 Dossier "${folderName}": ${files.length} fichier(s)`)
    
    for (const file of files) {
      if (file.folder !== folderId) {
        const success = await moveFile(file.id, folderId)
        if (success) {
          moved++
          console.log(`   ✅ ${file.filename_download}`)
        } else {
          errors++
        }
      }
    }
    console.log()
  }
  
  console.log(`\n✅ Réorganisation terminée!`)
  console.log(`   - ${moved} fichier(s) déplacé(s)`)
  if (errors > 0) {
    console.log(`   - ${errors} erreur(s)`)
  }
}

/**
 * Déplace tous les fichiers sans dossier vers un dossier "Non classés"
 */
async function moveUnorganizedFiles() {
  console.log('\n🔄 Déplacement des fichiers non classés...\n')
  
  const allFiles = await listFiles()
  const unorganizedFiles = allFiles.filter(file => !file.folder)
  
  if (unorganizedFiles.length === 0) {
    console.log('✅ Aucun fichier non classé trouvé!')
    return
  }
  
  const folderId = await getOrCreateFolder('Non classés')
  let moved = 0
  let errors = 0
  
  console.log(`📁 Déplacement de ${unorganizedFiles.length} fichier(s) vers "Non classés"...\n`)
  
  for (const file of unorganizedFiles) {
    const success = await moveFile(file.id, folderId)
    if (success) {
      moved++
      console.log(`   ✅ ${file.filename_download}`)
    } else {
      errors++
    }
  }
  
  console.log(`\n✅ Déplacement terminé!`)
  console.log(`   - ${moved} fichier(s) déplacé(s)`)
  if (errors > 0) {
    console.log(`   - ${errors} erreur(s)`)
  }
}

/**
 * Affiche l'aide
 */
function showHelp() {
  console.log(`
📋 Script de réorganisation des images dans Directus

Usage: node reorganize-images.js [commande]

Commandes disponibles:
  list          Affiche la structure actuelle des dossiers et fichiers
  by-type       Réorganise les fichiers par type (extension) dans des dossiers
  unorganized   Déplace tous les fichiers sans dossier vers "Non classés"
  help          Affiche cette aide

Exemples:
  node reorganize-images.js list
  node reorganize-images.js by-type
  node reorganize-images.js unorganized

Configuration requise dans .env:
  - DIRECTUS_PUBLIC_URL ou NEXT_PUBLIC_DIRECTUS_URL
  - DIRECTUS_STATIC_TOKEN (recommandé) ou DIRECTUS_ADMIN_EMAIL + DIRECTUS_ADMIN_PASSWORD
`)
}

async function main() {
  const command = process.argv[2] || 'help'
  
  await initAxios()
  
  switch (command) {
    case 'list':
      await displayStructure()
      break
    case 'by-type':
      await reorganizeByType()
      break
    case 'unorganized':
      await moveUnorganizedFiles()
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

