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
    <div className="min-h-screen bg-white">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualités', href: '/actus' },
          { label: actu.title }
        ]}
        variant="white"
      />

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            <div className="bg-white">
              {/* Contenu MDX */}
              <div className="p-8">
                <MdxRenderer code={actu.body.code} />
              </div>
            </div>
          </div>

          {/* Sidebar avec informations */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-theme-blue mb-6">Informations</h3>
              
              <div className="space-y-6">
                {/* Date */}
                <div>
                  <p className="text-sm text-gray-600 font-medium">Date de publication</p>
                  <p className="text-theme-blue font-semibold">
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
                    <p className="text-sm text-gray-600 font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {actu.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-theme-blue text-white text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Retour aux actualités */}
                <div className="pt-4 border-t border-gray-200">
                  <a 
                    href="/actus"
                    className="inline-flex items-center text-theme-blue hover:text-theme-dark transition-colors"
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