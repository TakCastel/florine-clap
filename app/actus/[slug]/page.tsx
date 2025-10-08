import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Actualités', href: '/actus' },
            { label: doc.title }
          ]}
          variant="yellow"
        />
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide text-theme-yellow">{doc.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{new Date(doc.date).toLocaleDateString('fr-FR')}</p>
        <div className="mt-8">
          <MdxRenderer code={doc.body.code} />
        </div>
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


