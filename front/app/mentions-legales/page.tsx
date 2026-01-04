import { buildMetadata } from '@/components/Seo'
import { canonical } from '@/lib/seo'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalider toutes les heures

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = canonical('/mentions-legales')
  return buildMetadata({
    title: 'Mentions légales',
    description: 'Mentions légales du site de Florine Clap',
    canonical: canonicalUrl,
  })
}

export default function MentionsLegalesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-theme-white text-black">
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <h1 className="heading-page text-black mb-8">Mentions légales</h1>
        
        <div className="prose prose-lg max-w-none text-black [&_p]:text-justify [&_li]:text-justify">
          <section className="mb-8">
            <h2 className="heading-section text-black mb-4">Éditeur du site</h2>
            <p>
              Le site <strong>florineclap.com</strong> est édité par :
            </p>
            <p>
              <strong>Florine Clap</strong><br />
              Réalisatrice et Artiste
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-section text-black mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par Netlify.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-section text-black mb-4">Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-section text-black mb-4">Protection des données personnelles</h2>
            <p>
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), 
              vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
            </p>
            <p>
              Pour exercer ce droit, vous pouvez nous contacter via le formulaire de contact disponible sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="heading-section text-black mb-4">Cookies</h2>
            <p>
              Ce site utilise des cookies pour améliorer l'expérience utilisateur. 
              En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

