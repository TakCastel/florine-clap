#!/usr/bin/env node

/**
 * Script pour corriger spécifiquement le champ image de videos_art
 * Force la mise à jour du champ pour qu'il fonctionne comme les autres collections
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

async function fixVideosArtImageField() {
  await initAxios()
  console.log('🔧 Correction du champ image pour videos_art...\n')

  const collection = 'videos_art'
  const field = 'image'

  try {
    // 1. Récupérer le champ actuel
    console.log(`📋 Récupération du champ ${collection}.${field}...`)
    const fieldResponse = await axiosInstance.get(`/fields/${collection}/${field}`)
    const currentField = fieldResponse.data.data
    
    console.log('📦 Configuration actuelle:', {
      type: currentField.type,
      meta: currentField.meta,
    })

    // 2. Mettre à jour le champ avec la configuration correcte (identique à films.image)
    const updatedField = {
      type: 'uuid',
      meta: {
        ...currentField.meta,
        interface: 'file-image',
        special: ['file'],
        note: 'Image principale',
        display: 'file-image',
        display_options: {
          crop: true,
        },
        width: 'full',
        required: false,
      },
    }

    console.log(`\n🔧 Mise à jour du champ ${collection}.${field}...`)
    await axiosInstance.patch(`/fields/${collection}/${field}`, updatedField)
    console.log(`✅ Champ ${collection}.${field} mis à jour`)

    // 3. Vérifier et créer la relation si nécessaire
    console.log(`\n🔗 Vérification de la relation...`)
    const relationsResponse = await axiosInstance.get(`/relations/${collection}`)
    const relations = relationsResponse.data.data || []
    const relationExists = relations.some(rel => rel.field === field && rel.related_collection === 'directus_files')
    
    if (!relationExists) {
      console.log(`📝 Création de la relation...`)
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
      console.log(`✅ Relation créée`)
    } else {
      console.log(`✅ Relation existe déjà`)
    }

    console.log(`\n✅ Correction terminée!`)
    console.log(`💡 Rafraîchissez l'interface Directus et essayez d'associer une image à un videos_art.`)

  } catch (error) {
    console.error(`❌ Erreur:`, error.response?.data || error.message)
    if (error.response?.data?.errors) {
      console.error(`Détails:`, error.response.data.errors)
    }
    process.exit(1)
  }
}

fixVideosArtImageField().catch((error) => {
  console.error('❌ Erreur lors de la correction:', error.response?.data || error.message)
  process.exit(1)
})

