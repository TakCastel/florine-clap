'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import CtaLink from '@/components/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HomeSettings, getImageUrl } from '@/lib/directus'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface BioSectionProps {
  homeSettings?: HomeSettings | null
}

export default function BioSection({ homeSettings }: BioSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  
  // Utiliser l'URL de l'image : si c'est déjà une URL complète (string), l'utiliser directement
  // Sinon, construire l'URL avec getImageUrl (pour compatibilité)
  const bioImageUrl = homeSettings?.bio_image 
    ? (typeof homeSettings.bio_image === 'string' && homeSettings.bio_image.startsWith('http')
        ? homeSettings.bio_image
        : getImageUrl(homeSettings.bio_image))
    : null

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
    setMousePosition({ x, y })
  }

  // Opacité des paragraphes en fonction du scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isMobile ? ["start 0.7", "center 0.3"] : ["start end", "end start"]
  })

  const paragraph1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 1])
  const paragraph2Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.8, 1], [0, 1, 1, 1])
  const paragraph3Opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.9, 1], [0, 1, 1, 1])
  const paragraph4Opacity = useTransform(scrollYProgress, [0.3, 0.6, 1], [0, 1, 1])

  return (
    <section 
      ref={sectionRef}
      id="bio-section" 
      className="w-full min-h-screen flex items-center justify-center py-12 md:py-20 relative overflow-hidden border-b border-black/5 bg-gradient-to-br from-white to-gray-100/50"
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-container-small mx-auto px-6 md:px-10 lg:px-16 w-full overflow-hidden">
        <div className="relative overflow-hidden">
          {/* Container flex pour image à gauche et contenu à droite */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 items-start">
            
            {/* Image avec effet sophistiqué - positionnée à gauche */}
            <div className="w-full md:w-[38%] lg:w-[35%] relative group flex-shrink-0 overflow-hidden">
              {/* Mobile : simple apparition */}
              {isMobile ? (
                <Reveal direction="left" duration={1} delay={0.2} threshold={0.2} width="100%">
                  <div className="relative overflow-hidden">
                    <motion.div 
                      ref={imageRef}
                      className="relative overflow-hidden"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
                        {bioImageUrl && (
                          <Image 
                            src={bioImageUrl} 
                            alt="Florine Clap - Portrait"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 40vw"
                            className="object-cover"
                            style={{ filter: 'none' }}
                            quality={90}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
                      </div>
                    </motion.div>
                  </div>
                </Reveal>
              ) : (
                /* Desktop : image positionnée normalement */
                <div className="relative overflow-hidden">
                  <motion.div 
                    ref={imageRef}
                    className="relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div 
                      className="relative w-full h-auto aspect-[3/4] max-h-[650px] transition-transform duration-700 ease-out bg-gray-100 overflow-hidden"
                    >
                      {bioImageUrl ? (
                        <Image 
                          src={bioImageUrl} 
                          alt="Florine Clap - Portrait"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 35vw"
                          className="object-cover"
                          style={{ filter: 'none', position: 'absolute' }}
                          priority
                          quality={90}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Image non disponible</span>
                        </div>
                      )}
                      {/* Overlay coloré subtil */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-700 pointer-events-none"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none"></div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Contenu texte avec titre intégré - à droite, prend toute la hauteur */}
            <div className="flex-1 flex flex-col h-full md:h-auto">
              {/* Titre avec animation */}
              <div className="overflow-hidden mb-4 md:mb-6">
                <Reveal delay={0.3} duration={1}>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-black mb-4">
                    Florine Clap
                  </h3>
                  
                  {/* Ligne de séparation animée */}
                  <motion.div 
                    className="h-[1px] bg-black/20 w-full max-w-[200px] overflow-hidden"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  >
                    <div className="h-full bg-black w-full"></div>
                  </motion.div>
                </Reveal>
              </div>
              
              {/* Contenu texte depuis Directus - prend toute la hauteur disponible */}
              <div className="flex-1 flex flex-col">
                {(homeSettings?.bio || homeSettings?.bio_text) && (
                  <motion.div
                    style={{ opacity: paragraph1Opacity }}
                    className="prose max-w-none text-base text-theme-dark [&_p]:text-justify [&_li]:text-justify flex-1"
                  >
                    <MarkdownRenderer content={homeSettings.bio || homeSettings.bio_text || ''} />
                  </motion.div>
                )}
                
                {/* Bouton CTA sophistiqué - aligné à gauche en bas */}
                <div className="mt-auto pt-6 md:pt-8 flex justify-start">
                  <Reveal delay={1.1} duration={0.8}>
                    <CtaLink
                      href="/bio"
                      label="Lire"
                      tone="dark"
                    />
                  </Reveal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de brillance qui suit la souris */}
      <motion.div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          background: `radial-gradient(circle 800px at ${50 + (mousePosition.x / 30) * 100}% ${50 + (mousePosition.y / 30) * 100}%, rgba(0,0,0,0.05) 0%, transparent 70%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.2 }}
      />
    </section>
  )
}
