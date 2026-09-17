import { timingSafeEqual } from 'crypto'

/** Compare deux secrets sans fuite de timing (protège contre le brute-force par mesure de latence) */
export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    // Comparaison factice pour garder un temps d'exécution constant même si les longueurs diffèrent
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}
