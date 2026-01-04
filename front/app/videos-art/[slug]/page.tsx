import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import { getVideoArtBySlug, getImageUrl, VideoArt } from '@/lib/directus'
import { notFound } from 'next/navigation'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60

type VideoArtPageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: VideoArtPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const videoArt = await getVideoArtBySlug(slug)
  
  if (!videoArt) {
    return {}
  }

  const imageUrl = getImageUrl(videoArt.image)
  const canonicalUrl = canonical(`/videos-art/${slug}`)
  const description = `Découvrez ${videoArt.title}, une vidéo d'art de Florine Clap.`

  return buildMetadata({
    title: videoArt.title,
    description,
    image: imageUrl || undefined,
    canonical: canonicalUrl,
    type: 'video',
    publishedTime: videoArt.annee ? `${videoArt.annee}-01-01` : undefined,
    author: 'Florine Clap',
  })
}

export default async function VideoArtPage({ params }: VideoArtPageProps) {
  // Gérer les params synchrones et asynchrones (Next.js 14+)
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const videoArt = await getVideoArtBySlug(slug)
  
  if (!videoArt) {
    console.error(`VideoArt not found for slug: ${slug}`)
    notFound()
  }
  
  const imageUrl = getImageUrl(videoArt.image)
  const canonicalUrl = canonical(`/videos-art/${slug}`)

  const jsonLd = generateJsonLd({
    type: 'VideoObject',
    title: videoArt.title,
    description: `Découvrez ${videoArt.title}, une vidéo d'art de Florine Clap.`,
    image: imageUrl || undefined,
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
      <main id="main-content" className="min-h-screen bg-theme-white text-black">
      {/* Image hero avec dégradés pour le header */}
      <ArticleHeroImage imageUrl={imageUrl} alt={videoArt.title} />
      
      {/* Breadcrumb positionné sur l'image */}
      <div className="absolute top-20 left-0 right-0 z-50">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Vidéos/art', href: '/videos-art' },
            { label: videoArt.title }
          ]}
          variant="default"
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 -mt-10 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Titre et métadonnées */}
            <div className="mb-8">
              <div className="flex items-center gap-6 text-black/60 text-sm uppercase tracking-[0.2em] mb-4 font-light">
                {videoArt.duree && (
                  <span>{videoArt.duree}</span>
                )}
                {videoArt.annee && (
                  <span>{videoArt.annee}</span>
                )}
              </div>
              <h1 className="heading-page text-black mb-8">
                {videoArt.title}
              </h1>
            </div>

            {/* Image dans l'article */}
            {imageUrl ? (
              <div className="relative w-full aspect-video overflow-hidden mb-8 rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`Image de couverture de la vidéo d'art ${videoArt.title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-black/5 flex items-center justify-center mb-8 rounded-lg">
                <div className="text-center text-black/30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm uppercase tracking-[0.2em]">Image non disponible</p>
                </div>
              </div>
            )}
            
            {/* Contenu Markdown */}
            {videoArt.body && (
              <div className="prose prose-lg max-w-none text-black mb-12">
                <MarkdownRenderer content={videoArt.body} />
              </div>
            )}

            {/* Player Vimeo en fin d'article */}
            {videoArt.vimeo_id ? (
              <div className="relative w-full aspect-video overflow-hidden">
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
              <div className="relative w-full aspect-video overflow-hidden">
                <video
                  src={videoArt.video_url}
                  controls
                  className="w-full h-full object-contain"
                  aria-label={`Vidéo d'art ${videoArt.title}`}
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-black/5 flex items-center justify-center">
                <div className="text-center text-black/30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm uppercase tracking-[0.2em]">Vidéo non disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar avec informations techniques */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border-t border-black/10 pt-8">
                <h3 className="heading-subtitle text-black mb-6">
                  Fiche technique
                </h3>
                
                <div className="space-y-6">
                  {/* Réalisation */}
                  {videoArt.realisation && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Réalisation</p>
                      <p className="text-black font-display font-medium">{videoArt.realisation}</p>
                    </div>
                  )}

                  {/* Mixage */}
                  {videoArt.mixage && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Mixage</p>
                      <p className="text-black font-display font-medium">{videoArt.mixage}</p>
                    </div>
                  )}

                  {/* Texte */}
                  {videoArt.texte && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Texte</p>
                      <p className="text-black font-display font-medium">{videoArt.texte}</p>
                    </div>
                  )}

                  {/* Production */}
                  {videoArt.production && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Production</p>
                      <p className="text-black font-display font-medium">{videoArt.production}</p>
                    </div>
                  )}

                  {/* Durée et année */}
                  {(videoArt.duree || videoArt.annee) && (
                    <div className="pt-6 border-t border-black/10">
                      <div className="grid grid-cols-2 gap-4">
                        {videoArt.duree && (
                          <div>
                            <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                            <p className="text-black font-display font-medium">{videoArt.duree}</p>
                          </div>
                        )}
                        {videoArt.annee && (
                          <div>
                            <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Année</p>
                            <p className="text-black font-display font-medium">{videoArt.annee}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Retour aux vidéos/art */}
              <div className="border-t border-black/10 pt-8 mt-8">
                <a 
                  href="/videos-art"
                  aria-label="Retour à la liste des vidéos d'art"
                  className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                >
                  ← Retour aux vidéos/art
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  )
}

