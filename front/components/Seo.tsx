import { Metadata } from 'next'

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
  const fullImageUrl = image 
    ? (image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`)
    : undefined

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
      images: fullImageUrl ? [{ 
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: title || 'Florine Clap'
      }] : undefined,
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
      images: fullImageUrl ? [fullImageUrl] : undefined,
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
      description: description || 'Réalisatrice et artiste, je crée des films documentaires et des médiations artistiques.',
      url: baseUrl,
    }
  }

  if (type === 'Person') {
    return {
      ...baseJsonLd,
      name: 'Florine Clap',
      jobTitle: 'Réalisatrice et Artiste',
      url: baseUrl,
    }
  }

  return baseJsonLd
}


