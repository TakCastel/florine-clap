'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState, useRef } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayPath, setDisplayPath] = useState(pathname)
  const [isVisible, setIsVisible] = useState(false)
  const previousPathRef = useRef(pathname)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      // Première page : faire apparaître immédiatement
      isFirstRender.current = false
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
      return
    }

    if (pathname !== previousPathRef.current) {
      // Nouvelle page : cacher immédiatement
      setIsVisible(false)
      setDisplayPath(pathname)
      previousPathRef.current = pathname
      
      // Faire apparaître après un court délai pour que le DOM soit prêt
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    }
  }, [pathname])

  return (
    <div className="page-transition-container">
      <div
        key={displayPath}
        className={`page-transition-content ${isVisible ? 'page-enter' : ''}`}
      >
        {children}
      </div>
    </div>
  )
}
