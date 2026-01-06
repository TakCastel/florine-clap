'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MENU_ITEMS = [
  { href: '/films', label: 'FILMS' },
  { href: '/mediations', label: 'MÉDIATIONS' },
  { href: '/videos-art', label: 'VIDÉOS/ART' },
  { href: '/actus', label: 'ACTUALITÉS' },
  { href: '/bio', label: 'BIO' }
]

// Icône burger qui se transforme en croix avec animation fluide
const BurgerIcon = ({ isOpen, color = 'black' }: { isOpen: boolean; color?: 'black' | 'white' }) => {
  const barColor = color === 'white' ? 'bg-white' : 'bg-black'
  
  return (
    <div className="relative w-6 h-6 flex flex-col justify-center">
      <motion.span 
        className={`absolute left-0 w-full h-[1.5px] ${barColor}`}
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 0 : -6,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span 
        className={`absolute left-0 w-full h-[1.5px] ${barColor}`}
        animate={{
          opacity: isOpen ? 0 : 1,
          x: isOpen ? 10 : 0,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span 
        className={`absolute left-0 w-full h-[1.5px] ${barColor}`}
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? 0 : 6,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  )
}

// Composant principal
export default function MobileMenu({ 
  isHomePage = false, 
  isMobile = false, 
  isLightText = false,
  onMenuStateChange
}: { 
  isHomePage?: boolean
  isMobile?: boolean
  isLightText?: boolean
  onMenuStateChange?: (isOpen: boolean) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onMenuStateChange?.(newState)
  }

  const handleClose = () => {
    setIsOpen(false)
    onMenuStateChange?.(false)
  }

  // Exposer la fonction de fermeture pour utilisation externe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__closeMobileMenu = handleClose
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__closeMobileMenu
      }
    }
  }, [handleClose])

  // Gérer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // CORRECTION : Utiliser isLightText au lieu de isHomePage pour déterminer les couleurs
  const iconColor = isLightText ? 'white' : 'black'
  const bgColor = isLightText ? '#000000' : '#FFFFFF'
  const textColor = isLightText ? 'text-white' : 'text-black'
  const linkHoverColor = isLightText ? 'hover:text-white/80' : 'hover:text-black/60'

  // Variantes d'animation pour l'overlay
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const
      }
    }
  }

  // Variantes d'animation pour les items du menu
  const itemVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const
      }
    },
    open: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        duration: 0.4,
        ease: "easeInOut" as const
      }
    })
  }

  return (
    <>
      {/* Bouton burger */}
      <button
        onClick={handleToggle}
        className="md:hidden flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity duration-300 relative z-[10001]"
        style={{ zIndex: 10001 }}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <BurgerIcon isOpen={isOpen} color={iconColor} />
      </button>

      {/* Menu overlay avec animation fluide */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-[9999]"
            style={{ 
              backgroundColor: bgColor,
              width: '100vw',
              height: '100vh',
              minHeight: '100vh',
              position: 'fixed',
              overflow: 'hidden',
              margin: 0,
              padding: 0
            }}
            onClick={handleClose}
          >
            {/* Navigation */}
            <nav 
              className="flex items-center justify-center h-full w-full px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div 
                className="space-y-6 w-full max-w-sm"
                initial="closed"
                animate="open"
              >
                {MENU_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.href}
                    custom={index}
                    variants={itemVariants}
                  >
                    <Link
                      href={item.href}
                      onClick={handleClose}
                      className={`block text-xl md:text-2xl font-display font-normal uppercase tracking-wide text-center py-3 transition-all duration-300 ${textColor} ${linkHoverColor} relative group`}
                    >
                      <span className="relative inline-block">
                        {item.label}
                        {/* Animation de soulignement au survol, style cohérent avec UnderlineLink */}
                        <span 
                          className={`absolute bottom-0 left-0 h-px ${isLightText ? 'bg-white' : 'bg-black'} transition-all duration-500 ease-out w-0 group-hover:w-full`}
                        />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
