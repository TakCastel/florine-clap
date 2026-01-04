/**
 * Wrapper pour l'authentification Directus côté serveur
 */

import { createDirectus, rest, staticToken, authentication } from '@directus/sdk'
import type { Schema } from './directus-types'

const directusUrl = process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const staticTokenValue = process.env.DIRECTUS_STATIC_TOKEN || ''

// Cache pour le token admin
let adminToken: string | null = null
let adminTokenExpiry: number = 0
let tokenRefreshPromise: Promise<string | null> | null = null

/**
 * Invalide le cache du token admin (utile en cas d'erreur 401)
 */
export function invalidateAdminToken() {
  adminToken = null
  adminTokenExpiry = 0
  adminClient = null
  adminClientToken = null
}

/**
 * Obtient un token admin (côté serveur uniquement)
 */
async function getAdminToken(): Promise<string | null> {
  // Vérifier si on a un token valide en cache
  if (adminToken && Date.now() < adminTokenExpiry) {
    return adminToken
  }

  // Si un refresh est déjà en cours, attendre qu'il se termine
  if (tokenRefreshPromise) {
    return await tokenRefreshPromise
  }

  // Créer une nouvelle promesse de refresh
  tokenRefreshPromise = (async () => {
    try {
      const adminEmail = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
      const adminPassword = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

      const response = await fetch(`${directusUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erreur lors de l\'authentification admin:', response.status, errorText)
        return null
      }

      const data = await response.json()
      adminToken = data.data.access_token
      // Le token expire dans 15 minutes, on le met en cache pour 13 minutes (marge de sécurité)
      adminTokenExpiry = Date.now() + 13 * 60 * 1000

      return adminToken
    } catch (error) {
      console.error('Erreur lors de l\'authentification admin:', error)
      return null
    } finally {
      tokenRefreshPromise = null
    }
  })()

  return await tokenRefreshPromise
}

// Cache pour le client avec token admin (côté serveur)
let adminClient: ReturnType<typeof createDirectus<Schema>> | null = null
let adminClientToken: string | null = null

/**
 * Crée un client Directus avec authentification
 */
export async function getDirectusClient() {
  if (staticTokenValue) {
    // Utiliser le token statique si disponible
    return createDirectus<Schema>(directusUrl)
      .with(rest())
      .with(staticToken(staticTokenValue))
  }

  // Sinon, utiliser le token admin (côté serveur uniquement)
  if (typeof window === 'undefined') {
    const token = await getAdminToken()
    if (token) {
      // Si le token a changé ou si on n'a pas de client, créer un nouveau client
      if (!adminClient || adminClientToken !== token) {
        adminClient = createDirectus<Schema>(directusUrl)
          .with(rest())
          .with(staticToken(token))
        adminClientToken = token
      }
      return adminClient
    }
    // Si l'authentification admin échoue, essayer quand même avec un client sans auth
    // (peut fonctionner si les permissions publiques sont configurées)
  }

  // Fallback : client sans authentification (peut échouer)
  return createDirectus<Schema>(directusUrl).with(rest())
}

