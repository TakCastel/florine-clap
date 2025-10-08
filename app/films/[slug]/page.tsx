import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

export const dynamic = 'error'

export const generateStaticParams = async () => allFilms.map((p) => ({ slug: p.slug }))

export default function FilmPage({ params }: { params: { slug: string } }) {
  const doc = allFilms.find((d) => d.slug === params.slug)
  if (!doc) return notFound()
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Films', href: '/films' },
            { label: doc.title }
          ]}
          variant="blue"
        />
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide text-theme-blue">{doc.title} ({doc.annee})</h1>
        {doc.duree && <p className="mt-1 text-sm text-gray-600">Durée : {doc.duree}</p>}
        {doc.synopsis && <p className="mt-4 text-gray-700">{doc.synopsis}</p>}
        {doc.vimeo && (
          <div className="mt-6 aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${doc.vimeo}`}
              allow="autoplay; fullscreen; picture-in-picture"
              className="w-full h-full"
            />
          </div>
        )}
        {doc.youtube && (
          <div className="mt-6 aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${doc.youtube}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full"
            />
          </div>
        )}
        {doc.selections && doc.selections.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-theme-blue">Festivals & Sélections</h3>
            <ul className="list-disc list-inside">
              {doc.selections.map((selection, index) => (
                <li key={index} className="text-gray-700">{selection}</li>
              ))}
            </ul>
          </div>
        )}
        {doc.credits && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-theme-blue">Crédits</h3>
            <div className="prose prose-sm whitespace-pre-wrap text-gray-700">
              {typeof doc.credits === 'string' ? doc.credits : doc.credits.raw}
            </div>
          </div>
        )}
        {doc.body?.code && (
          <div className="mt-8">
            <MdxRenderer code={doc.body.code} />
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = allFilms.find((d) => d.slug === params.slug)
  if (!doc) return {}
  return buildMetadata({
    title: doc.seo_title || `${doc.title} (${doc.annee})`,
    description: doc.seo_description || doc.excerpt,
    image: doc.seo_image || doc.cover,
    canonical: canonical(`/films/${doc.slug}`),
    noindex: doc.noindex,
  })
}


