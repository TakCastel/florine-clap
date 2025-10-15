'use client'

import Link from 'next/link'
import { IoLogoInstagram, IoLogoVimeo, IoMailOutline, IoLocationOutline } from 'react-icons/io5'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const LogoMarquee = dynamic(() => import('./LogoMarquee'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
})

export default function Footer() {
  // Footer sombre pour toutes les pages
  return (
    <footer className="bg-theme-dark text-white min-h-[200px]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Section Florine Clap */}
          <div className="md:col-span-2">
            <h3 className="font-display font-normal tracking-wide mb-4 text-lg">
              Florine Clap
            </h3>
            <p className="text-white/90 leading-relaxed mb-6">
              Réalisatrice et formatrice passionnée, je crée des films qui questionnent notre rapport au monde. 
              Spécialisée dans la médiation culturelle, j'anime également des médiations vidéo pour partager ma passion.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/florineclap" target="_blank" rel="noopener noreferrer" 
                 className="text-white/70 hover:text-white transition-colors">
                <IoLogoInstagram size={24} />
              </a>
              <a href="https://vimeo.com/florineclap" target="_blank" rel="noopener noreferrer" 
                 className="text-white/70 hover:text-white transition-colors">
                <IoLogoVimeo size={24} />
              </a>
              <a href="mailto:contact@florineclap.fr" 
                 className="text-white/70 hover:text-white transition-colors">
                <IoMailOutline size={24} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display font-normal tracking-wide mb-4 text-lg">
              Navigation
            </h3>
            <nav className="flex flex-col items-start space-y-3">
              <Link href="/films" className="inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Films
              </Link>
              <Link href="/mediations" className="inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Médiations
              </Link>
              <Link href="/actus" className="inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Actualités
              </Link>
              <Link href="/bio" className="inline-block text-white/80 hover:text-white transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                Bio
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-normal tracking-wide mb-4 text-lg">
              Contact
            </h3>
            <div className="text-white/80 space-y-3">
              <div className="flex items-start space-x-2">
                <IoMailOutline size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:contact@florineclap.fr" className="hover:text-white transition-colors">
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

        {/* Separateur */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Florine Clap. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-sm">
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