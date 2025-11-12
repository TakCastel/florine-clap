import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allMediations } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

export const dynamic = 'error'

type MediationPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: MediationPageProps): Promise<Metadata> {
  const mediation = allMediations.find(m => m.slug === params.slug)
  
  if (!mediation) {
    return {}
  }

  return buildMetadata({
    title: mediation.title,
    description: mediation.excerpt
  })
}

export default function MediationPage({ params }: MediationPageProps) {
  const mediation = allMediations.find(m => m.slug === params.slug)
  
  if (!mediation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Mediations', href: '/mediations' },
          { label: mediation.title }
        ]}
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8">
        
        <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
          {/* En-tete de la mediation */}
          <div className="bg-theme-navy text-white p-8">
            <h1 className="text-4xl font-bold mb-2">{mediation.title}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <span>{new Date(mediation.date).toLocaleDateString('fr-FR')}</span>
              {mediation.lieu && <span>•</span>}
              {mediation.lieu && <span>{mediation.lieu}</span>}
              {mediation.duree && <span>•</span>}
              {mediation.duree && <span>{mediation.duree}</span>}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-8">
            <MdxRenderer code={mediation.body.code} />
          </div>

          {/* Modalites */}
          {mediation.modalites && (
            <div className="p-8 bg-gray-50 border-t">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Modalites</h2>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: mediation.modalites.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          )}

          {/* Lien d'inscription */}
          {mediation.lien_inscription && (
            <div className="p-8 bg-blue-50 border-t">
              <a 
                href={mediation.lien_inscription}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                S'inscrire a la mediation
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}