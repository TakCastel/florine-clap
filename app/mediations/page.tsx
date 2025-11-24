'use client'

import { useState, useEffect } from 'react'
import MediationCard from '@/components/MediationCard'
import Breadcrumb from '@/components/Breadcrumb'
import ScrollRevealCard from '@/components/ScrollRevealCard'
import { allMediations } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

export default function MediationsPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Déclencher l'animation immédiatement sans délai
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])
  
  // Trier toutes les médiations par date (plus récent en premier)
  const sortedMediations = [...allMediations].sort((a, b) => new Date(b.date || '2020').getTime() - new Date(a.date || '2020').getTime())

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark relative overflow-hidden">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Médiations' }
        ]}
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        {/* Titre de la page avec animation */}
        <div className="mb-16 md:mb-24">
          <div 
            className="overflow-hidden mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <h1 
              className="heading-display text-theme-blue"
            >
              Médiations
            </h1>
          </div>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-theme-dark/10 w-full max-w-md overflow-hidden">
            <div 
              className="h-full bg-theme-blue transition-all duration-500 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.1s',
              }}
            ></div>
          </div>

          <p 
            className="body-text text-theme-mediations/80 mt-6 max-w-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s',
            }}
          >
            Découvrez mes ateliers de formation et de médiation autour du cinéma documentaire
          </p>
        </div>
        
        {/* Liste de toutes les médiations en grandes cards */}
        <div className="space-y-12 md:space-y-16">
          {sortedMediations.map((mediation, index) => (
            <ScrollRevealCard key={mediation._id} delay={index * 0.05}>
              <MediationCard
                href={`/mediations/${mediation.slug}`}
                title={mediation.title}
                excerpt={mediation.excerpt}
                date={mediation.date}
                lieu={mediation.lieu}
              />
            </ScrollRevealCard>
          ))}
        </div>

        {/* Contenu SEO */}
        <div className="mt-24 pt-12 border-t border-theme-dark/10">
          <div className="max-w-4xl">
            <h2 className="heading-section text-theme-mediations mb-6">
              Formation et médiation
            </h2>
            <p className="body-text text-theme-mediations/80">
              Découvrez mes médiations de formation et de médiation autour du cinéma documentaire. 
              Des sessions adaptées à tous les niveaux pour apprendre les techniques de réalisation et développer votre regard critique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
