import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allActus } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Actualités', href: '/actus' },
            { label: actu.title }
          ]}
          variant="default"
        />
        
        <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
          {/* En-tête de l'actualité */}
          <div className="bg-theme-navy text-white p-8">
            <h1 className="text-4xl font-bold mb-2">{actu.title}</h1>
            <div className="text-lg">
              <span>{new Date(actu.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Extrait */}
          {actu.excerpt && (
            <div className="p-8 border-b">
              <p className="text-xl text-gray-600 leading-relaxed italic">{actu.excerpt}</p>
            </div>
          )}

          {/* Contenu principal */}
          <div className="p-8">
            <MdxRenderer code={actu.body.code} />
          </div>
        </article>
      </div>
    </div>
  )
}