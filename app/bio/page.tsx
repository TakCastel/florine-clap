import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allPages } from '.contentlayer/generated'
import { buildMetadata } from '@/components/Seo'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const dynamic = 'error'

export async function generateMetadata(): Promise<Metadata> {
  const page = allPages.find(p => p.slug === 'bio')
  
  if (!page) {
    return {}
  }

  return buildMetadata({
    title: page.title,
    description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo'
  })
}

export default function BioPage() {
  const page = allPages.find(p => p.slug === 'bio')
  
  if (!page) {
    return <div>Page non trouvee</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'A propos' }
          ]}
          variant="default"
        />
        
        <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
          {/* En-tete avec portrait */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {page.portrait && (
                <img 
                  src={page.portrait} 
                  alt={page.title}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
                <p className="text-lg opacity-90">Realisatrice et formatrice en mediations video</p>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-8">
            <MdxRenderer code={page.body.code} />
          </div>
        </article>
      </div>
    </div>
  )
}