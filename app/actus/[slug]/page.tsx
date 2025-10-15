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
    <div className="min-h-screen bg-theme-yellow">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualités', href: '/actus' },
          { label: actu.title }
        ]}
        variant="default"
      />

      {/* Hero section avec image */}
      <div className="relative h-96">
        {actu.cover && (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${actu.cover})` }}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          </div>
        )}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center max-w-4xl px-8">
            <div className="text-theme-yellow text-sm font-display mb-2">
              {new Date(actu.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
              {actu.title}
            </h1>
            {actu.excerpt && actu.excerpt.trim() !== '.' && actu.excerpt.trim().length > 2 && (
              <p className="text-white/90 text-xl leading-relaxed max-w-3xl mx-auto">
                {actu.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden">
              {/* Contenu MDX */}
              <div className="p-8 md:p-12">
                <MdxRenderer code={actu.body?.code || actu.body} />
              </div>
            </div>
          </div>

          {/* Sidebar avec informations */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-display font-bold text-theme-dark mb-6">Informations</h3>
              
              <div className="space-y-6">
                {/* Date */}
                <div>
                  <p className="text-sm text-theme-dark/70 font-medium mb-1">Date de publication</p>
                  <p className="text-theme-dark font-display font-semibold">
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
                    <p className="text-sm text-theme-dark/70 font-medium mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {actu.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-theme-dark text-white text-sm rounded-full font-display"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retour aux actualités */}
                <div className="pt-6 border-t border-theme-dark/20">
                  <a 
                    href="/actus"
                    className="inline-flex items-center text-theme-dark hover:text-theme-dark/70 transition-colors font-display font-medium"
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
  )
}