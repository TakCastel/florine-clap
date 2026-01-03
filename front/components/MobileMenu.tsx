'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isHomePage?: boolean
}

const MENU_ITEMS = [
  { href: '/films', label: 'FILMS' },
  { href: '/mediations', label: 'MÉDIATIONS' },
  { href: '/videos-art', label: 'VIDÉOS/ART' },
  { href: '/actus', label: 'ACTUALITÉS' },
  { href: '/bio', label: 'BIO' }
]

// Icône burger simple
const BurgerIcon = ({ isOpen, color = 'black' }: { isOpen: boolean; color?: 'black' | 'white' }) => {
  const barColor = color === 'white' ? 'bg-white' : 'bg-black'
  
  return (
    <div className="relative w-6 h-6 flex flex-col justify-center items-center">
      <span 
        className={`absolute w-full h-[2px] ${barColor} transition-all duration-300 ease-in-out origin-center ${
          isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
        }`} 
      />
      <span 
        className={`absolute w-full h-[2px] ${barColor} transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`} 
      />
      <span 
        className={`absolute w-full h-[2px] ${barColor} transition-all duration-300 ease-in-out origin-center ${
          isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
        }`} 
      />
    </div>
  )
}

// Bouton burger
const BurgerButton = ({ 
  isOpen, 
  onClick, 
  isHomePage = false,
  isMobile = false,
  iconColor = 'black'
}: { 
  isOpen: boolean
  onClick: () => void
  isHomePage?: boolean
  isMobile?: boolean
  iconColor?: 'black' | 'white'
}) => {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity duration-200 z-[110] relative"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <BurgerIcon isOpen={isOpen} color={iconColor} />
    </button>
  )
}

// Variants d'animation pour le fond
const backdropVariants = {
  closed: {
    opacity: 0,
    y: '-100%',
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
}

// Variants pour les items du menu
const menuItemVariants = {
  closed: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
    scale: 0.95,
  },
  open: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      delay: 0.2 + index * 0.08,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Courbe élégante
    },
  }),
}

// Variants pour la ligne de séparation
const lineVariants = {
  closed: {
    opacity: 0,
    scaleX: 0,
  },
  open: {
    opacity: 1,
    scaleX: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
}

// Menu mobile overlay - simple et épuré avec animation
const MobileMenuOverlay = ({ isOpen, onClose, isHomePage = false }: MobileMenuProps) => {
  // Gérer le scroll
  useEffect(() => {
    if (isOpen) {
      // Bloquer le scroll de la page
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Restaurer le scroll de la page
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    
    return () => {
      // Cleanup en cas de démontage du composant
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Fermer le menu avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 z-[100]"
          initial="closed"
          animate="open"
          exit="closed"
          variants={backdropVariants}
          onClick={(e) => {
            // Fermer si on clique en dehors de la navigation
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
        >
            {/* Espace pour le header fixe - pointer-events none pour permettre les clics sur le header */}
            <div className="h-16 relative pointer-events-none">
              {/* Ligne de séparation sous le header - alignée avec le bouton burger sur l'accueil */}
              <motion.div 
                variants={lineVariants}
                className={`absolute bottom-0 h-px origin-right pointer-events-auto ${
                  isHomePage 
                    ? 'bg-white/20 left-[calc(100%-3.5rem)] right-0' 
                    : 'bg-black/10 left-0 right-0'
                }`}
              />
            </div>
            
            {/* Navigation centrée verticalement avec animation et fond */}
            <motion.nav 
              className={`flex items-center justify-center h-[calc(100vh-4rem)] px-6 pointer-events-auto ${
                isHomePage ? 'bg-black' : 'bg-white'
              }`}
              style={{ 
                backgroundColor: isHomePage ? '#000000' : '#FFFFFF',
              }}
            >
            <div className="space-y-8 w-full">
              {MENU_ITEMS.map((item, index) => (
                <motion.div
                  key={item.href}
                  custom={index}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block text-3xl font-display font-normal uppercase tracking-wide text-center py-3 transition-colors duration-300 ${
                      isHomePage 
                        ? 'text-white hover:text-white/60' 
                        : 'text-black hover:text-black/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
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

  // Déterminer la couleur de l'icône : blanc si texte clair, noir sinon
  const iconColor = isLightText ? 'white' : 'black'

  return (
    <>
      <BurgerButton 
        isOpen={isOpen} 
        onClick={handleToggle} 
        isHomePage={isHomePage} 
        isMobile={isMobile}
        iconColor={iconColor}
      />
      <MobileMenuOverlay isOpen={isOpen} onClose={handleClose} isHomePage={isHomePage} />
    </>
  )
}
