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
        <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black mb-8">Mentions légales</h1>
        
        <div className="prose max-w-none text-base text-black [&_p]:text-justify [&_li]:text-justify">
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Éditeur du site</h2>
            <p>
              Le site <strong>florineclap.com</strong> est édité par :
            </p>
            <p>
              <strong>Florine Clap</strong><br />
              Réalisatrice et Artiste
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Conception et développement</h2>
            <p>
              Ce site a été conçu et développé par :
            </p>
            <p>
              <strong>Tarik Talhoui</strong><br />
              <a 
                href="https://tariktalhaoui.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-theme-dark underline hover:text-theme-dark/80 transition-colors"
              >
                tariktalhaoui.fr
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par :
            </p>
            <p>
              <strong>OVH</strong><br />
              SAS au capital de 10 069 020 €<br />
              RCS Lille Métropole 424 761 419 00045<br />
              Code APE 2620Z<br />
              N° TVA : FR 22 424 761 419<br />
              Siège social : 2 rue Kellermann - 59100 Roubaix - France
            </p>
            <p className="mt-4">
              Site web : <a 
                href="https://www.ovh.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-theme-dark underline hover:text-theme-dark/80 transition-colors"
              >
                www.ovh.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse de l'éditeur.
            </p>
            <p>
              Les marques, logos, signes et tout autre contenu du site sont protégés par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Protection des données personnelles</h2>
            <p>
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), 
              vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
            </p>
            <p>
              Vous pouvez également vous opposer au traitement de vos données personnelles et demander la limitation de ce traitement. 
              Vous disposez également d'un droit à la portabilité de vos données.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter via le formulaire de contact disponible sur le site ou par email.
            </p>
            <p>
              Les données collectées sur ce site sont utilisées uniquement dans le cadre de la gestion de votre demande de contact et ne sont en aucun cas transmises à des tiers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Cookies</h2>
            <p>
              Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic du site. 
              Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web.
            </p>
            <p>
              En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies. 
              Vous pouvez à tout moment modifier vos préférences concernant les cookies via les paramètres de votre navigateur.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Liens externes</h2>
            <p>
              Ce site peut contenir des liens vers d'autres sites web. 
              Nous ne sommes pas responsables du contenu ou des pratiques de confidentialité de ces sites externes.
            </p>
            <p>
              L'insertion de liens hypertextes vers ce site est autorisée sous réserve de ne pas utiliser la technique du lien profond 
              ("deep linking"), c'est-à-dire que les pages du site ne doivent pas être imbriquées à l'intérieur des pages d'un autre site, 
              mais accessibles par l'ouverture d'une nouvelle fenêtre.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Responsabilité</h2>
            <p>
              L'éditeur du site s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, 
              dont il se réserve le droit de corriger, à tout moment et sans préavis, le contenu.
            </p>
            <p>
              Toutefois, l'éditeur ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
            </p>
            <p>
              En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. 
              En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

