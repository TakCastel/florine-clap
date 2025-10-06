import Link from 'next/link'
import { IoLogoInstagram, IoLogoVimeo, IoMailOutline, IoLocationOutline } from 'react-icons/io5'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-stone-100 min-h-[200px]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Section À propos */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-montserrat font-normal tracking-wide mb-4">
              À propos
            </h3>
            <p className="text-stone-200 leading-relaxed mb-6">
              Réalisatrice et formatrice passionnée, je crée des films qui questionnent notre rapport au monde. 
              Spécialisée dans la médiation culturelle, j'anime également des ateliers vidéo pour partager ma passion.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/florineclap" target="_blank" rel="noopener noreferrer" 
                 className="text-stone-300 hover:text-stone-100 transition-colors">
                <IoLogoInstagram size={24} />
              </a>
              <a href="https://vimeo.com/florineclap" target="_blank" rel="noopener noreferrer" 
                 className="text-stone-300 hover:text-stone-100 transition-colors">
                <IoLogoVimeo size={24} />
              </a>
              <a href="mailto:contact@florineclap.fr" 
                 className="text-stone-300 hover:text-stone-100 transition-colors">
                <IoMailOutline size={24} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-montserrat font-normal tracking-wide mb-4">
              Navigation
            </h3>
            <nav className="flex flex-col items-start space-y-3">
              <Link href="/films" className="inline-block text-stone-200 hover:text-stone-100 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-stone-100 after:transition-all after:duration-300 hover:after:w-full">
                Films
              </Link>
              <Link href="/ateliers" className="inline-block text-stone-200 hover:text-stone-100 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-stone-100 after:transition-all after:duration-300 hover:after:w-full">
                Médiations
              </Link>
              <Link href="/actus" className="inline-block text-stone-200 hover:text-stone-100 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-stone-100 after:transition-all after:duration-300 hover:after:w-full">
                Actualités
              </Link>
              <Link href="/bio" className="inline-block text-stone-200 hover:text-stone-100 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-stone-100 after:transition-all after:duration-300 hover:after:w-full">
                Bio
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-montserrat font-normal tracking-wide mb-4">
              Contact
            </h3>
            <div className="space-y-3 text-stone-200">
              <div className="flex items-start space-x-2">
                <IoMailOutline size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:contact@florineclap.fr" className="hover:text-stone-100 transition-colors">
                  contact@florineclap.fr
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <IoLocationOutline size={16} className="mt-1 flex-shrink-0" />
                <span>Avignon, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-stone-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-stone-300 text-sm">
              © {new Date().getFullYear()} Florine Clap. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/mentions-legales" className="inline-block text-stone-300 hover:text-stone-100 transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="inline-block text-stone-300 hover:text-stone-100 transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


