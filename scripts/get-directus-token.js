#!/usr/bin/env node

/**
 * Script pour obtenir un token Directus via l'authentification admin
 */

const axios = require('axios')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

async function getToken() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    
    const token = response.data.data.access_token
    console.log('✅ Token obtenu avec succès!')
    console.log(`\nToken: ${token}\n`)
    console.log('Ajoutez cette ligne dans votre .env:')
    console.log(`DIRECTUS_STATIC_TOKEN=${token}`)
    
    return token
  } catch (error) {
    console.error('❌ Erreur lors de l\'obtention du token:', error.response?.data || error.message)
    process.exit(1)
  }
}

getToken()

