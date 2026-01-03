#!/usr/bin/env node

/**
 * Crée un token statique dans Directus et l'affiche
 * En Directus 11, les tokens statiques sont créés via l'interface ou via SQL
 */

const axios = require('axios')
const { execSync } = require('child_process')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

async function createStaticToken() {
  try {
    console.log('🔐 Création d\'un token statique pour Directus...\n')
    
    // Login pour obtenir un token admin
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    const adminToken = loginResponse.data.data.access_token

    const axiosInstance = axios.create({
      baseURL: DIRECTUS_URL,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    })

    // Récupérer le policy Public
    const policiesResponse = await axiosInstance.get('/policies')
    const publicPolicy = policiesResponse.data.data.find(p => 
      !p.admin_access || p.name?.toLowerCase().includes('public') || p.name === '$t:public_label'
    )

    if (!publicPolicy) {
      console.error('❌ Policy Public non trouvé')
      console.error('   Les policies disponibles:', policiesResponse.data.data.map(p => ({ name: p.name, admin: p.admin_access })))
      process.exit(1)
    }

    console.log(`✅ Policy Public trouvé: ${publicPolicy.name} (${publicPolicy.id})\n`)

    // Pour le développement, utiliser le token admin (expire après 15 min)
    console.log('📋 Pour le développement, utilisez ce token admin (expire après 15 min) :\n')
    console.log(`DIRECTUS_STATIC_TOKEN=${adminToken}\n`)
    console.log('⚠️  Note: Ce token expire après 15 minutes.')
    console.log('\n💡 Pour la production, créez un token statique dans Directus :')
    console.log('   1. Ouvrez Directus: http://localhost:8055')
    console.log('   2. Settings > Access Tokens')
    console.log('   3. Create Token')
    console.log('   4. Sélectionnez le policy "Public"')
    console.log('   5. Copiez le token et ajoutez-le dans .env')
    console.log('\n💡 Le frontend utilise ce token pour accéder aux données publiques')
    console.log('\n💡 Alternative: Utilisez le token admin ci-dessus pour le développement')

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message)
    if (error.response?.data) {
      console.error('   Détails:', JSON.stringify(error.response.data, null, 2))
    }
    process.exit(1)
  }
}

createStaticToken()
