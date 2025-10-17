'use client'

import { useEffect, useRef, useState } from 'react'
import CategoryCard from '@/components/CategoryCard'

export default function CategoriesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])
  const cards = [
    {
      href: '/films',
      title: 'Films',
      description: 'Découvrez mes créations cinématographiques, mes courts-métrages et mes projets artistiques',
      linkText: 'Découvrir',
      imageSrc: 'https://picsum.photos/800/1200?random=2',
      imageAlt: 'Découvrir mes films',
      bgColor: 'bg-theme-blue/85',
      hoverBgColor: 'group-hover:bg-theme-blue/90',
      textColor: 'text-white',
      linkColor: 'text-white/80',
      hoverLinkColor: 'hover:text-white',
      underlineClass: 'after:bg-white'
    },
    {
      href: '/mediations',
      title: 'Médiations',
      description: 'Explorez mes médiations de médiation culturelle et mes formations pour tous publics',
      linkText: 'Explorer',
      imageSrc: 'https://picsum.photos/800/1200?random=3',
      imageAlt: 'Découvrir mes médiations',
      bgColor: 'bg-black/85',
      hoverBgColor: 'group-hover:bg-black/90',
      textColor: 'text-white',
      linkColor: 'text-white/80',
      hoverLinkColor: 'hover:text-white',
      underlineClass: 'after:bg-white'
    },
    {
      href: '/actus',
      title: 'Actualités',
      description: 'Suivez mes dernières actualités, événements et projets en cours',
      linkText: 'Lire',
      imageSrc: 'https://picsum.photos/800/1200?random=4',
      imageAlt: 'Découvrir mes actualités',
      bgColor: 'bg-theme-yellow/85',
      hoverBgColor: 'group-hover:bg-theme-yellow/90',
      textColor: 'text-theme-dark',
      linkColor: 'text-theme-dark/80',
      hoverLinkColor: 'hover:text-theme-dark',
      underlineClass: 'after:bg-theme-dark'
    }
  ]

  return (
    <section ref={sectionRef} id="categories-section" className="w-full min-h-screen bg-black flex items-center justify-center py-24">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-[1800px] mx-auto">
        <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 md:items-stretch">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`flex-1 h-[65vh] md:h-[70vh] lg:h-[75vh] ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-16'
              }`}
              style={{
                transition: isVisible 
                  ? `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 180}ms, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${index * 180}ms`
                  : 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isVisible ? '' : '0ms'
              }}
            >
              <CategoryCard
                href={card.href}
                title={card.title}
                description={card.description}
                linkText={card.linkText}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                bgColor={card.bgColor}
                hoverBgColor={card.hoverBgColor}
                textColor={card.textColor}
                linkColor={card.linkColor}
                hoverLinkColor={card.hoverLinkColor}
                underlineClass={card.underlineClass}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}