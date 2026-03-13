import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * Endpoint interne pour la revalidation.
 * Appelé par /api/revalidate via fetch local pour contourner le bug Next.js
 * (revalidateTag échoue quand la requête vient d'un webhook externe).
 *
 * Doit être appelé uniquement en local (localhost) avec le header X-Internal-Secret.
 */
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

export async function POST(request: NextRequest) {
  const internalSecret = process.env.REVALIDATE_SECRET
  if (!internalSecret) {
    return NextResponse.json({ error: 'Non configuré' }, { status: 501 })
  }

  const headerSecret = request.headers.get('x-internal-secret')
  if (headerSecret !== internalSecret) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const raw = await request.json().catch(() => ({}))
    const body = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
    let paths: string[] = []
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
      for (const tag of getTagsForPath(path)) allTags.add(tag)
    }

    for (const tag of allTags) {
      revalidateTag(tag)
    }

    return NextResponse.json({ revalidated: true, tags: [...allTags] })
  } catch (err) {
    console.error('Erreur revalidate-internal:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
