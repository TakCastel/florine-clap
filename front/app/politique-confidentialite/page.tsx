import { buildMetadata } from '@/components/Seo'
import { canonical } from '@/lib/seo'
import { Metadata } from 'next'
import { getPageBySlug, getImageUrl } from '@/lib/directus'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalider toutes les heures

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = canonical('/politique-confidentialite')
  return buildMetadata({
    title: 'Politique de confidentialité',
    description: 'Politique de confidentialité du site de Florine Clap',
    canonical: canonicalUrl,
  })
}

export default async function PolitiqueConfidentialitePage() {
  // Récupérer la page depuis Directus pour obtenir l'image de bas de page
  let page = null
  try {
    page = await getPageBySlug('politique-confidentialite')
  } catch (error) {
    console.error('Erreur lors de la récupération de la page politique-confidentialite:', error)
  }

  // Récupérer les URLs des images depuis Directus (même logique pour les deux)
  const heroImageUrl = page?.hero_image ? getImageUrl(page.hero_image) : null
  const bottomImageUrl = page?.bottom_image ? getImageUrl(page.bottom_image) : null

  return (
    <main id="main-content" className="min-h-screen bg-theme-white text-black">
      {/* Hero Image - dans le container */}
      {heroImageUrl && (
        <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 pt-16">
          <div className="w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImageUrl}
              alt="Politique de confidentialité"
              className="w-full h-auto object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      )}

      <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black mb-8">Politique de confidentialité</h1>
        
        <div className="prose max-w-none text-base text-black [&_p]:text-justify [&_li]:text-justify">
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Collecte des données</h2>
            <p>
              Le site <strong>florineclap.com</strong> collecte des données personnelles uniquement lorsque vous nous contactez via le formulaire de contact.
              Les données collectées sont : nom, prénom, email et message.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Utilisation des données</h2>
            <p>
              Les données personnelles collectées sont utilisées uniquement pour répondre à vos demandes de contact. 
              Elles ne sont en aucun cas transmises à des tiers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Conservation des données</h2>
            <p>
              Les données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, 
              conformément aux obligations légales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
            </p>
            <ul>
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification de vos données personnelles</li>
              <li>Droit à l'effacement de vos données personnelles</li>
              <li>Droit à la limitation du traitement de vos données</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition au traitement de vos données</li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter via le formulaire de contact disponible sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires au fonctionnement du site. 
              Ces cookies ne nécessitent pas votre consentement préalable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter via le formulaire de contact disponible sur le site.
            </p>
          </section>
        </div>
      </div>

      {/* Bottom Image - en bas de la page (dans le container) */}
      {page?.bottom_image && (() => {
        const bottomImageUrl = getImageUrl(page.bottom_image)
        if (!bottomImageUrl) {
          console.log('⚠️ bottom_image URL est null pour politique-confidentialite:', page.bottom_image)
          return null
        }
        return (
          <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 mt-16 md:mt-24">
            <div className="w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bottomImageUrl}
                alt="Politique de confidentialité"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )
      })()}
    </main>
  )
}



