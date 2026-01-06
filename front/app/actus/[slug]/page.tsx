import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import StickyAside from '@/components/StickyAside'
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
    tags: actu.tags,
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

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-start" style={{ overflow: 'visible' }}>
        <article className="lg:col-span-2">
          {coverUrl && (
            <img
              src={coverUrl}
              alt={`Image de couverture de l'article ${actu.title}`}
              className="w-full h-auto object-contain mb-8"
              loading="lazy"
            />
          )}
          
          {actu.body && (
            <div className="prose max-w-none text-base text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
              <MarkdownRenderer content={actu.body} shiftHeadings={true} />
            </div>
          )}
        </article>

        <StickyAside className="lg:col-span-1">
          {actu.tags && actu.tags.length > 0 && (
            <section className="border-t border-black/10 pt-8 pb-8">
              <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
                Informations
              </h2>
              <h3 className="text-xs text-black font-display font-medium uppercase tracking-[0.05em] mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {actu.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-black text-white text-xs font-display font-medium uppercase tracking-[0.05em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          <nav className="border-t border-black/10 pt-8 pb-0">
            <a 
              href="/actus"
              aria-label="Retour à la liste des actualités"
              className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-xs uppercase tracking-[0.1em]"
            >
              ← Retour aux actualités
            </a>
          </nav>
        </StickyAside>
      </div>
    </>
  )
}
