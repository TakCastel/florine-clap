#!/usr/bin/env node

/**
 * Script pour corriger les relations de fichiers dans Directus
 * 
 * Ce script crée explicitement les relations manquantes entre les collections
 * et directus_files pour que l'association de fichiers fonctionne dans l'interface
 */

const axios = require('axios')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

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
 * Vérifie si une relation existe déjà
 */
async function relationExists(collection, field) {
  try {
    const response = await axiosInstance.get(`/relations/${collection}`)
    const relations = response.data.data || []
    return relations.some(rel => rel.field === field && rel.related_collection === 'directus_files')
  } catch (error) {
    return false
  }
}

/**
 * Crée une relation pour un champ fichier simple (one-to-one)
 */
async function createFileRelation(collection, field) {
  const relationKey = `${collection}_${field}_directus_files`
  
  // Vérifier si la relation existe déjà
  if (await relationExists(collection, field)) {
    console.log(`  ✓ Relation pour "${collection}.${field}" existe déjà`)
    return true
  }

  try {
    // Créer la relation
    await axiosInstance.post('/relations', {
      collection: collection,
      field: field,
      related_collection: 'directus_files',
      schema: {
        on_delete: 'SET NULL',
      },
      meta: {
        one_field: null,
        sort_field: null,
        one_deselect_action: 'nullify',
        one_allowed_collections: null,
        junction_field: null,
      },
    })
    console.log(`  ✅ Relation créée pour "${collection}.${field}"`)
    return true
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      // Relation existe peut-être déjà avec un nom différent
      console.log(`  ⚠️  Erreur lors de la création de la relation pour "${collection}.${field}":`, error.response.data.errors[0]?.message || 'Relation existe peut-être déjà')
    } else {
      console.error(`  ❌ Erreur lors de la création de la relation pour "${collection}.${field}":`, error.response?.data || error.message)
    }
    return false
  }
}

/**
 * Crée une relation many-to-many pour un champ files (galerie)
 */
async function createFilesRelation(collection, field) {
  // Pour les champs "files", Directus crée automatiquement une table de jonction
  // Il faut créer la relation vers cette table de jonction
  const junctionTable = `${collection}_${field}`
  
  if (await relationExists(collection, field)) {
    console.log(`  ✓ Relation pour "${collection}.${field}" (galerie) existe déjà`)
    return true
  }

  try {
    // Créer la relation many-to-many
    await axiosInstance.post('/relations', {
      collection: collection,
      field: field,
      related_collection: 'directus_files',
      schema: {
        on_delete: 'SET NULL',
      },
      meta: {
        one_field: null,
        sort_field: null,
        one_deselect_action: 'nullify',
        one_allowed_collections: null,
        junction_field: 'directus_files_id',
      },
    })
    console.log(`  ✅ Relation créée pour "${collection}.${field}" (galerie)`)
    return true
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.errors) {
      console.log(`  ⚠️  Erreur lors de la création de la relation pour "${collection}.${field}":`, error.response.data.errors[0]?.message || 'Relation existe peut-être déjà')
    } else {
      console.error(`  ❌ Erreur lors de la création de la relation pour "${collection}.${field}":`, error.response?.data || error.message)
    }
    return false
  }
}

/**
 * Met à jour un champ pour ajouter la propriété special si nécessaire
 */
async function updateFieldSpecial(collection, field) {
  try {
    // Récupérer le champ actuel
    const response = await axiosInstance.get(`/fields/${collection}/${field}`)
    const currentField = response.data.data
    
    // Vérifier si le champ a déjà la propriété special
    if (currentField.meta?.special?.includes('file')) {
      return // Déjà configuré
    }

    // Mettre à jour le champ avec la propriété special
    const updatedMeta = {
      ...currentField.meta,
      special: ['file'],
    }

    await axiosInstance.patch(`/fields/${collection}/${field}`, {
      meta: updatedMeta,
    })
    console.log(`  ✅ Propriété 'special' ajoutée au champ "${collection}.${field}"`)
    return true
  } catch (error) {
    console.warn(`  ⚠️  Impossible de mettre à jour le champ "${collection}.${field}":`, error.response?.data?.errors?.[0]?.message || error.message)
    return false
  }
}

/**
 * Corrige toutes les relations de fichiers
 */
async function fixFileRelations() {
  await initAxios()
  console.log('🔧 Correction des relations de fichiers dans Directus...\n')

  // Définir tous les champs de fichiers par collection
  const fileFields = {
    films: [
      { field: 'image', type: 'single' },
      { field: 'content', type: 'single' },
      { field: 'heading', type: 'single' },
    ],
    mediations: [
      { field: 'cover', type: 'single' },
      { field: 'gallery', type: 'multiple' }, // Galerie = many-to-many
    ],
    actus: [
      { field: 'cover', type: 'single' },
    ],
    pages: [
      { field: 'portrait', type: 'single' },
      { field: 'hero_image', type: 'single' },
    ],
    videos_art: [
      { field: 'image', type: 'single' },
    ],
    home_settings: [
      { field: 'hero_video', type: 'single' },
      { field: 'bio_image', type: 'single' },
    ],
  }

  let total = 0
  let created = 0
  let skipped = 0

  for (const [collection, fields] of Object.entries(fileFields)) {
    console.log(`\n📁 Collection "${collection}":`)
    
    for (const { field, type } of fields) {
      total++
      
      // 1. Mettre à jour le champ pour ajouter la propriété special
      await updateFieldSpecial(collection, field)
      
      // 2. Créer la relation
      const success = type === 'multiple' 
        ? await createFilesRelation(collection, field)
        : await createFileRelation(collection, field)
      
      if (success) {
        created++
      } else {
        skipped++
      }
    }
  }

  console.log(`\n\n✅ Correction terminée!`)
  console.log(`📊 Résumé:`)
  console.log(`   Total: ${total}`)
  console.log(`   Créées/Vérifiées: ${created}`)
  console.log(`   Ignorées: ${skipped}`)
  console.log(`\n💡 Si des relations existaient déjà, c'est normal.`)
  console.log(`💡 Essayez maintenant d'associer des fichiers depuis l'interface Directus.`)
}

fixFileRelations().catch((error) => {
  console.error('❌ Erreur lors de la correction:', error.response?.data || error.message)
  process.exit(1)
})

