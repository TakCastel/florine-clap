#!/usr/bin/env node

/**
 * Ajoute automatiquement DIRECTUS_STATIC_TOKEN dans .env si il n'existe pas
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const envPath = path.resolve(__dirname, '..', '.env')

async function setupEnvToken() {
  try {
    // Lire le .env actuel
    let envContent = ''
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8')
    }

    // Vérifier si DIRECTUS_STATIC_TOKEN existe déjà
    if (envContent.includes('DIRECTUS_STATIC_TOKEN=')) {
      console.log('✅ DIRECTUS_STATIC_TOKEN est déjà configuré dans .env')
      return
    }

    // Générer un token admin temporaire
    console.log('🔐 Génération d\'un token admin temporaire...\n')
    
    const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
    const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
    const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

    const axios = require('axios')
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    const token = loginResponse.data.data.access_token

    // Ajouter le token dans .env
    const tokenLine = `DIRECTUS_STATIC_TOKEN=${token}\n`
    
    if (envContent && !envContent.endsWith('\n')) {
      envContent += '\n'
    }
    envContent += tokenLine

    fs.writeFileSync(envPath, envContent, 'utf-8')
    
    console.log('✅ Token ajouté dans .env')
    console.log('⚠️  Note: Ce token expire après 15 minutes.')
    console.log('💡 Pour la production, créez un token statique permanent dans Directus')
    console.log('   et remplacez DIRECTUS_STATIC_TOKEN dans .env\n')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    if (error.response) {
      console.error('   Détails:', error.response.data)
    }
    process.exit(1)
  }
}

setupEnvToken()

