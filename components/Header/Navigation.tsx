'use client'

import { useState, useEffect } from 'react'
import { useAnimation } from '@/contexts/AnimationContext'

interface NavigationProps {
  isHomePage?: boolean
}

export default function Navigation({ isHomePage = false }: NavigationProps) {
  const { showAnimations } = useAnimation()
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  
  const navItems = [
    { href: '/films', label: 'FILMS' },
    { href: '/mediations', label: 'MÉDIATIONS' },
    { href: '/actus', label: 'ACTUALITÉS' },
    { href: '/bio', label: 'BIO' }
  ]

  // Animation séquentielle des éléments de navigation
  useEffect(() => {
    if (!showAnimations) {
      // Si pas d'animation, afficher tous les éléments immédiatement
      setVisibleItems([0, 1, 2, 3])
      return
    }

    // Animation séquentielle avec délais - commence immédiatement
    const delays = [0, 100, 200, 300]
    
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
            className="flex items-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            <a 
              href={item.href} 
              className={`text-xl font-andale-mono font-bold transition-colors duration-300 uppercase cursor-pointer relative after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-0.75 after:transition-all after:duration-300 hover:after:w-full ${
                isHomePage 
                  ? 'text-white/70 hover:text-white after:bg-white' 
                  : 'text-theme-dark hover:text-black after:bg-theme-dark'
              }`}
            >
              {item.label}
            </a>
            {index < navItems.length - 1 && (
              <span className={`mx-8 font-andale-mono transition-opacity duration-300 ${
                isHomePage ? 'text-white/50' : 'text-gray-400'
              }`}>
                /
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}