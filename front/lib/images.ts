/**
 * Fonctions de fallback pour les images (maintenant gérées par Directus)
 * Ces fonctions retournent des valeurs vides car les images sont maintenant dans Directus
 */

/**
 * Sélectionne une image aléatoire pour une catégorie donnée
 * @deprecated Les images sont maintenant gérées par Directus via home_settings
 */
export function getRandomCardImage(category: 'films' | 'mediations' | 'video-art' | 'actus'): string {
  // Retourne une chaîne vide car les images sont maintenant dans Directus
  return ''
}

/**
 * Photo bio par défaut
 * @deprecated L'image bio est maintenant gérée par Directus via home_settings
 */
export const bioPhoto = ''

