import MdxRenderer from '@/components/MdxRenderer'
import { allAteliers } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

export const dynamic = 'error'

export const generateStaticParams = async () => allAteliers.map((p) => ({ slug: p.slug }))

export default function AtelierPage({ params }: { params: { slug: string } }) {
  const doc = allAteliers.find((d) => d.slug === params.slug)
  if (!doc) return notFound()
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide text-white">{doc.title}</h1>
        <p className="mt-2 text-sm text-gray-300">
          {new Date(doc.date).toLocaleDateString('fr-FR')} · {doc.lieu}{doc.duree ? ` · ${doc.duree}` : ''}
        </p>
        {doc.modalites && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Modalités</h3>
            <div className="prose prose-sm dark:prose-invert text-white">
              <MdxRenderer code={typeof doc.modalites === 'string' ? doc.modalites : doc.modalites.raw} />
            </div>
          </div>
        )}
        {doc.lien_inscription && (
          <div className="mt-6">
            <a 
              href={doc.lien_inscription} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-orange-500 text-white px-6 py-3 hover:bg-orange-600 transition-colors"
            >
              S'inscrire
            </a>
          </div>
        )}
        <div className="mt-8">
          <MdxRenderer code={doc.body.code} />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = allAteliers.find((d) => d.slug === params.slug)
  if (!doc) return {}
  return buildMetadata({
    title: doc.seo_title || doc.title,
    description: doc.seo_description || doc.excerpt,
    image: doc.seo_image,
    canonical: canonical(`/ateliers/${doc.slug}`),
    noindex: doc.noindex,
  })
}


