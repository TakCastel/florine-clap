'use client'

export default function QuoteSection() {
  return (
    <section className="relative bg-theme-cream py-24 md:py-32 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="relative mx-auto max-w-3xl text-center space-y-8">
          <span className="pointer-events-none select-none absolute -top-12 -left-8 text-7xl md:text-8xl lg:text-9xl font-serif text-black/10 leading-none">
            &ldquo;
          </span>

          <blockquote className="text-black/80 italic text-xl md:text-2xl leading-relaxed font-light">
            Je suis curieuse. Je trouve tout intéressant. La vraie vie, la fausse vie.
            Les objets, les fleurs, les chats. Mais surtout les gens.
          </blockquote>

          <p className="text-black/60 text-sm md:text-base uppercase tracking-[0.3em]">
            Agnès Varda
          </p>

          <span className="pointer-events-none select-none absolute -bottom-12 -right-8 text-7xl md:text-8xl lg:text-9xl font-serif text-black/10 leading-none">
            &rdquo;
          </span>
        </div>
      </div>
    </section>
  )
}

