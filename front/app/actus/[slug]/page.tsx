import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import { getActuBySlug, getImageUrl, Actu } from '@/lib/directus'
import { notFound } from 'next/navigation'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60

type ActuPageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: ActuPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const actu = await getActuBySlug(slug)
  
  if (!actu) {
    return {}
  }

  const coverUrl = getImageUrl(actu.cover)
  const canonicalUrl = canonical(`/actus/${slug}`)
  const description = actu.excerpt || `Découvrez ${actu.title}, une actualité de Florine Clap.`

  return buildMetadata({
    title: actu.title,
    description,
    image: coverUrl || undefined,
    canonical: canonicalUrl,
    type: 'article',
    publishedTime: actu.date ? new Date(actu.date).toISOString() : undefined,
    author: 'Florine Clap',
  })
}

export default async function ActuPage({ params }: ActuPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const actu = await getActuBySlug(slug)
  
  if (!actu) {
    notFound()
  }
  
  const coverUrl = getImageUrl(actu.cover)
  const canonicalUrl = canonical(`/actus/${slug}`)

  const jsonLd = generateJsonLd({
    type: 'Article',
    title: actu.title,
    description: actu.excerpt || `Découvrez ${actu.title}, une actualité de Florine Clap.`,
    image: coverUrl || undefined,
    url: canonicalUrl,
    publishedTime: actu.date ? new Date(actu.date).toISOString() : undefined,
    author: 'Florine Clap',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeroImage imageUrl={coverUrl} alt={actu.title} />
      
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Actualités', href: '/actus' },
          { label: actu.title }
        ]}
        variant="default"
      />

      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 -mt-16 md:-mt-20 pt-8 md:pt-12 pb-16 md:pb-24">
        <header className="mb-8">
          {actu.date && (
            <div className="text-black/60 text-xs uppercase tracking-[0.2em] mb-4 font-light">
              <span>{new Date(actu.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black">
            {actu.title}
          </h1>
        </header>

        <article>
          {actu.body && (
            <div className="prose max-w-none text-base text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
              <MarkdownRenderer content={actu.body} skipFirstHeading={true} />
            </div>
          )}

          {coverUrl && (
            <img
              src={coverUrl}
              alt={`Image de couverture de l'article ${actu.title}`}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          )}
        </article>
      </div>
    </>
  )
}
