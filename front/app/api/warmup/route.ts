import { NextRequest, NextResponse } from 'next/server'
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
 * Pré-remplit le cache Directus (optionnel). Aucune clé requise.
 * Après déploiement : GET https://votre-domaine.com/api/warmup
 */
export async function GET(_request: NextRequest) {

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
