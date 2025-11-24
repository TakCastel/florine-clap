'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import CategoryCard from '@/components/CategoryCard'
import { getRandomCardImage } from '@/lib/images'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer'

export default function CategoriesSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [randomImages, setRandomImages] = useState({
    films: '',
    mediations: '',
    'video-art': '',
    actus: ''
  })

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
    <section id="categories-section" className="w-full min-h-screen bg-theme-cream flex items-center justify-center py-12 md:py-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1800px] mx-auto">
        <StaggerContainer 
          className="w-full flex flex-col md:grid md:grid-cols-2 2xl:flex 2xl:flex-row gap-3 md:gap-4 2xl:gap-6"
          staggerChildren={0.1}
        >
          <LayoutGroup>
            {cards.map((card, index) => (
              <StaggerItem 
                key={index} 
                className={`flex-1 group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  hoveredIndex === index 
                    ? '2xl:flex-[1.6]' 
                    : '2xl:flex-[1]'
                } ${
                  isMobile 
                    ? 'h-[240px]'
                    : 'md:h-[320px] lg:h-[360px] 2xl:h-[480px]'
                }`}
              >
                <div
                  className="w-full h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => {
                    if (window.innerWidth >= 768) {
                      setHoveredIndex(index)
                    }
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
                </div>
              </StaggerItem>
            ))}
          </LayoutGroup>
        </StaggerContainer>
      </div>
    </section>
  )
}
