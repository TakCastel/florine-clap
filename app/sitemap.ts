import { MetadataRoute } from 'next'
import { allAteliers, allActus, allFilms, allPages } from '.contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || 'https://example.com'
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/ateliers',
    '/films',
    '/actus',
    '/bio',
  ].map((p) => ({ url: `${base}${p}`, changeFrequency: 'weekly', priority: 0.7 }))

  const docs = [
    ...allAteliers.map((d) => ({ url: `${base}/ateliers/${d.slug}` })),
    ...allFilms.map((d) => ({ url: `${base}/films/${d.slug}` })),
    ...allActus.map((d) => ({ url: `${base}/actus/${d.slug}` })),
  ]

  return [
    ...staticRoutes,
    ...docs.map((d) => ({ ...d, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ]
}


