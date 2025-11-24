'use client'

import Link from 'next/link'
import { IoLogoInstagram, IoLogoVimeo, IoMailOutline, IoLocationOutline } from 'react-icons/io5'
import { Reveal } from '@/components/ui/Reveal'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerContainer'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-black text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-24">
        
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Grande section gauche - Nom + Description */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2} duration={0.8}>
              <div className="mb-8">
                <h3 className="heading-section text-white mb-6">
                  Florine Clap
                </h3>
                
                {/* Ligne décorative */}
                <motion.div 
                  className="h-[2px] bg-white/20 w-32 mb-8 overflow-hidden"
                  initial={{ width: 0 }}
                  whileInView={{ width: '8rem' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                  <div className="h-full bg-white w-full"></div>
                </motion.div>

                <p className="body-text text-white/75 mb-8">
                  Réalisatrice et médiatrice culturelle passionnée, je crée des films qui questionnent notre rapport au monde.
                </p>
              </div>
            </Reveal>

            {/* Réseaux sociaux */}
            <Reveal delay={0.4} duration={0.8}>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/florineclap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-white hover:bg-white/10 transition-all duration-500"
                >
                  <IoLogoInstagram className="text-white/70 group-hover:text-white transition-colors duration-300" size={20} />
                </a>
                <a 
                  href="https://vimeo.com/florineclap" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-white hover:bg-white/10 transition-all duration-500"
                >
                  <IoLogoVimeo className="text-white/70 group-hover:text-white transition-colors duration-300" size={20} />
                </a>
                <a 
                  href="mailto:contact@florineclap.fr" 
                  className="group w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center hover:border-white hover:bg-white/10 transition-all duration-500"
                >
                  <IoMailOutline className="text-white/70 group-hover:text-white transition-colors duration-300" size={20} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* Sections droite - Navigation + Contact */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Navigation */}
            <Reveal delay={0.4} duration={0.8}>
              <div>
                <h4 className="text-white/50 text-sm uppercase tracking-[0.2em] mb-6 font-medium">
                  Navigation
                </h4>
                <StaggerContainer staggerChildren={0.1} delay={0.6} className="flex flex-col space-y-4">
                  {[
                    { label: 'Films', href: '/films' },
                    { label: 'Médiations', href: '/mediations' },
                    { label: 'Vidéos/art', href: '/videos-art' },
                    { label: 'Actualités', href: '/actus' },
                    { label: 'Bio', href: '/bio' }
                  ].map((item) => (
                    <StaggerItem key={item.href}>
                      <Link 
                        href={item.href}
                        className="group inline-flex items-center gap-3 text-white/75 hover:text-white transition-all duration-500 text-lg"
                      >
                        <div className="w-0 h-[2px] bg-white group-hover:w-8 transition-all duration-500"></div>
                        <span className="group-hover:translate-x-2 transition-transform duration-500">
                          {item.label}
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={0.6} duration={0.8}>
              <div>
                <h4 className="text-white/50 text-sm uppercase tracking-[0.2em] mb-6 font-medium">
                  Contact
                </h4>
                <div className="space-y-4 text-white/75">
                  <a 
                    href="mailto:contact@florineclap.fr" 
                    className="group flex items-start gap-3 hover:text-white transition-colors duration-300"
                  >
                    <IoMailOutline size={20} className="mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      contact@florineclap.fr
                    </span>
                  </a>
                  <div className="flex items-start gap-3">
                    <IoLocationOutline size={20} className="mt-0.5 flex-shrink-0" />
                    <span>Avignon, France</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        {/* Bottom bar */}
        <Reveal delay={0.8} duration={0.8} width="100%">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Florine Clap. Tous droits réservés.
            </p>
            
            <div className="flex gap-8 text-sm">
              <Link 
                href="/mentions-legales" 
                className="text-white/50 hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Mentions légales
              </Link>
              <Link 
                href="/politique-confidentialite" 
                className="text-white/50 hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
