import { MetadataRoute } from 'next'
import { getAllMediations, getAllActus, getAllFilms } from '@/lib/directus'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || 'https://example.com'
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/mediations',
    '/films',
    '/videos-art',
    '/actus',
    '/bio',
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: 0.7 }))

  // Si Directus n'est pas disponible pendant le build, retourner seulement les routes statiques
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    return staticRoutes
  }

  try {
    const [mediations, films, actus] = await Promise.all([
      getAllMediations().catch(() => []),
      getAllFilms().catch(() => []),
      getAllActus().catch(() => []),
    ])

    const docs = [
      ...mediations.map((d) => ({ url: `${base}/mediations/${d.slug}` })),
      ...films.map((d) => ({ url: `${base}/films/${d.slug}` })),
      ...actus.map((d) => ({ url: `${base}/actus/${d.slug}` })),
    ]

    return [
      ...staticRoutes,
      ...docs.map((d) => ({ ...d, changeFrequency: 'weekly' as const, priority: 0.6 })),
    ]
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error)
    return staticRoutes
  }
}