'use client'

import { useEffect, useLayoutEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function ScrollToTopInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Utiliser useLayoutEffect pour que ça se fasse AVANT le rendu
  useLayoutEffect(() => {
    // Fonction pour scroller en haut de manière définitive
    const scrollToTop = () => {
      // Accès direct aux propriétés DOM (forcé)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
        document.documentElement.scrollLeft = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
        document.body.scrollLeft = 0
      }
      
      // window.scrollTo (fallback)
      window.scrollTo(0, 0)
      
      // window.scroll (ancienne méthode, pour compatibilité)
      if (typeof window.scroll === 'function') {
        window.scroll(0, 0)
      }
    }

    // Scroller immédiatement
    scrollToTop()
    
    // Double vérification après un court délai pour être sûr
    const timeoutId = setTimeout(() => {
      scrollToTop()
    }, 0)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [pathname, searchParams]) // Déclencher aussi sur les changements de searchParams

  return null
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  )
}

