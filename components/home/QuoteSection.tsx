'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  // Animation basée sur le scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"]
  })

  // Opacité et translation pour l'animation du contenu
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])

  // Effet parallax sur l'image - se déplace plus lentement que le scroll
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.2, 1.4])

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 border-t border-black/5 flex items-center justify-center min-h-[400px] overflow-hidden"
    >
      {/* Image de fond avec effet parallax et backdrop blur */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            y: parallaxY,
            scale: parallaxScale,
            willChange: 'transform',
          }}
        >
          <div className="absolute inset-0 w-full h-full" style={{ minHeight: '120%' }}>
            <Image
              src="/images/background-homepage.png"
              alt="Background homepage"
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
              style={{
                filter: 'blur(12px)',
                objectPosition: 'center center',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </motion.div>

        {/* Overlay sombre avec backdrop blur pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 lg:px-16 w-full flex items-center justify-center">
        <motion.div 
          className="relative mx-auto max-w-3xl text-center space-y-8 w-full"
          style={{
            opacity,
            y,
            scale,
          }}
        >
          <motion.span 
            className="pointer-events-none select-none absolute -top-12 -left-8 text-7xl md:text-8xl lg:text-9xl font-serif text-white/10 leading-none"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
              scale: useTransform(scrollYProgress, [0, 0.5], [0.5, 1]),
            }}
          >
            &ldquo;
          </motion.span>

          <blockquote className="text-white/90 italic text-xl md:text-2xl leading-relaxed font-light">
            Je suis curieuse. Je trouve tout intéressant. La vraie vie, la fausse vie.
            Les objets, les fleurs, les chats. Mais surtout les gens.
          </blockquote>

          <p className="text-white/70 text-sm md:text-base uppercase tracking-[0.3em]">
            Agnès Varda
          </p>

          <motion.span 
            className="pointer-events-none select-none absolute -bottom-12 -right-8 text-7xl md:text-8xl lg:text-9xl font-serif text-white/10 leading-none"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
              scale: useTransform(scrollYProgress, [0, 0.5], [0.5, 1]),
            }}
          >
            &rdquo;
          </motion.span>
        </motion.div>
      </div>
    </section>
  )
}
