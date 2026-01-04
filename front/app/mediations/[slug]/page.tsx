import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import ArticleHeroImage from '@/components/ArticleHeroImage'
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
  // Gérer les params synchrones et asynchrones (Next.js 14+)
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const mediation = await getMediationBySlug(slug)
  
  if (!mediation) {
    console.error(`Mediation not found for slug: ${slug}`)
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
      <main id="main-content" className="min-h-screen bg-theme-white text-black">
      {/* Image hero avec dégradés pour le header */}
      <ArticleHeroImage imageUrl={coverUrl} alt={mediation.title} />
      
      {/* Breadcrumb positionné sur l'image */}
      <div className="absolute top-20 left-0 right-0 z-50">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Médiations', href: '/mediations' },
            { label: mediation.title }
          ]}
          variant="default"
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 -mt-10 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Image dans l'article */}
            {coverUrl ? (
              <div className="relative w-full aspect-video overflow-hidden mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt={`Image de couverture de la médiation ${mediation.title}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-black/5 flex items-center justify-center mb-8">
                <div className="text-center text-black/30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm uppercase tracking-[0.2em]">Image non disponible</p>
                </div>
              </div>
            )}
            
            {/* Contenu Markdown */}
            {mediation.body && (
              <div className="prose prose-lg max-w-none text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
                <MarkdownRenderer content={mediation.body} />
              </div>
            )}

            {/* Player Vimeo en fin d'article */}
            {(mediation.vimeoId || mediation.vimeo_id) ? (
              <div className="relative w-full aspect-video overflow-hidden">
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
              <div className="relative w-full aspect-video overflow-hidden">
                <video
                  src={mediation.videoUrl || mediation.video_url || ''}
                  controls
                  className="w-full h-full object-contain"
                  aria-label={`Vidéo de la médiation ${mediation.title}`}
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

          {/* Sidebar avec métadonnées organisées */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Informations */}
              <div className="border-t border-black/10 pt-8 mb-8">
                <h3 className="heading-subtitle text-black mb-6">
                  Informations
                </h3>
                
                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Date</p>
                    <p className="text-black font-display font-medium">
                      {new Date(mediation.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Lieu */}
                  {mediation.lieu && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Lieu</p>
                      <p className="text-black font-display font-medium">{mediation.lieu}</p>
                    </div>
                  )}

                  {/* Durée */}
                  {mediation.duree && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                      <p className="text-black font-display font-medium">{mediation.duree}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {mediation.tags && mediation.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {mediation.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-black/5 border border-black/10 text-black text-sm rounded-full font-display font-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Retour aux médiations */}
              <div className="border-t border-black/10 pt-8">
                <a 
                  href="/mediations"
                  aria-label="Retour à la liste des médiations"
                  className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                >
                  ← Retour aux médiations
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