'use client'

import Link from 'next/link'
import { IoLogoInstagram, IoLogoVimeo, IoMailOutline, IoLocationOutline } from 'react-icons/io5'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return (
    <footer className={`bg-theme-dark text-white ${isHomePage ? 'scroll-section h-screen flex items-center' : 'min-h-[200px]'}`}>
      <div className={`${isHomePage ? 'w-full px-4 md:px-12 lg:px-24 py-12 md:py-24' : 'max-w-6xl mx-auto px-4 md:px-6 py-12'}`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isHomePage ? 'md:gap-16' : ''}`}>
          
          {/* Section A propos */}
          <div className="md:col-span-2">
            <h3 className={`font-andale-mono font-normal tracking-wide mb-4 ${isHomePage ? 'text-xl md:text-3xl' : 'text-lg'}`}>
              A propos
            </h3>
            <p className={`text-white/90 leading-relaxed mb-6 ${isHomePage ? 'text-base md:text-xl' : ''}`}>
              Réalisatrice et formatrice passionnée, je crée des films qui questionnent notre rapport au monde. 
              Spécialisée dans la médiation culturelle, j'anime également des médiations vidéo pour partager ma passion.
            </p>
            <div className={`flex space-x-4 ${isHomePage ? 'md:space-x-6' : ''}`}>
              <a href="https://instagram.com/florineclap" target="_blank" rel="noopener noreferrer" 
                 className="text-white/70 hover:text-white transition-colors">
                <IoLogoInstagram size={isHomePage ? 32 : 24} />
              </a>
              <a href="https://vimeo.com/florineclap" target="_blank" rel="noopener noreferrer" 
                 className="text-white/70 hover:text-white transition-colors">
                <IoLogoVimeo size={isHomePage ? 32 : 24} />
              </a>
              <a href="mailto:contact@florineclap.fr" 
                 className="text-white/70 hover:text-white transition-colors">
                <IoMailOutline size={isHomePage ? 32 : 24} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className={`font-andale-mono font-normal tracking-wide mb-4 ${isHomePage ? 'text-xl md:text-3xl' : 'text-lg'}`}>
              Navigation
            </h3>
            <nav className={`flex flex-col items-start ${isHomePage ? 'space-y-4 md:space-y-6' : 'space-y-3'}`}>
              <Link href="/films" className={`inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isHomePage ? 'text-base md:text-xl' : ''}`}>
                Films
              </Link>
              <Link href="/mediations" className={`inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isHomePage ? 'text-base md:text-xl' : ''}`}>
                Médiations
              </Link>
              <Link href="/actus" className={`inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isHomePage ? 'text-base md:text-xl' : ''}`}>
                Actualités
              </Link>
              <Link href="/bio" className={`inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isHomePage ? 'text-base md:text-xl' : ''}`}>
                Bio
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`font-andale-mono font-normal tracking-wide mb-4 ${isHomePage ? 'text-xl md:text-3xl' : 'text-lg'}`}>
              Contact
            </h3>
            <div className={`text-white/80 ${isHomePage ? 'space-y-4 md:space-y-6' : 'space-y-3'}`}>
              <div className={`flex items-start ${isHomePage ? 'space-x-3 md:space-x-4' : 'space-x-2'}`}>
                <IoMailOutline size={isHomePage ? 20 : 16} className="mt-1 flex-shrink-0" />
                <a href="mailto:contact@florineclap.fr" className={`hover:text-white transition-colors ${isHomePage ? 'text-base md:text-xl' : ''}`}>
                  contact@florineclap.fr
                </a>
              </div>
              <div className={`flex items-start ${isHomePage ? 'space-x-3 md:space-x-4' : 'space-x-2'}`}>
                <IoLocationOutline size={isHomePage ? 20 : 16} className="mt-1 flex-shrink-0" />
                <span className={isHomePage ? 'text-base md:text-xl' : ''}>Avignon, France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separateur */}
        <div className={`border-t border-white/20 ${isHomePage ? 'mt-12 md:mt-16 pt-8 md:pt-12' : 'mt-8 pt-8'}`}>
          <div className={`flex flex-col md:flex-row justify-between items-center ${isHomePage ? 'space-y-4 md:space-y-0' : 'space-y-4 md:space-y-0'}`}>
            <p className={`text-white/60 ${isHomePage ? 'text-sm md:text-lg' : 'text-sm'}`}>
              © {new Date().getFullYear()} Florine Clap. Tous droits réservés.
            </p>
            <div className={`flex space-x-6 ${isHomePage ? 'text-sm md:text-lg' : 'text-sm'}`}>
              <Link href="/mentions-legales" className="inline-block text-white/60 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="inline-block text-white/60 hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}