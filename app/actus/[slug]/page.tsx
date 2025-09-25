import MdxRenderer from '@/components/MdxRenderer'
import { allActus } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

export const dynamic = 'error'

export const generateStaticParams = async () => allActus.map((p) => ({ slug: p.slug }))

export default function ActuPage({ params }: { params: { slug: string } }) {
  const doc = allActus.find((d) => d.slug === params.slug)
  if (!doc) return notFound()
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-semibold">{doc.title}</h1>
        <p className="mt-2 text-sm text-gray-500">{new Date(doc.date).toLocaleDateString('fr-FR')}</p>
        <div className="mt-8">
          <MdxRenderer code={doc.body.code} />
        </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = allActus.find((d) => d.slug === params.slug)
  if (!doc) return {}
  return buildMetadata({
    title: doc.seo_title || doc.title,
    description: doc.seo_description || doc.excerpt,
    image: doc.seo_image || doc.cover,
    canonical: canonical(`/actus/${doc.slug}`),
    noindex: doc.noindex,
  })
}


