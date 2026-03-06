import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/** Paths revalidés → tags à invalider (cache des fetches Directus) pour que le nouveau contenu s'affiche */
const PATH_TO_TAGS: Record<string, string[]> = {
  '/': ['home'],
  '/films': ['films'],
  '/mediations': ['mediations'],
  '/videos-art': ['videos_art'],
  '/actus': ['actus'],
  '/bio': ['pages'],
  '/mentions-legales': ['pages'],
  '/politique-confidentialite': ['pages'],
}

function getTagsForPath(path: string): string[] {
  if (PATH_TO_TAGS[path]) return PATH_TO_TAGS[path]
  if (path.startsWith('/films/')) return ['films']
  if (path.startsWith('/mediations/')) return ['mediations']
  if (path.startsWith('/videos-art/')) return ['videos_art']
  if (path.startsWith('/actus/')) return ['actus']
  return []
}

/**
 * Revalidation à la demande : à appeler depuis un webhook Directus
 * quand le contenu (films, médiations, vidéos art, actualités, etc.) change.
 *
 * Configurer dans Directus : Flow ou Webhook qui envoie une requête POST vers
 *   https://votre-domaine.com/api/revalidate
 * avec :
 *   - Header: Authorization: Bearer <REVALIDATE_SECRET>
 *   - Body JSON (optionnel): { "path": "/films" } ou { "paths": ["/films", "/mediations"] }
 *
 * Si aucun path n'est fourni, revalide les routes principales (home, listes).
 *
 * Variable d'environnement requise : REVALIDATE_SECRET (secret partagé avec le webhook).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    console.warn('REVALIDATE_SECRET non configuré, revalidation désactivée')
    return NextResponse.json({ error: 'Revalidation non configurée' }, { status: 501 })
  }

  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (token !== secret) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    let paths: string[] = []
    const body = await request.json().catch(() => ({}))
    if (body.path && typeof body.path === 'string') {
      paths = [body.path]
    } else if (Array.isArray(body.paths)) {
      paths = body.paths.filter((p: unknown) => typeof p === 'string')
    }

    if (paths.length === 0) {
      paths = ['/', '/films', '/mediations', '/videos-art', '/actus', '/bio', '/mentions-legales', '/politique-confidentialite']
    }

    const allTags = new Set<string>()
    for (const path of paths) {
      const tags = getTagsForPath(path)
      for (const tag of tags) allTags.add(tag)
    }
    for (const tag of allTags) {
      revalidateTag(tag)
    }

    return NextResponse.json({ revalidated: true, paths })
  } catch (err) {
    console.error('Erreur revalidation:', err)
    return NextResponse.json({ error: 'Erreur lors de la revalidation' }, { status: 500 })
  }
}
