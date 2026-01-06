import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import VideoPlayer from '@/components/VideoPlayer'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import StickyAside from '@/components/StickyAside'
import { getMediationBySlug, getImageUrl, Mediation } from '@/lib/directus'
import { notFound } from 'next/navigation'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60

type MediationPageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: MediationPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const mediation = await getMediationBySlug(slug)
  
  if (!mediation) {
    return {}
  }

  const coverUrl = getImageUrl(mediation.cover)
  const canonicalUrl = canonical(`/mediations/${slug}`)
  const description = mediation.excerpt || `Découvrez ${mediation.title}, une médiation artistique de Florine Clap.`

  return buildMetadata({
    title: mediation.title,
    description,
    image: coverUrl || undefined,
    canonical: canonicalUrl,
    type: 'article',
    publishedTime: mediation.date ? new Date(mediation.date).toISOString() : undefined,
    author: 'Florine Clap',
  })
}

export default async function MediationPage({ params }: MediationPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const mediation = await getMediationBySlug(slug)
  
  if (!mediation) {
    notFound()
  }
  
  const coverUrl = getImageUrl(mediation.cover)
  const canonicalUrl = canonical(`/mediations/${slug}`)

  const jsonLd = generateJsonLd({
    type: 'Article',
    title: mediation.title,
    description: mediation.excerpt || `Découvrez ${mediation.title}, une médiation artistique de Florine Clap.`,
    image: coverUrl || undefined,
    url: canonicalUrl,
    publishedTime: mediation.date ? new Date(mediation.date).toISOString() : undefined,
    author: 'Florine Clap',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeroImage imageUrl={coverUrl} alt={mediation.title} />
      
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Médiations', href: '/mediations' },
          { label: mediation.title }
        ]}
        variant="default"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-start" style={{ overflow: 'visible' }}>
        <article className="lg:col-span-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black mb-8">
            {mediation.title}
          </h1>

          {coverUrl && (
            <img
              src={coverUrl}
              alt={`Image de couverture de la médiation ${mediation.title}`}
              className="w-full aspect-video object-cover mb-8"
              loading="lazy"
            />
          )}
          
          {mediation.body && (
            <div className="prose max-w-none text-base text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
              <MarkdownRenderer content={mediation.body} />
            </div>
          )}

          {(mediation.vimeoId || mediation.vimeo_id) ? (
            <div className="w-full aspect-video mb-8">
              <VimeoPlayer
                videoId={mediation.vimeoId || mediation.vimeo_id || ''}
                className="w-full h-full"
                autoplay={false}
                muted={false}
                loop={false}
                controls={true}
                title={`Vidéo de la médiation ${mediation.title}`}
              />
            </div>
          ) : (mediation.videoUrl || mediation.video_url) ? (
            <VideoPlayer
              src={mediation.videoUrl || mediation.video_url || ''}
              title={mediation.title}
              ariaLabel={`Vidéo de la médiation ${mediation.title}`}
            />
          ) : null}
        </article>

        <StickyAside className="lg:col-span-1">
          <section className="border-t border-black/10 pt-8 pb-8">
            <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
              Informations
            </h2>
            
            <dl className="space-y-6">
              <div>
                <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Date</dt>
                <dd className="text-black font-display font-medium">
                  {new Date(mediation.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>

              {mediation.lieu && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Lieu</dt>
                  <dd className="text-black font-display font-medium">{mediation.lieu}</dd>
                </div>
              )}

              {mediation.duree && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</dt>
                  <dd className="text-black font-display font-medium">{mediation.duree}</dd>
                </div>
              )}

              {mediation.tags && mediation.tags.length > 0 && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Tags</dt>
                  <dd>
                    <div className="flex flex-wrap gap-2">
                      {mediation.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1.5 bg-black/5 border border-black/10 text-black text-xs rounded-full font-display font-light"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <nav className="border-t border-black/10 pt-8 pb-0">
            <a 
              href="/mediations"
              aria-label="Retour à la liste des médiations"
              className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-xs uppercase tracking-[0.1em]"
            >
              ← Retour aux médiations
            </a>
          </nav>
        </StickyAside>
      </div>
    </>
  )
}
