import { useTransform, MotionValue } from 'framer-motion'

/**
 * Hook pour calculer la progression d'une card dans une pile basée sur le scroll
 * 
 * @param scrollProgress - Progression du scroll (0 à 1)
 * @param cardIndex - Index de la card (0-based)
 * @param totalCards - Nombre total de cards
 * @returns Objet contenant les valeurs transformées (opacity, scale, y, zIndex)
 */
export function useStackProgress(
  scrollProgress: MotionValue<number>,
  cardIndex: number,
  totalCards: number
) {
  // On divise le scroll total en segments
  const step = 1 / totalCards
  
  // Si c'est la première carte, elle est déjà là
  if (cardIndex === 0) {
    const scale = useTransform(
      scrollProgress,
      [0, 1],
      [1, 1 - (totalCards * 0.05)] // Réduction un peu plus marquée
    )
    
    return {
      opacity: 1,
      scale,
      y: useTransform(scrollProgress, [0, 1], ['0%', '0%']),
      rotate: useTransform(scrollProgress, [0, 1], [0, 0]),
      zIndex: 1
    }
  }
  
  // Pour les autres cartes
  // Start : moment où la carte commence à monter depuis sa position d'attente vers le haut
  const start = (cardIndex - 0.8) * step 
  // End : moment où elle est en place en haut (couvrant la précédente)
  const end = cardIndex * step
  
  const opacity = 1
  
  const scale = useTransform(
    scrollProgress,
    [end, 1],
    [1, 1 - (totalCards - cardIndex) * 0.05]
  )
  
  // Position Y
  // Avant 'start', la carte est en position "Teaser" en bas de l'écran
  // On veut qu'elle soit visible (genre à 85-90% de la hauteur)
  // Puis de 'start' à 'end', elle monte à 0%
  const y = useTransform(
    scrollProgress,
    [0, start, end],
    ['92%', '92%', '0%'] // 92% laisse voir le haut de la carte (teaser)
  )
  
  // Rotation légère
  const randomAngle = (cardIndex % 2 === 0 ? 1 : -1) * 1
  const rotate = useTransform(
    scrollProgress,
    [start, end, end + 0.1],
    [randomAngle, 0, 0]
  )
  
  const zIndex = cardIndex + 1
  
  return {
    opacity,
    scale,
    y,
    rotate,
    zIndex
  }
}
