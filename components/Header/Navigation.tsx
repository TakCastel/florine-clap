'use client'

import { useState, useEffect } from 'react'

interface NavigationProps {
  isHomePage?: boolean
}

export default function Navigation({ isHomePage = false }: NavigationProps) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  
  const navItems = [
    { href: '/films', label: 'Films' },
    { href: '/mediations', label: 'Mediations' },
    { href: '/actus', label: 'Actualites' },
    { href: '/bio', label: 'Bio' }
  ]

  // Animation d'apparition séquentielle au montage du composant
  useEffect(() => {
    // Délais stagger progressifs synchronisés avec le logo (0.8s)
    // Les éléments apparaissent de droite vers la gauche
    const delays = [100, 200, 300, 400] // Délais plus courts pour un effet plus fluide
    
    delays.forEach((delay, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index])
      }, delay)
    })
  }, [])

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
            transition: 'all 0.6s ease-out',
            animation: isVisible ? 'slideInFromRight 0.6s ease-out forwards' : 'none'
          }}
        >
          <a 
            href={item.href} 
            className={`text-xl transition-colors duration-300 ${
              isHomePage 
                ? 'text-white hover:text-theme-yellow' 
                : 'text-theme-dark hover:text-black'
            }`}
          >
            {item.label}
          </a>
          {index < navItems.length - 1 && (
            <span className={`mx-8 transition-opacity duration-300 ${
              isHomePage ? 'text-white/60' : 'text-gray-400'
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