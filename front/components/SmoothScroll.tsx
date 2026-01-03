'use client'

import { ReactNode, useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Lenis from '@studio-freight/lenis'

function SmoothScrollInner({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // smoothTouch: false, // Generally better to leave native touch scroll on mobile
      touchMultiplier: 2,
    })

    // Exposer l'instance Lenis sur window pour pouvoir l'utiliser ailleurs
    ;(window as any).lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  // Forcer le scroll en haut à chaque changement de route (pathname ou searchParams)
  useEffect(() => {
    const lenisInstance = (window as any).lenis
    if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
      // Scroll immédiat en haut lors du changement de route
      lenisInstance.scrollTo(0, { immediate: true, duration: 0 })
    }
    // Fallback sur les méthodes natives
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, searchParams])

  return <>{children}</>
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SmoothScrollInner>{children}</SmoothScrollInner>
    </Suspense>
  )
}

