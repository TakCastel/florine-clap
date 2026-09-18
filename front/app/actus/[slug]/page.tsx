import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import ActuCard from '@/components/ActuCard'
import { Reveal } from '@/components/ui/Reveal'
import { getActuBySlug, getAllActus, getImageUrl, Actu } from '@/lib/directus'
import { notFound } from 'next/navigation'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'

// Cache 24h ; revalidation à la demande via /api/revalidate (webhook Directus)
export const revalidate = 86400

type ActuPageProps = {
  params: Promise<{ slug: string }>
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
  // 'extrait' (défaut) : image en bas, texte resserré à la taille de l'image
  // 'flyer' : image en haut à droite, texte qui l'entoure
  const isFlyer = actu.type === 'flyer'
  // Dimensions réelles pour préserver le ratio (un flyer est souvent vertical, on ne veut pas le rogner)
  const coverDims = typeof actu.cover === 'object' && actu.cover?.width && actu.cover?.height
    ? { width: actu.cover.width, height: actu.cover.height }
    : null

  // Actualités liées : les plus récentes, hors article courant (maillage interne utile au SEO)
  const allActus = await getAllActus()
  const relatedActus = allActus.filter((item) => item.id !== actu.id).slice(0, 3)

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
      <div className="relative">
        <ArticleHeroImage imageUrl={coverUrl} alt={actu.title} />

        <div className="relative z-10">
          <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pt-20 md:pt-28">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Actualités', href: '/actus' },
                { label: actu.title }
              ]}
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* Contenu de l'article avec titre */}
      <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pb-32 md:pb-48 relative z-10" style={{ marginTop: '-66vh' }}>
        <div className={isFlyer ? '' : 'max-w-2xl mx-auto'}>
          <header className="mb-8 pt-6">
            {actu.date && (
              <div className="text-black/60 text-xs uppercase tracking-[0.2em] mb-4 font-light">
                <span>{new Date(actu.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black">
              {actu.title}
            </h1>
          </header>
          <Reveal width="100%">
          <article>
            {isFlyer ? (
              <>
                {coverUrl && (
                  coverDims ? (
                    <div className="relative float-right w-32 sm:w-48 md:w-64 ml-4 sm:ml-6 mb-3">
                      <Image
                        src={coverUrl}
                        alt={`Image de couverture de l'actualité ${actu.title}${actu.date ? ` du ${new Date(actu.date).toLocaleDateString('fr-FR')}` : ''}`}
                        width={coverDims.width}
                        height={coverDims.height}
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
                        className="w-full h-auto"
                        quality={85}
                      />
                    </div>
                  ) : (
                    // Dimensions inconnues (API publique Directus ne les expose pas) : on ne peut pas
                    // utiliser next/image en mode fill sans imposer un ratio arbitraire qui rognerait ou
                    // laisserait du vide. Une <img> classique en w-full h-auto épouse le ratio réel du fichier.
                    <div className="float-right w-32 sm:w-48 md:w-64 ml-4 sm:ml-6 mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverUrl}
                        alt={`Image de couverture de l'actualité ${actu.title}${actu.date ? ` du ${new Date(actu.date).toLocaleDateString('fr-FR')}` : ''}`}
                        className="w-full h-auto"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )
                )}

                {actu.body && (
                  <div className="prose max-w-none text-base text-black mb-12 [&_p]:text-justify [&_li]:text-justify [&_img]:w-full [&_img]:h-auto [&_img]:bg-transparent">
                    <MarkdownRenderer content={actu.body} skipFirstHeading={true} />
                  </div>
                )}
              </>
            ) : (
              <>
                {actu.body && (
                  <div className="prose max-w-none text-base text-black mb-8 [&_p]:text-justify [&_li]:text-justify [&_img]:w-full [&_img]:h-auto [&_img]:bg-transparent">
                    <MarkdownRenderer content={actu.body} skipFirstHeading={true} />
                  </div>
                )}

                {coverUrl && (
                  <div className="relative w-full aspect-[4/3] mb-12 overflow-hidden">
                    <Image
                      src={coverUrl}
                      alt={`Image de couverture de l'actualité ${actu.title}${actu.date ? ` du ${new Date(actu.date).toLocaleDateString('fr-FR')}` : ''}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                      quality={85}
                    />
                  </div>
                )}
              </>
            )}
          </article>
          </Reveal>

          <nav className="border-t border-black/10 pt-8 pb-0 mt-8">
            <Link
              href="/actus"
              prefetch
              aria-label="Retour à la liste des actualités"
              className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-xs uppercase tracking-[0.1em]"
            >
              ← Retour aux actualités
            </Link>
          </nav>
        </div>

        {/* Ces actualités pourraient vous intéresser - maillage interne */}
        {relatedActus.length > 0 && (
          <div className="mt-24 pt-12 border-t border-black/10">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-8" style={{
              fontFamily: 'var(--font-andalemo), sans-serif',
              letterSpacing: '-0.02em',
            }}>
              Ces actualités pourraient vous intéresser
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {relatedActus.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05} threshold={0.1} width="100%">
                  <ActuCard
                    href={`/actus/${item.slug}`}
                    title={item.title}
                    cover={getImageUrl(item.cover) || undefined}
                    excerpt={item.excerpt}
                    body={item.body}
                    date={item.date}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
