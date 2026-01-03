'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import CategoryCard from '@/components/CategoryCard'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { HomeSettings, getImageUrl } from '@/lib/directus'

interface CategoriesSectionProps {
  homeSettings?: HomeSettings | null
}

export default function CategoriesSection({ homeSettings }: CategoriesSectionProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [randomImages, setRandomImages] = useState({
    films: '',
    mediations: '',
    'video-art': '',
    actus: ''
  })
  const [isReady, setIsReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  
  // Variantes d'animation pour l'effet de fade in séquentiel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Délai plus court entre chaque card
        delayChildren: 0.05,
      },
    },
  }

  const getCardVariants = (index: number) => {
    const skewAngle = -3 // Toutes les cards ont la même skew
    const zIndexValue = 4 - index // z-index décroissant : 4, 3, 2, 1
    return {
      hidden: {
        opacity: 0,
        y: 20,
        skewX: `${skewAngle}deg`,
        zIndex: zIndexValue,
      },
      visible: {
        opacity: 1,
        y: 0,
        skewX: `${skewAngle}deg`,
        zIndex: zIndexValue,
        transition: {
          duration: 0.8,
          ease: [0.215, 0.61, 0.355, 1] as any, // easeOutCubic
        },
      },
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Utiliser les images depuis Directus si disponibles
    setRandomImages({
      films: homeSettings?.category_films_image 
        ? (getImageUrl(homeSettings.category_films_image) || '')
        : '',
      mediations: homeSettings?.category_mediations_image 
        ? (getImageUrl(homeSettings.category_mediations_image) || '')
        : '',
      'video-art': homeSettings?.category_video_art_image 
        ? (getImageUrl(homeSettings.category_video_art_image) || '')
        : '',
      actus: homeSettings?.category_actus_image 
        ? (getImageUrl(homeSettings.category_actus_image) || '')
        : ''
    })
    
    // Petit délai pour s'assurer que les images commencent à charger avant l'animation
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [homeSettings])

  const cards = useMemo(() => [
    {
      href: '/films',
      title: 'Films',
      description: 'Mes créations cinématographiques, mes courts-métrages et mes projets artistiques',
      linkText: 'Découvrir',
      imageSrc: randomImages.films,
      imageAlt: 'Découvrir mes films',
      theme: 'films' as const,
      bgColor: 'bg-theme-films/85',
      hoverBgColor: 'group-hover:bg-theme-films/90',
      textColor: 'text-theme-films-text',
      linkColor: 'text-theme-films-text/80',
      hoverLinkColor: 'hover:text-theme-films-text',
      underlineClass: 'after:bg-theme-films-text'
    },
    {
      href: '/mediations',
      title: 'Médiations',
      description: 'Explorez mes médiations de médiation culturelle et mes formations pour tous publics',
      linkText: 'Découvrir',
      imageSrc: randomImages.mediations,
      imageAlt: 'Découvrir mes médiations',
      theme: 'mediations' as const,
      bgColor: 'bg-theme-mediations/85',
      hoverBgColor: 'group-hover:bg-theme-mediations/90',
      textColor: 'text-theme-mediations-text',
      linkColor: 'text-theme-mediations-text/80',
      hoverLinkColor: 'hover:text-theme-mediations-text',
      underlineClass: 'after:bg-theme-mediations-text'
    },
    {
      href: '/videos-art',
      title: 'Vidéos/art',
      description: 'Mes créations vidéo artistiques et mes projets expérimentaux',
      linkText: 'Découvrir',
      imageSrc: randomImages['video-art'],
      imageAlt: 'Découvrir mes vidéos artistiques',
      theme: 'videos-art' as const,
      bgColor: 'bg-theme-videos-art/85',
      hoverBgColor: 'group-hover:bg-theme-videos-art/90',
      textColor: 'text-theme-videos-art-text',
      linkColor: 'text-theme-videos-art-text/80',
      hoverLinkColor: 'hover:text-theme-videos-art-text',
      underlineClass: 'after:bg-theme-videos-art-text'
    },
    {
      href: '/actus',
      title: 'Actualités',
      description: 'Suivez mes dernières actualités, événements et projets en cours',
      linkText: 'Lire',
      imageSrc: randomImages.actus,
      imageAlt: 'Découvrir mes actualités',
      theme: 'actus' as const,
      bgColor: 'bg-theme-actus/85',
      hoverBgColor: 'group-hover:bg-theme-actus/90',
      textColor: 'text-theme-actus-text',
      linkColor: 'text-theme-actus-text/80',
      hoverLinkColor: 'hover:text-theme-actus-text',
      underlineClass: 'after:bg-theme-actus-text'
    }
  ], [randomImages])

  return (
    <section 
      ref={sectionRef}
      id="categories-section" 
      className="w-full min-h-screen flex items-center justify-center py-12 md:py-16 overflow-hidden relative border-b border-black/5 section-gradient"
    >
      <div className="w-full max-w-[1600px] px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div 
          ref={containerRef}
          className="w-full h-[400px] md:h-[450px] lg:h-[500px] flex flex-col md:flex-row gap-3 md:gap-4 items-stretch"
          variants={containerVariants}
          initial="hidden"
          animate={isInView && isReady ? "visible" : "hidden"}
        >
          {cards.map((card, index) => {
            const skewAngle = -3 // Toutes les cards ont la même skew
            return (
            <motion.div 
              key={index} 
              className="relative flex-1 md:hover:flex-[1.5] transition-all duration-500 ease-out h-full group/card"
              variants={getCardVariants(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                zIndex: 50,
                transition: { 
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
                },
              }}
              style={{
                transform: `skewX(${skewAngle}deg)`,
              }}
            >
              <CategoryCard
                href={card.href}
                title={card.title}
                description={card.description}
                linkText={card.linkText}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                theme={card.theme}
                bgColor={card.bgColor}
                hoverBgColor={card.hoverBgColor}
                textColor={card.textColor}
                linkColor={card.linkColor}
                hoverLinkColor={card.hoverLinkColor}
                underlineClass={card.underlineClass}
              />
            </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}