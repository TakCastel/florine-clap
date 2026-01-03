'use client'

import { useState, useEffect } from 'react'
import { useAnimation } from '@/contexts/AnimationContext'
import { UnderlineLink } from '@/components/ui/UnderlineLink'

interface NavigationProps {
  isHomePage?: boolean
  isLightText?: boolean
}

export default function Navigation({ isHomePage = false, isLightText = false }: NavigationProps) {
  const { showAnimations } = useAnimation()
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  
  const navItems = [
    { href: '/films', label: 'FILMS' },
    { href: '/mediations', label: 'MÉDIATIONS' },
    { href: '/videos-art', label: 'VIDÉOS/ART' },
    { href: '/actus', label: 'ACTUALITÉS' },
    { href: '/bio', label: 'BIO' }
  ]

  // Animation séquentielle des éléments de navigation
  useEffect(() => {
    if (!showAnimations) {
      // Si pas d'animation, afficher tous les éléments immédiatement
      setVisibleItems([0, 1, 2, 3, 4])
      return
    }

    // Animation séquentielle avec délais - commence immédiatement
    const delays = [0, 100, 200, 300, 400]
    
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index])
      }, delay)
    })
  }, [showAnimations])

  return (
    <nav className="hidden md:flex items-center">
      {navItems.map((item, index) => {
        const isVisible = visibleItems.includes(index)
        
        return (
          <div 
            key={item.href} 
            className={`flex items-center transition-all duration-300 ${
              index < navItems.length - 1 ? 'mr-8' : ''
            }`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            <UnderlineLink href={item.href} variant={isLightText ? 'light' : 'dark'}>
              {item.label}
            </UnderlineLink>
          </div>
        )
      })}
    </nav>
  )
}