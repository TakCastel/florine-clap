import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allActus } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'
import Image from 'next/image'

export const dynamic = 'error'

type ActuPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ActuPageProps): Promise<Metadata> {
  const actu = allActus.find(a => a.slug === params.slug)
  
  if (!actu) {
    return {}
  }

  return buildMetadata({
    title: actu.title,
    description: actu.excerpt
  })
}

export default function ActuPage({ params }: ActuPageProps) {
  const actu = allActus.find(a => a.slug === params.slug)
  
  if (!actu) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-theme-cream">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualités', href: '/actus' },
          { label: actu.title }
        ]}
        variant="default"
      />

      {/* Hero section avec image */}
      <div className="relative h-[45vh] min-h-[300px]">
        {actu.cover && (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm" style={{ backgroundImage: `url(${actu.cover})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-theme-cream via-theme-cream/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-theme-cream/80 via-theme-cream/40 to-transparent"></div>
          </div>
        )}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <div className="text-theme-dark/60 text-sm uppercase tracking-[0.2em] mb-4 font-light">
                {new Date(actu.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h1 
                className="heading-page text-theme-dark"
              >
                {actu.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-theme-dark">
              <MdxRenderer code={actu.body.code} />
            </div>
          </div>

          {/* Sidebar avec informations */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border-t border-theme-dark/10 pt-8">
                <h3 className="heading-subtitle text-theme-dark mb-6">
                  Informations
                </h3>
                
                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Date</p>
                    <p className="text-theme-dark font-display font-medium">
                      {new Date(actu.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Tags */}
                  {actu.tags && actu.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-3 font-light">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {actu.tags.map((tag, index) => (
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

                  {/* Retour aux actualités */}
                  <div className="pt-6 border-t border-theme-dark/10">
                    <a 
                      href="/actus"
                      className="inline-flex items-center gap-2 text-theme-dark/70 hover:text-theme-dark transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
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