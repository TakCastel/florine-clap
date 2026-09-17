import { NextRequest, NextResponse } from 'next/server'
import { safeCompare } from '@/lib/security'
import {
  getHomeSettings,
  getAllFilms,
  getFilmBySlug,
  getAllMediations,
  getMediationBySlug,
  getAllVideoArts,
  getVideoArtBySlug,
  getAllActus,
  getActuBySlug,
  getPageBySlug,
} from '@/lib/directus'

/**
 * Pré-remplit le cache Directus (optionnel). Protégé par le même secret que /api/revalidate
 * pour éviter qu'un tiers déclenche des requêtes Directus en boucle (coût/DoS).
 * Après déploiement : curl -H "Authorization: Bearer $REVALIDATE_SECRET" https://votre-domaine.com/api/warmup
 */
export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Non configuré' }, { status: 501 })
  }
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (!token || !safeCompare(token, secret)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const start = Date.now()
  const errors: string[] = []
  let counts = { films: 0, mediations: 0, videoArts: 0, actus: 0 }

  try {
    await getHomeSettings()
    const [films, mediations, videoArts, actus] = await Promise.all([
      getAllFilms(),
      getAllMediations(),
      getAllVideoArts(),
      getAllActus(),
    ])
    counts = { films: films.length, mediations: mediations.length, videoArts: videoArts.length, actus: actus.length }

    await Promise.all([
      ...films.map((f) => getFilmBySlug(f.slug)),
      ...mediations.map((m) => getMediationBySlug(m.slug)),
      ...videoArts.map((v) => getVideoArtBySlug(v.slug)),
      ...actus.map((a) => getActuBySlug(a.slug)),
      getPageBySlug('bio').catch(() => null),
      getPageBySlug('mentions-legales').catch(() => null),
      getPageBySlug('politique-confidentialite').catch(() => null),
    ])
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    errors.push(msg)
  }

  const elapsed = Date.now() - start
  return NextResponse.json({
    ok: errors.length === 0,
    warmed: counts,
    elapsedMs: elapsed,
    ...(errors.length ? { errors } : {}),
  })
}
