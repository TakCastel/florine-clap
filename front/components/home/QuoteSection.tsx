'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

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

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 border-b border-black/5 flex items-center justify-center min-h-[400px] section-gradient"
      style={{ position: 'relative' }}
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 lg:px-16 w-full flex items-center justify-center">
        <motion.div 
          className="relative mx-auto max-w-3xl text-center space-y-8 w-full"
          style={{
            opacity,
            y,
          }}
        >
          <motion.span 
            className="pointer-events-none select-none absolute -top-8 left-0 md:-top-12 md:-left-8 text-7xl md:text-8xl lg:text-9xl font-serif text-black/10 leading-none"
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
              scale: useTransform(scrollYProgress, [0, 0.5], [0.5, 1]),
            }}
          >
            &ldquo;
          </motion.span>

          <blockquote className="text-black/80 italic text-xl md:text-2xl leading-relaxed font-light">
            Je suis curieuse. Je trouve tout intéressant. La vraie vie, la fausse vie.
            Les objets, les fleurs, les chats. Mais surtout les gens.
          </blockquote>

          <p className="text-black/60 text-sm md:text-base uppercase tracking-[0.3em]">
            Agnès Varda
          </p>

          <motion.span 
            className="pointer-events-none select-none absolute -bottom-8 right-0 md:-bottom-12 md:-right-8 text-7xl md:text-8xl lg:text-9xl font-serif text-black/10 leading-none"
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
