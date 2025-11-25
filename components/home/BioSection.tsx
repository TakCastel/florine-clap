'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { bioPhoto } from '@/lib/images'
import CtaLink from '@/components/CtaLink'
import { Reveal } from '@/components/ui/Reveal'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function BioSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
    setMousePosition({ x, y })
  }

  // Animation basée sur le scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Translation et rotation de la photo en fonction du scroll
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const imageX = useTransform(scrollYProgress, [0, 1], [-150, 0])
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-5, 5])

  // Opacité des paragraphes en fonction du scroll
  const paragraph1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const paragraph2Opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.8, 1], [0, 1, 1, 0])
  const paragraph3Opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.9, 1], [0, 1, 1, 0])
  const paragraph4Opacity = useTransform(scrollYProgress, [0.3, 0.6, 1], [0, 1, 0])

  return (
    <section 
      ref={sectionRef}
      id="bio-section" 
      className="w-full min-h-screen bg-theme-cream flex items-center justify-center py-24 md:py-32 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
        <div className="relative">
          
          {/* Image avec effet sophistiqué - positionnée en haut à gauche */}
          <div className="w-full md:w-2/5 lg:w-2/5 xl:w-2/5 relative group float-left mr-8 md:mr-12 mb-6 md:mb-8">
            <Reveal direction="left" duration={1} delay={0.2} threshold={0.2} width="100%">
              {/* Image principale */}
              <div className="relative overflow-visible">
                <motion.div 
                  ref={imageRef}
                  className="relative overflow-hidden transition-transform duration-700 ease-out rounded-3xl md:rounded-[2rem]"
                  style={{
                    y: imageY,
                    x: imageX,
                    rotate: imageRotate,
                  }}
                >
                  <div 
                    className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] transition-transform duration-700 ease-out"
                    style={{
                      transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
                    }}
                  >
                    <Image 
                      src={bioPhoto} 
                      alt="Florine Clap - Portrait"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 40vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ filter: 'none' }}
                    />
                    {/* Overlay coloré subtil */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
          
          {/* Contenu texte avec titre intégré - le texte coule autour de l'image */}
          <div className="relative">
            {/* Titre avec animation - à côté de l'image */}
            <div className="overflow-hidden mb-8">
              <Reveal delay={0.3} duration={1}>
                <h3 className="heading-section text-black mb-4">
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
            
            {/* Premiers paragraphes à côté de l'image */}
            <div className="space-y-5 text-black/85 text-sm md:text-base leading-relaxed [&_p]:text-justify">
              {/* Membres d'associations */}
              <Reveal delay={0.5} duration={0.8} className="mb-5 pb-5 border-b border-black/10 inline-block">
                <p className="text-xs md:text-sm text-black/70 uppercase tracking-wider font-medium">
                  Membre de l'AARSE - Membre d'Addoc
                </p>
              </Reveal>

              {/* Introduction */}
              <motion.div
                style={{ opacity: paragraph1Opacity }}
              >
                <p className="body-text text-black/85">
                  Née à <span className="text-black font-medium">Avignon en 1988</span>, Florine Clap se passionne dès son enfance pour le théâtre et le cinéma. Se construisant depuis toujours dans une approche transversale des arts, elle accompagne de nombreux artistes plasticiens, chorégraphes, auteur·ices, architectes ou institutions culturelles avec son regard et sa caméra.
                </p>
              </motion.div>
              
              {/* Parcours cinématographique - premier paragraphe */}
              <motion.div
                style={{ opacity: paragraph2Opacity }}
              >
                <p className="body-text text-black/85">
                  Depuis 2013, elle réalise des films documentaires abordant des thématiques artistiques et sociales. Son premier long métrage documentaire, <span className="text-black font-medium italic">Sous le pont d'Avignon</span>, produit par les productions Image Mouvement & Avril Films, a été diffusé par le cinéma d'art et d'essai avignonnais Utopia en 2014. En parallèle, elle travaille deux ans, entre 2012 et 2014, comme assistante de la coach d'acteurs Tiffany Stern au studio l'Actors Factory. Elle tourne son deuxième film documentaire sur le studio et la direction d'acteurs de Tiffany Stern intitulé <span className="text-black font-medium italic">PLAY</span>, produit par Avril Films.
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Paragraphes suivants qui passent en dessous de l'image */}
          <div className="clear-both space-y-5 text-black/85 text-sm md:text-base leading-relaxed mt-8 [&_p]:text-justify">
            <motion.div
              style={{ opacity: paragraph3Opacity }}
            >
              <p className="body-text text-black/85">
                En 2015, elle réalise <span className="text-black font-medium italic">Violoncelles, vibrez !</span> produit par la Fondation Louis Vuitton & Caméra Lucida, diffusé en février 2016 par France 2 & Culture Box. En 2022, elle tourne un documentaire-fiction sur le Festival d'Avignon, <span className="text-black font-medium italic">Père Chave, ma vie au Festival d'Avignon</span>, produit par le CFRT, Jour du Seigneur et diffusé sur France 2 ainsi qu'aux territoires cinématographiques du Festival d'Avignon (en juillet 2022).
              </p>
            </motion.div>
            
            <motion.div
              style={{ opacity: paragraph4Opacity }}
            >
              <p className="body-text text-black/85">
                Parallèlement, la réalisatrice signe des formes documentaires courtes destinées à une diffusion en festivals, comme <span className="text-black font-medium italic">Quand je vous caresse</span> (2021), le portrait d'une aide-soignante, <span className="text-black font-medium italic">Objets Trouvés</span> (2024), le portrait cinématographique d'une tapissière en siège, tous deux produits par Vert de Nuit et diffusés en festivals. Actuellement, Florine Clap est en cours d'écriture d'un film documentaire réalisant le portrait de trois enfants polyhandicapés de l'EEAP Petit Jardin, portant sur leur rapport à leur corps et à la danse ainsi qu'un documentaire sur le procès des viols de Mazan, raconté depuis la rue, depuis son quartier.
              </p>
            </motion.div>
            
            {/* Médiations */}
            <motion.div
              style={{ opacity: paragraph4Opacity }}
            >
              <p className="body-text text-black/85">
                Par ailleurs, la réalisatrice anime des médiations cinématographiques pour le cinéma d'art et d'essai, Utopia d'Avignon, le Conservatoire à rayonnement régional du grand Avignon (2014 et 2020), CANOPÉ (réseau d'éducation à l'image), l'Institut de l'image d'Aix en Provence (pôle régional artistique et de formation au cinéma et à l'audiovisuel), l'Institut des métiers et de la communication audiovisuelle de Provence. La réalisatrice s'investit également dans des projets de médiations vidéo militantes et sociales avec l'association <span className="text-black font-medium">1,2,3 Soleil</span>, « pour un cinéma solidaire et inclusif » qui organise des tournages avec des publics fragilisés tels que des mineurs isolés sans papiers ou des résidents en EHPAD ou en IME.
              </p>
            </motion.div>
            
            {/* Bouton CTA sophistiqué */}
            <Reveal delay={1.1} duration={0.8} className="mt-16 md:mt-20">
              <CtaLink
                href="/bio"
                label="En savoir plus"
                tone="dark"
              />
            </Reveal>
            
          </div>
          
          {/* Clear float pour forcer le contenu suivant à passer en dessous */}
          <div className="clear-both"></div>
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
