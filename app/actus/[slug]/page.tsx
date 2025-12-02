'use client'

import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allActus } from '.contentlayer/generated'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type ActuPageProps = {
  params: { slug: string }
}

export default function ActuPage({ params }: ActuPageProps) {
  const actu = allActus.find(a => a.slug === params.slug)
  
  if (!actu) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-theme-white text-black">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualités', href: '/actus' },
          { label: actu.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[30vh] min-h-[200px] overflow-hidden">
        {actu.cover ? (
          <div 
            className="absolute inset-0 bg-cover bg-top bg-no-repeat blur-[2px] grayscale" 
            style={{ backgroundImage: `url(${actu.cover})` }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-black/5"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-theme-white via-theme-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-white/80 via-theme-white/40 to-transparent"></div>
      </section>

      {/* Contenu principal */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 -mt-10 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Contenu MDX - on ignore le premier h1 pour éviter le doublon avec le titre du hero */}
            <div className="prose prose-lg max-w-none text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
              <MdxRenderer code={actu.body.code} skipFirstHeading={true} />
            </div>
          </div>

          {/* Sidebar avec informations */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border-t border-black/10 pt-8">
                <h3 className="heading-subtitle text-black mb-6">
                  Informations
                </h3>
                
                <div className="space-y-6">
                  {/* Tags */}
                  {actu.tags && actu.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-black font-display font-medium uppercase tracking-[0.05em] mb-3">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {actu.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 bg-black text-white text-sm font-display font-medium uppercase tracking-[0.05em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Retour aux actualités */}
                  <div className="pt-6 border-t border-black/10">
                    <a 
                      href="/actus"
                      className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                    >
                      ← Retour aux actualités
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
