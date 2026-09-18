/**
 * Script pour ajouter le champ "type" (extrait / flyer) à la collection actus dans Directus
 *
 * Usage: npx tsx scripts/add-actu-type-field.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

const rootEnvPath = path.join(process.cwd(), '..', '.env')
const localEnvPath = path.join(process.cwd(), '.env')
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath })
} else if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath })
} else {
  dotenv.config()
}

const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'
const DIRECTUS_STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || ''

async function authenticate(): Promise<string> {
  if (DIRECTUS_STATIC_TOKEN) {
    return DIRECTUS_STATIC_TOKEN
  }

  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur d'authentification: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data.access_token
}

async function fieldExists(token: string): Promise<boolean> {
  const response = await fetch(`${DIRECTUS_URL}/fields/actus/type`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response.ok
}

const fieldDefinition = {
  collection: 'actus',
  field: 'type',
  type: 'string',
  schema: {
    default_value: 'extrait',
    is_nullable: false,
  },
  meta: {
    collection: 'actus',
    field: 'type',
    interface: 'select-dropdown',
    note: "Mise en page de l'article : extrait (image en bas, texte resserré) ou flyer (image en haut à droite, texte autour)",
    options: {
      choices: [
        { text: 'Extrait', value: 'extrait' },
        { text: 'Flyer', value: 'flyer' },
      ],
    },
    display: 'labels',
    display_options: {
      choices: [
        { text: 'Extrait', value: 'extrait', foreground: '#FFFFFF', background: '#6644FF' },
        { text: 'Flyer', value: 'flyer', foreground: '#FFFFFF', background: '#2ECDA7' },
      ],
    },
    required: false,
    sort: null,
  },
}

async function addTypeField(token: string): Promise<void> {
  const response = await fetch(`${DIRECTUS_URL}/fields/actus`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldDefinition),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de l'ajout du champ: ${response.status} - ${error}`)
  }

  console.log('✅ Champ "type" ajouté avec succès à la collection actus!')
}

async function main() {
  try {
    console.log('🔐 Authentification dans Directus...')
    const token = await authenticate()
    console.log('✅ Authentification réussie')

    console.log('🔍 Vérification si le champ "type" existe déjà...')
    const exists = await fieldExists(token)

    if (exists) {
      console.log('⚠️  Le champ "type" existe déjà dans la collection actus, rien à faire.')
      return
    }

    console.log('➕ Ajout du champ "type" à la collection actus...')
    await addTypeField(token)

    console.log('')
    console.log('📝 Prochaine étape : npm run directus:export puis commit du schema.yaml')
  } catch (error: any) {
    console.error('❌ Erreur:', error.message || error)
    process.exit(1)
  }
}

main()
