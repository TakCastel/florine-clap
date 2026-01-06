import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import VideoPlayer from '@/components/VideoPlayer'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import StickyAside from '@/components/StickyAside'
import { getFilmBySlug, getImageUrl, Film } from '@/lib/directus'
import { notFound } from 'next/navigation'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 60

type FilmPageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: FilmPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const film = await getFilmBySlug(slug)
  
  if (!film) {
    return {}
  }

  const headingImageUrl = getImageUrl(film.heading || film.image)
  const imageUrl = getImageUrl(film.image)
  const canonicalUrl = canonical(`/films/${slug}`)
  const description = film.short_synopsis || `Découvrez ${film.title}, un film de Florine Clap.`

  return buildMetadata({
    title: film.title,
    description,
    image: headingImageUrl || imageUrl || undefined,
    canonical: canonicalUrl,
    type: 'article',
    publishedTime: film.annee ? `${film.annee}-01-01` : undefined,
    author: 'Florine Clap',
  })
}

export default async function FilmPage({ params }: FilmPageProps) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const film = await getFilmBySlug(slug)
  
  if (!film) {
    notFound()
  }
  
  const headingImageUrl = getImageUrl(film.heading || film.image)
  const imageUrl = getImageUrl(film.image)
  const canonicalUrl = canonical(`/films/${slug}`)

  const jsonLd = generateJsonLd({
    type: 'Article',
    title: film.title,
    description: film.short_synopsis || `Découvrez ${film.title}, un film de Florine Clap.`,
    image: headingImageUrl || imageUrl || undefined,
    url: canonicalUrl,
    publishedTime: film.annee ? `${film.annee}-01-01` : undefined,
    author: 'Florine Clap',
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeroImage imageUrl={headingImageUrl} alt={film.title} />
      
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films', href: '/films' },
          { label: film.title }
        ]}
        variant="default"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-start" style={{ overflow: 'visible' }}>
        <article className="lg:col-span-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black mb-8">
            {film.title}
          </h1>

          {imageUrl && (
            <img
              src={imageUrl}
              alt={`Image de couverture du film ${film.title}`}
              className="w-full aspect-video object-cover mb-8"
              loading="lazy"
            />
          )}
          
          {film.body && (
            <div className="prose max-w-none text-base text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
              <MarkdownRenderer content={film.body} />
            </div>
          )}

          {film.vimeo_id ? (
            <div className="w-full aspect-video mb-8">
              <VimeoPlayer
                videoId={film.vimeo_id}
                className="w-full h-full"
                autoplay={false}
                muted={false}
                loop={false}
                controls={true}
                title={`Vidéo du film ${film.title}`}
              />
            </div>
          ) : film.video_url ? (
            <VideoPlayer
              src={film.video_url}
              title={film.title}
              ariaLabel={`Vidéo du film ${film.title}`}
            />
          ) : null}
        </article>

        <StickyAside className="lg:col-span-1">
          <section className="border-t border-black/10 pt-8 pb-8">
            <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
              Fiche technique
            </h2>
            
            <dl className="space-y-6">
              {film.realisation && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Réalisation</dt>
                  <dd className="text-black font-display font-medium">{film.realisation}</dd>
                </div>
              )}

              {film.montage && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Montage</dt>
                  <dd className="text-black font-display font-medium">{film.montage}</dd>
                </div>
              )}

              {film.son && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Son</dt>
                  <dd className="text-black font-display font-medium">{film.son}</dd>
                </div>
              )}

              {film.mixage && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Mixage</dt>
                  <dd className="text-black font-display font-medium">{film.mixage}</dd>
                </div>
              )}

              {film.musique && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Musique</dt>
                  <dd className="text-black font-display font-medium">{film.musique}</dd>
                </div>
              )}

              {film.texte && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Texte</dt>
                  <dd className="text-black font-display font-medium">{film.texte}</dd>
                </div>
              )}

              {film.avec && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Avec</dt>
                  <dd className="text-black font-display font-medium">{film.avec}</dd>
                </div>
              )}

              {film.production && (
                <div>
                  <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Production</dt>
                  <dd className="text-black font-display font-medium">{film.production}</dd>
                </div>
              )}

              {(film.duree || film.annee) && (
                <div className="pt-6 border-t border-black/10 grid grid-cols-2 gap-4">
                  {film.duree && (
                    <div>
                      <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</dt>
                      <dd className="text-black font-display font-medium">{film.duree}</dd>
                    </div>
                  )}
                  {film.annee && (
                    <div>
                      <dt className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Année</dt>
                      <dd className="text-black font-display font-medium">{film.annee}</dd>
                    </div>
                  )}
                </div>
              )}
            </dl>
          </section>

          {((film.diffusion && film.diffusion.length > 0) || (film.selection && film.selection.length > 0)) && (
            <section className="border-t border-black/10 pt-8 pb-8">
              <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
                Diffusion / Sélection
              </h2>
              
              <div className="space-y-6">
                {film.diffusion && film.diffusion.length > 0 && (
                  <div>
                    <h3 className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Diffusion</h3>
                    <ul className="space-y-2">
                      {film.diffusion.map((item, index) => (
                        <li key={index} className="text-black font-display font-medium text-xs">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {film.selection && film.selection.length > 0 && (
                  <div>
                    <h3 className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Sélection</h3>
                    <ul className="space-y-2">
                      {film.selection.map((item, index) => (
                        <li key={index} className="text-black font-display font-medium text-xs">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {film.lien_film && (
            <section className="border-t border-black/10 pt-8 pb-8">
              <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
                Voir le film
              </h2>
              <a 
                href={film.lien_film}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le film ${film.title} sur le site externe`}
                className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-xs uppercase tracking-[0.1em]"
              >
                Voir le film →
              </a>
            </section>
          )}

          {film.remerciements && (
            <section className="border-t border-black/10 pt-8 pb-8">
              <h2 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-black mb-6">
                Remerciements
              </h2>
              <p className="text-xs text-black font-display font-medium">
                {film.remerciements}
              </p>
            </section>
          )}

          <nav className="border-t border-black/10 pt-8 pb-0">
            <a 
              href="/films"
              aria-label="Retour à la liste des films"
              className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-xs uppercase tracking-[0.1em]"
            >
              ← Retour aux films
            </a>
          </nav>
        </StickyAside>
      </div>
    </>
  )
}
