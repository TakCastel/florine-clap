import { Metadata } from 'next'

type SeoProps = {
  title?: string
  description?: string
  image?: string
  canonical?: string
  noindex?: boolean
}

export function buildMetadata({ title, description, image, canonical, noindex }: SeoProps): Metadata {
  const meta: Metadata = {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title ?? 'Florine Clap',
      description: description,
      images: image ? [{ url: image }] : undefined,
      url: canonical,
      siteName: 'Florine Clap',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? 'Florine Clap',
      description,
      images: image ? [image] : undefined,
    },
  }
  return meta
}


