'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Remettre le scroll en haut instantanément (sans animation)
    // Utiliser requestAnimationFrame pour s'assurer que ça se fait après le rendu
    requestAnimationFrame(() => {
      // Méthode 1: window.scrollTo avec behavior: 'auto' pour un scroll instantané
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      
      // Méthode 2: Accès direct aux propriétés pour forcer le scroll instantané
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
      
      // Méthode 3: Si Lenis est utilisé, on peut aussi essayer d'accéder à l'instance
      // via window si elle y est stockée
      const lenisInstance = (window as any).lenis
      if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
        lenisInstance.scrollTo(0, { immediate: true })
      }
    })
  }, [pathname])

  return null
}

