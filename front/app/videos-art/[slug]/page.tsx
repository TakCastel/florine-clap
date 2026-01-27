import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import VideoPlayer from '@/components/VideoPlayer'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import StickyAside from '@/components/StickyAside'
import { getVideoArtBySlug, getImageUrl, getVideoUrl, VideoArt } from '@/lib/directus'
import { notFound } from 'next/navigation'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60

type VideoArtPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: VideoArtPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const videoArt = await getVideoArtBySlug(slug)
  
  if (!videoArt) {
    return {}
  }

  const headingImageUrl = getImageUrl(videoArt.image)
  const canonicalUrl = canonical(`/videos-art/${slug}`)
  const description = `Découvrez ${videoArt.title}, une vidéo d'art de Florine Clap.`

  return buildMetadata({
    title: videoArt.title,
    description,
    image: headingImageUrl || undefined,
    canonical: canonicalUrl,
    type: 'video',
    publishedTime: videoArt.annee ? `${videoArt.annee}-01-01` : undefined,
    author: 'Florine Clap',
  })
}

export default async function VideoArtPage({ params }: VideoArtPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const videoArt = await getVideoArtBySlug(slug)
  
  if (!videoArt) {
    notFound()
  }
  
  const headingImageUrl = getImageUrl(videoArt.image)
  const imageUrl = getImageUrl(videoArt.image)
  const directusVideoUrl = getVideoUrl(videoArt.video)
  const canonicalUrl = canonical(`/videos-art/${slug}`)

  const jsonLd = generateJsonLd({
    type: 'VideoObject',
    title: videoArt.title,
    description: `Découvrez ${videoArt.title}, une vidéo d'art de Florine Clap.`,
    image: headingImageUrl || undefined,
    url: canonicalUrl,
    publishedTime: videoArt.annee ? `${videoArt.annee}-01-01` : undefined,
    duration: videoArt.duree,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative">
        <ArticleHeroImage imageUrl={headingImageUrl} alt={videoArt.title} />
        
        <div className="relative z-10">
          <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-28">
            <Breadcrumb 
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Vidéos/art', href: '/videos-art' },
                { label: videoArt.title }
              ]}
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* Contenu de l'article avec titre */}
      <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pb-32 md:pb-48 relative z-10" style={{ marginTop: '-66vh' }}>
        <header className="mb-8 pt-6">
          <div className="flex items-center gap-6 text-black/60 text-xs uppercase tracking-[0.2em] mb-4 font-light">
            {videoArt.duree && <span>{videoArt.duree}</span>}
            {videoArt.annee && <span>{videoArt.annee}</span>}
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black">
            {videoArt.title}
          </h1>
        </header>
        <article>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`Image de couverture de la vidéo d'art ${videoArt.title}`}
              className="w-full aspect-video object-cover mb-8"
              loading="lazy"
            />
          )}
          
          {videoArt.body && (
            <div className="prose max-w-none text-base text-black mb-12">
              <MarkdownRenderer content={videoArt.body} />
            </div>
          )}

          {directusVideoUrl ? (
            <VideoPlayer
              src={directusVideoUrl}
              title={videoArt.title}
              ariaLabel={`Vidéo d'art ${videoArt.title}`}
            />
          ) : videoArt.vimeo_id ? (
            <div className="w-full aspect-video mb-8">
              <VimeoPlayer
                videoId={videoArt.vimeo_id}
                className="w-full h-full"
                autoplay={false}
                muted={false}
                loop={false}
                controls={true}
                title={`Vidéo d'art ${videoArt.title}`}
              />
            </div>
          ) : videoArt.video_url ? (
            <VideoPlayer
              src={videoArt.video_url}
              title={videoArt.title}
              ariaLabel={`Vidéo d'art ${videoArt.title}`}
            />
          ) : null}
        </article>

        <div className="mt-12">
          <StickyAside>
            <section className="border-t border-black/10 pt-8 pb-8">
              <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
                Fiche technique
              </h2>
              
              <dl className="space-y-6">
                {videoArt.realisation && (
                  <div>
                    <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Réalisation</dt>
                    <dd className="text-black font-display font-medium">{videoArt.realisation}</dd>
                  </div>
                )}

                {videoArt.mixage && (
                  <div>
                    <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Mixage</dt>
                    <dd className="text-black font-display font-medium">{videoArt.mixage}</dd>
                  </div>
                )}

                {videoArt.texte && (
                  <div>
                    <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Texte</dt>
                    <dd className="text-black font-display font-medium">{videoArt.texte}</dd>
                  </div>
                )}

                {videoArt.production && (
                  <div>
                    <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Production</dt>
                    <dd className="text-black font-display font-medium">{videoArt.production}</dd>
                  </div>
                )}

                {(videoArt.duree || videoArt.annee) && (
                  <div className="pt-6 border-t border-black/10 grid grid-cols-2 gap-4">
                    {videoArt.duree && (
                      <div>
                        <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</dt>
                        <dd className="text-black font-display font-medium">{videoArt.duree}</dd>
                      </div>
                    )}
                    {videoArt.annee && (
                      <div>
                        <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Année</dt>
                        <dd className="text-black font-display font-medium">{videoArt.annee}</dd>
                      </div>
                    )}
                  </div>
                )}
              </dl>
            </section>

            <nav className="border-t border-black/10 pt-8 pb-0">
              <a 
                href="/videos-art"
                aria-label="Retour à la liste des vidéos d'art"
                className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-xs uppercase tracking-[0.1em]"
              >
                ← Retour aux vidéos/art
              </a>
            </nav>
          </StickyAside>
        </div>
      </div>
    </>
  )
}
