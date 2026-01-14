/**
 * Script pour appliquer le schéma Directus depuis un snapshot
 * 
 * Usage: npm run directus:apply
 * ou: npx tsx scripts/apply-directus-schema.ts [--dry-run]
 * 
 * Note: À exécuter depuis le dossier front/
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'

// Charger les variables d'environnement depuis la racine du projet
const rootEnvPath = path.join(process.cwd(), '..', '.env')
const localEnvPath = path.join(process.cwd(), '.env')

// Essayer d'abord la racine, puis le dossier front
let envLoaded = false
let envPath = ''
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath, override: true })
  envLoaded = true
  envPath = rootEnvPath
  console.log(`📄 Fichier .env chargé depuis: ${rootEnvPath}`)
} else if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: true })
  envLoaded = true
  envPath = localEnvPath
  console.log(`📄 Fichier .env chargé depuis: ${localEnvPath}`)
} else {
  // Essayer sans chemin spécifique (cherche automatiquement)
  dotenv.config({ override: true })
  console.log('📄 Tentative de chargement automatique du .env')
}

// Debug: afficher le répertoire de travail actuel
console.log(`📂 Répertoire de travail: ${process.cwd()}`)
if (envPath) {
  console.log(`📂 Chemin .env utilisé: ${envPath}`)
}

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const SNAPSHOT_PATH = path.join(process.cwd(), '..', 'directus', 'snapshots', 'schema.yaml')
const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')
const EXPORT_SERVER = process.argv.includes('--export-server')

// Fonction pour valider le format d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Fonction pour obtenir un token via l'authentification email/password
async function getAuthToken(): Promise<string> {
  const email = process.env.DIRECTUS_ADMIN_EMAIL?.trim()
  const password = process.env.DIRECTUS_ADMIN_PASSWORD?.trim()

  if (!email || !password) {
    console.error('\n❌ Variables d\'environnement manquantes:')
    console.error(`   DIRECTUS_ADMIN_EMAIL: ${email ? '✅ défini' : '❌ manquant ou vide'}`)
    console.error(`   DIRECTUS_ADMIN_PASSWORD: ${password ? '✅ défini' : '❌ manquant ou vide'}`)
    console.error('\n💡 Assurez-vous que ces variables sont définies dans votre fichier .env à la racine du projet')
    throw new Error('DIRECTUS_ADMIN_EMAIL et DIRECTUS_ADMIN_PASSWORD doivent être définis dans .env')
  }

  if (!isValidEmail(email)) {
    console.error(`\n❌ Format d'email invalide: "${email}"`)
    throw new Error(`DIRECTUS_ADMIN_EMAIL doit être une adresse email valide (actuellement: "${email}")`)
  }

  try {
    console.log(`   Email utilisé: "${email}"`)
    console.log(`   URL Directus: ${DIRECTUS_URL}`)
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email,
      password,
      mode: 'json'
    })

    return response.data.data.access_token
  } catch (error: any) {
    if (error.response) {
      const errorMsg = error.response.data?.errors?.[0]?.message || JSON.stringify(error.response.data)
      console.error(`\n   Détails de l'erreur:`)
      console.error(`   - Email envoyé: "${email}"`)
      console.error(`   - Longueur email: ${email?.length || 0} caractères`)
      console.error(`   - Réponse Directus: ${errorMsg}`)
      throw new Error(`Erreur d'authentification: ${errorMsg}`)
    }
    throw error
  }
}

async function exportServerSchema(token: string) {
  console.log('📸 Export du schéma depuis le serveur...\n')
  try {
    const response = await axios.get(`${DIRECTUS_URL}/schema/snapshot`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const serverSnapshot = response.data?.data || response.data
    const exportPath = path.join(process.cwd(), '..', 'directus', 'snapshots', 'schema-server.yaml')
    
    // S'assurer que le dossier existe
    const snapshotDir = path.dirname(exportPath)
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true })
    }
    
    fs.writeFileSync(exportPath, JSON.stringify(serverSnapshot, null, 2))
    console.log(`✅ Snapshot serveur exporté vers: ${exportPath}`)
    console.log(`\n💡 Comparez avec le snapshot local pour voir les différences`)
    
    // Vérifier si bottom_image existe dans pages
    const pagesFields = serverSnapshot.fields?.filter((f: any) => f.collection === 'pages' && f.field === 'bottom_image') || []
    if (pagesFields.length === 0) {
      console.log(`\n⚠️  Le champ 'bottom_image' n'existe PAS dans la collection 'pages' sur le serveur`)
    } else {
      console.log(`\n✅ Le champ 'bottom_image' existe dans la collection 'pages' sur le serveur`)
    }
  } catch (error: any) {
    console.error('❌ Erreur lors de l\'export:', error.message)
    if (error.response) {
      console.error('Réponse:', error.response.data)
    }
    throw error
  }
}

async function applySchema() {
  console.log(DRY_RUN ? '🔍 Prévisualisation de l\'application du schéma Directus...\n' : '🔄 Application du schéma Directus...\n')
  console.log(`URL: ${DIRECTUS_URL}`)
  console.log(`Snapshot: ${SNAPSHOT_PATH}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN (aucune modification)' : EXPORT_SERVER ? 'EXPORT SERVEUR' : 'APPLICATION'}\n`)
  
  // Afficher les chemins de .env testés pour le debug
  if (!process.env.DIRECTUS_ADMIN_EMAIL) {
    console.log('⚠️  Avertissement: DIRECTUS_ADMIN_EMAIL non trouvé')
    console.log(`   Chemins testés:`)
    console.log(`   - ${rootEnvPath} ${fs.existsSync(rootEnvPath) ? '✅ existe' : '❌ n\'existe pas'}`)
    console.log(`   - ${localEnvPath} ${fs.existsSync(localEnvPath) ? '✅ existe' : '❌ n\'existe pas'}`)
    console.log('')
  }

  // Vérifier que le fichier existe
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error(`❌ Erreur: Le fichier snapshot n'existe pas: ${SNAPSHOT_PATH}`)
    console.error('   Exécutez d\'abord: npm run directus:export')
    process.exit(1)
  }

  try {
    // Obtenir un token via l'authentification
    console.log('🔐 Authentification...')
    console.log(`   DIRECTUS_ADMIN_EMAIL depuis env: "${process.env.DIRECTUS_ADMIN_EMAIL || 'NON DÉFINI'}"`)
    const token = await getAuthToken()
    console.log('✅ Authentifié\n')
    
    // Si mode export serveur, exporter et quitter
    if (EXPORT_SERVER) {
      await exportServerSchema(token)
      return
    }

    // Lire le snapshot
    const snapshotContent = fs.readFileSync(SNAPSHOT_PATH, 'utf-8')
    const snapshotData = JSON.parse(snapshotContent)

    // Extraire le contenu de 'data' si présent, sinon utiliser le snapshot tel quel
    const snapshot = snapshotData.data || snapshotData

    if (DRY_RUN) {
      console.log('📋 Contenu du snapshot (extrait):')
      console.log(`   Version: ${snapshot.version || 'N/A'}`)
      console.log(`   Directus: ${snapshot.directus || 'N/A'}`)
      console.log(`   Collections: ${snapshot.collections?.length || 0}`)
      console.log('\n💡 Pour appliquer réellement, exécutez sans --dry-run')
    } else {
      // Appliquer le snapshot via l'API REST
      console.log('🔄 Application du snapshot...')
      console.log(`   Collections à appliquer: ${snapshot.collections?.length || 0}`)
      
      try {
        // Méthode 1: Essayer d'abord avec /schema/diff pour obtenir le hash
        console.log('   Étape 1: Calcul des différences...')
        const diffUrl = `${DIRECTUS_URL}/schema/diff${FORCE ? '?force=true' : ''}`
        const diffResponse = await axios.post(diffUrl, snapshot, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        // Si 204 No Content, il n'y a pas de différences
        if (diffResponse.status === 204) {
          console.log('   Aucune différence détectée (204 No Content)')
          throw new Error('NO_DIFF')
        }
        
        const diffResult = diffResponse.data?.data || diffResponse.data
        const hash = diffResult?.hash
        const diff = diffResult?.diff
        
        // Compter les différences réelles
        const collectionsDiff = diff?.collections?.reduce((acc: number, c: any) => acc + (c.diff?.length || 0), 0) || 0
        const fieldsDiff = diff?.fields?.reduce((acc: number, f: any) => acc + (f.diff?.length || 0), 0) || 0
        const relationsDiff = diff?.relations?.reduce((acc: number, r: any) => acc + (r.diff?.length || 0), 0) || 0
        const totalDiff = collectionsDiff + fieldsDiff + relationsDiff
        
        console.log(`   Différences trouvées:`)
        console.log(`   - Collections: ${collectionsDiff}`)
        console.log(`   - Champs: ${fieldsDiff}`)
        console.log(`   - Relations: ${relationsDiff}`)
        console.log(`   - Total: ${totalDiff} changements`)
        
        if (hash && diff && totalDiff > 0) {
          // Méthode 2: Appliquer avec le hash obtenu
          console.log('   Étape 2: Application des différences...')
          const applyResponse = await axios.post(`${DIRECTUS_URL}/schema/apply`, {
            hash: hash,
            diff: diff
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          console.log('✅ Schéma appliqué avec succès!')
        } else {
          // Aucune différence détectée
          console.log('ℹ️  Aucune différence détectée par /schema/diff')
          if (FORCE) {
            console.log('⚠️  Mode --force activé, mais l\'API /schema/apply nécessite un hash')
            console.log('💡 Le schéma semble déjà à jour selon Directus')
            console.log('💡 Si vous voyez des différences dans l\'admin:')
            console.log('   1. Vérifiez que le snapshot est bien à jour')
            console.log('   2. Redémarrez Directus: docker compose restart directus')
            console.log('   3. Vérifiez les logs: docker compose logs -f directus')
          } else {
            console.log('💡 Le schéma semble déjà à jour')
            console.log('💡 Si vous voyez des différences, utilisez --force ou vérifiez le snapshot')
          }
        }
      } catch (applyError: any) {
        // Gérer le cas où il n'y a pas de différences (204)
        if (applyError.message === 'NO_DIFF') {
          if (FORCE) {
            console.log('⚠️  Aucune différence détectée, mais --force activé')
            console.log('💡 L\'API /schema/apply nécessite un hash obtenu via /schema/diff')
            console.log('💡 Si le schéma n\'est pas à jour, il y a peut-être un problème de cache')
            console.log('💡 Essayez de redémarrer Directus: docker compose restart directus')
          } else {
            console.log('ℹ️  Aucune différence détectée, le schéma est déjà à jour')
          }
          return // Sortir sans erreur
        }
        
        // Fallback: Essayer directement avec /schema/apply (ne devrait pas fonctionner sans hash)
        if (applyError.response?.status === 400 && applyError.response?.data?.errors?.[0]?.message?.includes('hash')) {
          console.log('   ⚠️  L\'API nécessite un hash, mais diff n\'a rien trouvé')
          console.log('   💡 Le schéma semble déjà à jour selon Directus')
          console.log('   💡 Si vous voyez des différences dans l\'admin, essayez de redémarrer Directus')
          if (!FORCE) {
            throw applyError
          }
        } else {
          throw applyError
        }
      } catch (applyError: any) {
        // Fallback: Essayer directement avec /schema/apply
        if (applyError.response?.status === 400 && applyError.response?.data?.errors?.[0]?.message?.includes('hash')) {
          console.log('   Tentative alternative: application directe...')
          try {
            const response = await axios.post(`${DIRECTUS_URL}/schema/apply`, snapshot, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            console.log('✅ Schéma appliqué avec succès (méthode alternative)!')
          } catch (fallbackError: any) {
            console.error('\n❌ Erreur lors de l\'application du schéma:')
            console.error(`   Message: ${fallbackError.response?.data?.errors?.[0]?.message || fallbackError.message}`)
            if (fallbackError.response?.data) {
              console.error(`   Détails:`, JSON.stringify(fallbackError.response.data, null, 2))
            }
            throw fallbackError
          }
        } else {
          throw applyError
        }
      }
    }
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    if (error.response) {
      console.error('Réponse:', error.response.data)
    }
    process.exit(1)
  }
}

applySchema()
