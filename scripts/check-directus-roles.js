#!/usr/bin/env node

const axios = require('axios')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'
const ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

async function checkRoles() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    const token = response.data.data.access_token

    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('Rôles disponibles:')
    rolesResponse.data.data.forEach(role => {
      console.log(`- ${role.name} (ID: ${role.id})`)
    })
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message)
  }
}

checkRoles()

