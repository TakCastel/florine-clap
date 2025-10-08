import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allPages } from '.contentlayer/generated'
import { buildMetadata } from '@/components/Seo'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const dynamic = 'error'

export default function BioPage() {
  const bio = allPages.find((p) => p._raw.flattenedPath === 'pages/bio') || allPages[0]
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Bio' }
        ]}
        variant="dark"
      />
      <h1 className="text-3xl font-semibold">{bio?.title || 'Bio'}</h1>
      {bio?.body?.code && (
        <div className="mt-8">
          <MdxRenderer code={bio.body.code} />
        </div>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const bio = allPages.find((p) => p._raw.flattenedPath === 'pages/bio') || allPages[0]
  if (!bio) return {}
  return buildMetadata({
    title: bio.seo_title || bio.title,
    description: bio.seo_description,
    image: bio.seo_image,
    canonical: canonical('/bio'),
    noindex: bio.noindex,
  })
}


