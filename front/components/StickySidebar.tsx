'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface StickySidebarProps {
  children: ReactNode
  top?: number // Distance from top in pixels
  className?: string
}

export default function StickySidebar({ 
  children, 
  top = 32, // Default 2rem (32px)
  className = '' 
}: StickySidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [offset, setOffset] = useState(0)
  const initialTopRef = useRef<number>(0)
  const initialWidthRef = useRef<number>(0)
  const parentRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const wrapper = wrapperRef.current
    if (!container || !wrapper) return

    // Trouver le conteneur parent (grid)
    let parent = wrapper.parentElement
    while (parent && !parent.classList.contains('grid')) {
      parent = parent.parentElement
    }
    if (!parent) return
    parentRef.current = parent

    // Calculer la position initiale
    const updateInitialPosition = () => {
      if (container && parent) {
        const rect = container.getBoundingClientRect()
        initialTopRef.current = rect.top + window.scrollY
        initialWidthRef.current = container.offsetWidth
      }
    }

    updateInitialPosition()

    const handleScroll = () => {
      if (!container || !parent || !wrapper) return

      const scrollY = window.scrollY || window.pageYOffset
      const parentRect = parent.getBoundingClientRect()
      
      // Position initiale de l'élément
      const initialTop = initialTopRef.current
      
      // Hauteur du conteneur sticky
      const containerHeight = container.offsetHeight
      
      // Hauteur du parent
      const parentHeight = parent.offsetHeight
      
      // Position du haut du parent par rapport au document
      const parentTop = parentRect.top + scrollY
      
      // Position du bas du parent par rapport au document
      const parentBottom = parentTop + parentHeight
      
      // Calculer si on doit être sticky
      const shouldBeSticky = scrollY + top >= initialTop
      
      if (shouldBeSticky) {
        setIsSticky(true)
        
        // Calculer la position maximale (quand le bas du sticky atteint le bas du parent)
        // Le sticky doit s'arrêter quand: scrollY + top + containerHeight = parentBottom
        const maxScroll = parentBottom - containerHeight - top
        
        if (scrollY >= maxScroll) {
          // Le sticky a atteint le bas du parent, le positionner en bas
          // Calculer l'offset pour que le bas du sticky soit au bas du parent
          const bottomOffset = parentBottom - scrollY - containerHeight - top
          setOffset(Math.max(0, bottomOffset))
        } else {
          // Position sticky normale
          setOffset(0)
        }
      } else {
        setIsSticky(false)
        setOffset(0)
      }
    }

    // Écouter le scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    const handleResize = () => {
      updateInitialPosition()
      handleScroll()
    }
    window.addEventListener('resize', handleResize, { passive: true })

    // Initialiser
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [top])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        className={className}
        style={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? `${top + offset}px` : 'auto',
          width: isSticky ? `${initialWidthRef.current}px` : 'auto',
          zIndex: isSticky ? 10 : 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}

