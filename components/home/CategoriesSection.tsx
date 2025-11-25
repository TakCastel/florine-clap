'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import CategoryCard from '@/components/CategoryCard'
import { getRandomCardImage } from '@/lib/images'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

export default function CategoriesSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [randomImages, setRandomImages] = useState({
    films: '',
    mediations: '',
    'video-art': '',
    actus: ''
  })
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" })
  
  // Animation basée sur le scroll - commence plus tôt et se termine avant la fin
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "center 0.5"]
  })
  
  // Transformations parallaxes différentes pour chaque card (plus subtiles)
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -20])
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -15])
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], [0, -18])
  const parallaxY4 = useTransform(scrollYProgress, [0, 1], [0, -25])
  
  // Opacité - toujours visible
  const card0Opacity = 1
  const card1Opacity = 1
  const card2Opacity = 1
  const card3Opacity = 1
  
  const cardAnimations = [
    { opacity: card0Opacity },
    { opacity: card1Opacity },
    { opacity: card2Opacity },
    { opacity: card3Opacity },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setRandomImages({
      films: getRandomCardImage('films'),
      mediations: getRandomCardImage('mediations'),
      'video-art': getRandomCardImage('video-art'),
      actus: getRandomCardImage('actus')
    })
  }, [])

  const cards = useMemo(() => [
    {
      href: '/films',
      title: 'Films',
      description: 'Découvrez mes créations cinématographiques, mes courts-métrages et mes projets artistiques',
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
      linkText: 'Explorer',
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
      description: 'Découvrez mes créations vidéo artistiques et mes projets expérimentaux',
      linkText: 'Explorer',
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
      className="w-full min-h-screen bg-theme-cream flex items-center justify-center py-12 md:py-16 overflow-hidden relative"
    >
      <div className="w-full max-w-[1600px] px-6 md:px-10 lg:px-16 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="heading-section text-black mb-8 md:mb-12 text-center"
        >
          Découvrez mes créations
        </motion.h2>
        <div 
          ref={containerRef}
          className="w-full h-[400px] md:h-[450px] lg:h-[500px] flex flex-col md:flex-row gap-3 md:gap-4 items-stretch"
        >
          {cards.map((card, index) => {
            const animation = cardAnimations[index]
            return (
            <motion.div 
              key={index} 
              className="relative flex-1 hover:flex-[2] md:hover:flex-[1.5] transition-[flex,width] duration-500 ease-out h-full"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: 1,
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
        </div>
      </div>
    </section>
  )
}