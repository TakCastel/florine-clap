export const DEFAULT_OG_IMAGE = '/images/og-default.jpg'

export const SITE_TITLE = 'Florine Clap - Réalisatrice à Avignon'
export const SITE_DESCRIPTION =
  "Florine Clap, réalisatrice et artiste à Avignon. Films documentaires, vidéos d'art et médiations artistiques au croisement du cinéma et des arts de la scène."
export const SITE_KEYWORDS = [
  'Florine Clap',
  'réalisatrice',
  'réalisatrice Avignon',
  'Avignon',
  'documentaire',
  'cinéma',
  'art',
  'médiation artistique',
  'films',
  'vidéos art',
  'Vaucluse',
]
export const BIO_DESCRIPTION =
  "Parcours de Florine Clap, réalisatrice et artiste à Avignon. Films documentaires, portraits d'artistes et médiations vidéo."

export function canonical(pathname: string): string {
  const base = process.env.SITE_URL || 'https://florineclap.com'
  if (pathname.startsWith('http')) return pathname
  return `${base}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}


