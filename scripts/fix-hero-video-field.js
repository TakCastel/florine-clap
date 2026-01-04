#!/usr/bin/env node

/**
 * Script pour corriger la configuration du champ hero_video dans home_settings
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

async function updateHeroVideoField() {
  console.log('🔧 Mise à jour de la configuration du champ hero_video...\n')
  
  try {
    // Récupérer la configuration actuelle du champ
    const currentField = await axiosInstance.get('/fields/home_settings/hero_video')
    console.log('📋 Configuration actuelle:', JSON.stringify(currentField.data.data, null, 2))
    
    // Mettre à jour le champ avec une meilleure configuration
    // Utiliser l'interface 'file' avec une configuration minimale
    const updatedField = {
      meta: {
        ...currentField.data.data.meta,
        interface: 'file', // Interface générique pour tous les fichiers
        note: 'Vidéo hero depuis Directus',
        options: null, // Pas d'options restrictives
        width: 'full',
        required: false,
        readonly: false,
        hidden: false,
      }
    }
    
    await axiosInstance.patch('/fields/home_settings/hero_video', updatedField)
    console.log('✅ Champ hero_video mis à jour avec succès!\n')
    
    // Vérifier la nouvelle configuration
    const updated = await axiosInstance.get('/fields/home_settings/hero_video')
    console.log('📋 Nouvelle configuration:', JSON.stringify(updated.data.data.meta, null, 2))
    
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('❌ Le champ hero_video n\'existe pas. Exécutez d\'abord setup-directus-schema.js')
    } else {
      console.error('❌ Erreur lors de la mise à jour:', error.response?.data || error.message)
    }
    throw error
  }
}

async function main() {
  await initAxios()
  await updateHeroVideoField()
  console.log('✅ Terminé!')
}

main().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})

