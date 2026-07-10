import { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'

/** Force une taille/format fiables pour les crawlers sociaux (Facebook/LinkedIn gèrent mal l'AVIF/WebP et les gros fichiers) */
function toSocialImageUrl(url: string): string {
  if (!url.includes('/assets/')) return url
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('width', '1200')
    parsed.searchParams.set('height', '630')
    parsed.searchParams.set('fit', 'cover')
    parsed.searchParams.set('quality', '80')
    parsed.searchParams.set('format', 'jpg')
    return parsed.toString()
  } catch {
    return url
  }
}

type SeoProps = {
  title?: string
  description?: string
  image?: string
  canonical?: string
  noindex?: boolean
  type?: 'website' | 'article' | 'video'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

const siteUrl = process.env.SITE_URL || 'https://florineclap.com'

export function buildMetadata({ 
  title, 
  description, 
  image, 
  canonical, 
  noindex,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags
}: SeoProps): Metadata {
  const rawImage = image || DEFAULT_OG_IMAGE
  const fullImageUrl = toSocialImageUrl(
    rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
  )

  const canonicalUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
    : undefined

  const meta: Metadata = {
    title,
    description,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title ?? 'Florine Clap',
      description: description,
      images: [{
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: title || 'Florine Clap'
      }],
      url: canonicalUrl,
      siteName: 'Florine Clap',
      type: type === 'video' ? 'website' : type,
      locale: 'fr_FR',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? 'Florine Clap',
      description,
      images: [fullImageUrl],
      creator: '@florineclap',
    },
  }
  return meta
}

export function generateJsonLd({
  type,
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  duration,
}: {
  type: 'Article' | 'VideoObject' | 'WebSite' | 'Person'
  title?: string
  description?: string
  image?: string
  url?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  duration?: string
}) {
  const baseUrl = process.env.SITE_URL || 'https://florineclap.com'
  const fullImageUrl = image 
    ? (image.startsWith('http') ? image : `${baseUrl}${image.startsWith('/') ? '' : '/'}${image}`)
    : undefined
  const fullUrl = url 
    ? (url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`)
    : baseUrl

  const baseJsonLd: any = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  if (type === 'Article') {
    return {
      ...baseJsonLd,
      headline: title,
      description,
      image: fullImageUrl,
      url: fullUrl,
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      author: author ? {
        '@type': 'Person',
        name: author
      } : undefined,
      publisher: {
        '@type': 'Person',
        name: 'Florine Clap'
      }
    }
  }

  if (type === 'VideoObject') {
    return {
      ...baseJsonLd,
      name: title,
      description,
      thumbnailUrl: fullImageUrl,
      contentUrl: fullUrl,
      uploadDate: publishedTime,
      duration: duration,
      publisher: {
        '@type': 'Person',
        name: 'Florine Clap'
      }
    }
  }

  if (type === 'WebSite') {
    return {
      ...baseJsonLd,
      name: 'Florine Clap',
      description: description || 'Florine Clap, réalisatrice et artiste à Avignon. Films documentaires et médiations artistiques.',
      url: baseUrl,
      author: {
        '@type': 'Person',
        name: 'Florine Clap',
        jobTitle: 'Réalisatrice et artiste',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Avignon',
          addressRegion: 'Vaucluse',
          addressCountry: 'FR',
        },
      },
    }
  }

  if (type === 'Person') {
    return {
      ...baseJsonLd,
      name: 'Florine Clap',
      jobTitle: 'Réalisatrice et artiste',
      description: description || 'Réalisatrice et artiste à Avignon, spécialisée en films documentaires et médiations artistiques.',
      url: fullUrl,
      image: fullImageUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Avignon',
        addressRegion: 'Vaucluse',
        addressCountry: 'FR',
      },
      homeLocation: {
        '@type': 'Place',
        name: 'Avignon',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Avignon',
          addressRegion: 'Vaucluse',
          addressCountry: 'FR',
        },
      },
    }
  }

  return baseJsonLd
}


