import { NextRequest, NextResponse } from 'next/server'

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
 * Revalidation à la demande : à appeler depuis un webhook Directus.
 * Délègue à /api/revalidate-internal via fetch local pour contourner le bug Next.js
 * (revalidateTag échoue quand la requête vient d'un webhook externe).
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

    // Appel interne : le contexte local évite le bug revalidateTag avec les webhooks externes.
    // En Docker : REVALIDATE_INTERNAL_URL=http://frontend:3000 (le service se contacte lui-même)
    const baseUrl = process.env.REVALIDATE_INTERNAL_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000')
    const internalUrl = `${baseUrl}/api/revalidate-internal`

    let res: Response | null = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        res = await fetch(internalUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-Secret': secret,
          },
          body: JSON.stringify({ paths }),
        })
        break
      } catch (fetchErr) {
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 300 * attempt))
        } else {
          throw fetchErr
        }
      }
    }

    if (!res) throw new Error('Fetch failed')
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.warn('revalidate-internal a échoué:', res.status, data)
      return NextResponse.json({
        revalidated: false,
        error: data.error || `Erreur interne (${res.status})`,
        warning: 'Le Flow ne bloque pas la publication. Contenu visible sous 24h ou après curl manuel.',
      }, { status: 200 })
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags: data.tags,
    })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('Erreur revalidation:', err)
    return NextResponse.json({
      revalidated: false,
      error: `Erreur lors de la revalidation: ${errMsg}`,
      warning: 'Le Flow ne bloque pas la publication. Contenu visible sous 24h ou après curl manuel.',
    }, { status: 200 })
  }
}
