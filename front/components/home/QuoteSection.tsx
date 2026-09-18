'use client'

import { Reveal } from '@/components/ui/Reveal'

export default function QuoteSection() {
  return (
    <section className="relative py-12 md:py-20 border-b border-black/5 flex items-center justify-center min-h-[300px] bg-gradient-to-br from-white to-gray-100/50">
      <div className="relative z-10 max-w-container-small mx-auto px-6 md:px-10 lg:px-16 w-full flex items-center justify-center">
        <Reveal width="100%" duration={0.8}>
          <div className="relative mx-auto max-w-container-small text-center space-y-6 w-full">
            <span className="pointer-events-none select-none absolute -top-8 left-0 md:-top-12 md:-left-8 text-6xl md:text-5xl lg:text-5xl font-serif text-black/10 leading-none">
              &ldquo;
            </span>

            <blockquote className="text-black/80 italic text-lg leading-relaxed font-light">
              Je suis curieuse. Je trouve tout intéressant. La vraie vie, la fausse vie.
              Les objets, les fleurs, les chats. Mais surtout les gens.
            </blockquote>

            <p className="text-black/60 text-xs uppercase tracking-[0.3em]">
              Agnès Varda
            </p>

            <span className="pointer-events-none select-none absolute -bottom-8 right-0 md:-bottom-12 md:-right-8 text-6xl md:text-5xl lg:text-5xl font-serif text-black/10 leading-none">
              &rdquo;
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
