import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

export const dynamic = 'error'

type FilmPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const film = allFilms.find(f => f.slug === params.slug)
  
  if (!film) {
    return {}
  }

  return buildMetadata({
    title: film.title,
    description: 'Découvrez ce film de Florine Clap'
  })
}

export default function FilmPage({ params }: FilmPageProps) {
  const film = allFilms.find(f => f.slug === params.slug)
  
  if (!film) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Films', href: '/films' },
            { label: film.title }
          ]}
          variant="blue"
        />
        
        <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
          {/* En-tête du film */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">{film.title}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <span>Film</span>
            </div>
          </div>

          {/* Synopsis - Section supprimée car propriété synopsis n'existe pas */}

          {/* Contenu principal */}
          <div className="p-8">
            <MdxRenderer code={film.body.code} />
          </div>

          {/* Crédits - Section supprimée car propriété credits n'existe pas */}
        </article>
      </div>
    </div>
  )
}