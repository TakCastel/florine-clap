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

/**
 * Convertit une durée saisie en Directus (format libre : "3'20", "12 min", "1h05", "23:45"...)
 * en durée ISO 8601 (ex. "PT3M20S"), seul format accepté par schema.org VideoObject.duration.
 * Retourne undefined si le format n'est pas reconnu, pour éviter d'émettre un JSON-LD invalide.
 */
export function parseDurationToISO8601(input?: string | null): string | undefined {
  if (!input) return undefined
  const trimmed = input.trim()
  if (!trimmed) return undefined

  // "HH:MM:SS" ou "MM:SS"
  const colonMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (colonMatch) {
    const [, a, b, c] = colonMatch
    return c !== undefined
      ? `PT${parseInt(a, 10)}H${parseInt(b, 10)}M${parseInt(c, 10)}S`
      : `PT${parseInt(a, 10)}M${parseInt(b, 10)}S`
  }

  // "1h", "1h05", "1h05min"
  const hourMatch = trimmed.match(/^(\d{1,2})\s*h\s*(\d{1,2})?\s*(?:min)?$/i)
  if (hourMatch) {
    const hours = parseInt(hourMatch[1], 10)
    const minutes = hourMatch[2] ? parseInt(hourMatch[2], 10) : 0
    return `PT${hours}H${minutes > 0 ? `${minutes}M` : ''}`
  }

  // Notation française "3'20"" ou "3'20"
  const apostropheMatch = trimmed.match(/^(\d{1,3})['’]\s*(\d{1,2})?\s*"?$/)
  if (apostropheMatch) {
    const minutes = parseInt(apostropheMatch[1], 10)
    const seconds = apostropheMatch[2] ? parseInt(apostropheMatch[2], 10) : 0
    return `PT${minutes}M${seconds > 0 ? `${seconds}S` : ''}`
  }

  // "12 min", "12min", "12 minutes"
  const minMatch = trimmed.match(/^(\d{1,3})\s*min(?:utes?)?$/i)
  if (minMatch) {
    return `PT${parseInt(minMatch[1], 10)}M`
  }

  // Nombre seul : on suppose des minutes
  const plainMatch = trimmed.match(/^(\d{1,3})$/)
  if (plainMatch) {
    return `PT${parseInt(plainMatch[1], 10)}M`
  }

  return undefined
}


