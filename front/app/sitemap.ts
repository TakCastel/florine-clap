import { MetadataRoute } from 'next'
import { getAllMediations, getAllActus, getAllFilms, getAllVideoArts } from '@/lib/directus'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || 'https://example.com'
  const now = new Date().toISOString()
  
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, changeFrequency: 'weekly', priority: 1.0, lastModified: now },
    { url: `${base}/films`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/mediations`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/videos-art`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${base}/actus`, changeFrequency: 'daily', priority: 0.8, lastModified: now },
    { url: `${base}/bio`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
  ]

  // Si Directus n'est pas disponible pendant le build, retourner seulement les routes statiques
  if (!process.env.NEXT_PUBLIC_DIRECTUS_URL) {
    return staticRoutes
  }

  try {
    const [mediations, films, actus, videoArts] = await Promise.all([
      getAllMediations().catch(() => []),
      getAllFilms().catch(() => []),
      getAllActus().catch(() => []),
      getAllVideoArts().catch(() => []),
    ])

    const docs: MetadataRoute.Sitemap = [
      ...films.map((d) => ({ 
        url: `${base}/films/${d.slug}`, 
        changeFrequency: 'monthly' as const, 
        priority: 0.7,
        lastModified: d.annee ? new Date(`${d.annee}-01-01`).toISOString() : now
      })),
      ...mediations.map((d) => ({ 
        url: `${base}/mediations/${d.slug}`, 
        changeFrequency: 'monthly' as const, 
        priority: 0.7,
        lastModified: d.date ? new Date(d.date).toISOString() : now
      })),
      ...videoArts.map((d) => ({ 
        url: `${base}/videos-art/${d.slug}`, 
        changeFrequency: 'monthly' as const, 
        priority: 0.7,
        lastModified: d.annee ? new Date(`${d.annee}-01-01`).toISOString() : now
      })),
      ...actus.map((d) => ({ 
        url: `${base}/actus/${d.slug}`, 
        changeFrequency: 'weekly' as const, 
        priority: 0.6,
        lastModified: d.date ? new Date(d.date).toISOString() : now
      })),
    ]

    return [
      ...staticRoutes,
      ...docs,
    ]
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error)
    return staticRoutes
  }
}