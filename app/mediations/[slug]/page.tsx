'use client'

import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allMediations } from '.contentlayer/generated'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type MediationPageProps = {
  params: { slug: string }
}

// Metadata generation removed for client component

export default function MediationPage({ params }: MediationPageProps) {
  const mediation = allMediations.find(m => m.slug === params.slug)
  
  if (!mediation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Médiations', href: '/mediations' },
          { label: mediation.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        {mediation.cover && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm filter-[sepia(20%)_saturate(150%)_hue-rotate(340deg)_brightness(0.9)]" 
            style={{ backgroundImage: `url(${mediation.cover})` }}
          ></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-theme-cream via-theme-cream/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-cream/80 via-theme-cream/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-6 text-theme-dark/60 text-sm uppercase tracking-[0.2em] mb-4 font-light">
                {new Date(mediation.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {mediation.lieu && (
                  <>
                    <span>•</span>
                    <span>{mediation.lieu}</span>
                  </>
                )}
                {mediation.duree && (
                  <>
                    <span>•</span>
                    <span>{mediation.duree}</span>
                  </>
                )}
              </div>
              <h1 
                className="heading-page text-theme-dark"
              >
                {mediation.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-theme-dark">
              <MdxRenderer code={mediation.body.code} />
            </div>
          </div>

          {/* Sidebar avec métadonnées organisées */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Informations */}
              <div className="border-t border-theme-dark/10 pt-8 mb-8">
                <h3 className="heading-subtitle text-theme-dark mb-6">
                  Informations
                </h3>
                
                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Date</p>
                    <p className="text-theme-dark font-display font-medium">
                      {new Date(mediation.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Lieu */}
                  {mediation.lieu && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Lieu</p>
                      <p className="text-theme-dark font-display font-medium">{mediation.lieu}</p>
                    </div>
                  )}

                  {/* Durée */}
                  {mediation.duree && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                      <p className="text-theme-dark font-display font-medium">{mediation.duree}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {mediation.tags && mediation.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-3 font-light">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {mediation.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-theme-dark/5 border border-theme-dark/10 text-theme-dark text-sm rounded-full font-display font-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Retour aux médiations */}
              <div className="border-t border-theme-dark/10 pt-8">
                <a 
                  href="/mediations"
                  className="inline-flex items-center gap-2 text-theme-dark/70 hover:text-theme-dark transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                >
                  ← Retour aux médiations
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}