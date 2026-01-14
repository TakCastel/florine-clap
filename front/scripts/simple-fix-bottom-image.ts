/**
 * Script simple pour mettre à jour bottom_image avec la même config que hero_image
 * 
 * Usage: npx tsx scripts/simple-fix-bottom-image.ts
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '..', '.env') })

const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'
const DIRECTUS_STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || ''

async function authenticate(): Promise<string> {
  if (DIRECTUS_STATIC_TOKEN) return DIRECTUS_STATIC_TOKEN

  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DIRECTUS_ADMIN_EMAIL, password: DIRECTUS_ADMIN_PASSWORD }),
  })

  if (!response.ok) throw new Error(`Auth failed: ${response.status}`)
  return (await response.json()).data.access_token
}

async function main() {
  try {
    console.log('🔐 Connexion...')
    const token = await authenticate()
    
    console.log('📋 Récupération de hero_image...')
    const heroRes = await fetch(`${DIRECTUS_URL}/fields/pages/hero_image`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    const heroData = (await heroRes.json()).data
    
    console.log('🔄 Mise à jour de bottom_image...')
    const update = {
      meta: {
        ...heroData.meta,
        field: 'bottom_image',
        note: 'Image affichée en bas de la page',
      },
    }
    
    const response = await fetch(`${DIRECTUS_URL}/fields/pages/bottom_image`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erreur:', error)
      console.log('')
      console.log('💡 Solution: Créez le champ manuellement dans Directus:')
      console.log('   1. Settings > Data Model > Collections > pages')
      console.log('   2. Create Field')
      console.log('   3. Field Key: bottom_image')
      console.log('   4. Field Type: UUID')
      console.log('   5. Interface: File Image (ou File)')
      console.log('   6. Copiez les options de hero_image')
      process.exit(1)
    }

    console.log('✅ Terminé! Rafraîchissez Directus.')
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }
}

main()
