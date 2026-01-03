#!/usr/bin/env node

/**
 * Crée un token statique dans Directus via SQL
 * En Directus 11, on crée un utilisateur avec un token statique ou on utilise le token admin
 */

const { execSync } = require('child_process')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

async function createStaticToken() {
  try {
    console.log('🔐 Génération d\'un token pour Directus...\n')
    
    const axios = require('axios')
    
    // Login pour obtenir un token admin
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    const adminToken = loginResponse.data.data.access_token

    console.log('✅ Token admin obtenu!\n')
    console.log('📋 Utilisez ce token dans votre .env :\n')
    console.log(`DIRECTUS_STATIC_TOKEN=${adminToken}\n`)
    console.log('⚠️  Note: Ce token expire après 15 minutes.')
    console.log('\n💡 Pour le développement, vous pouvez utiliser ce token temporaire.')
    console.log('   Il sera automatiquement renouvelé côté serveur via getDirectusClient().')
    console.log('\n💡 Pour la production, deux options :')
    console.log('   1. Utiliser le token admin (renouvelé automatiquement côté serveur)')
    console.log('   2. Créer un utilisateur avec un token statique dans la base de données')
    console.log('\n💡 Le frontend utilise ce token pour accéder aux données publiques.')
    console.log('   Côté serveur, le client admin est utilisé automatiquement.\n')

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message)
    if (error.response?.data) {
      console.error('   Détails:', JSON.stringify(error.response.data, null, 2))
    }
    process.exit(1)
  }
}

createStaticToken()

