'use client'

import { ReactNode, useEffect, useState } from 'react'

interface StickyAsideProps {
  children: ReactNode
  className?: string
}

export default function StickyAside({ children, className = '' }: StickyAsideProps) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return (
    <aside 
      className={`${className}`}
      style={{
        position: isDesktop ? 'sticky' : 'relative',
        top: isDesktop ? '2rem' : 'auto',
        alignSelf: 'flex-start',
        zIndex: 10,
        height: 'fit-content',
      }}
    >
      {children}
    </aside>
  )
}

