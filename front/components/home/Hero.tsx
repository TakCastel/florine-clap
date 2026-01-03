import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'

interface HeroProps {
  onScrollClick: () => void
}

export default function Hero({ onScrollClick }: HeroProps) {
  const { ref, isVisible } = useAnimationOnScroll()

  return (
    <section ref={ref} className="relative h-screen w-full z-20 flex items-end justify-center pb-8">
      <div className="w-full mx-auto px-4 md:px-6 h-full relative flex items-end justify-center" style={{ maxWidth: 'calc(72rem - 3rem)' }}>
        {/* Contenu */}
        <div className="relative h-full flex flex-col justify-end items-center text-center px-4 md:px-8 pb-8">
          {/* Bouton de scroll sobre */}
          <button 
            onClick={() => {
              // Scroll vers la section suivante
              const nextSection = document.querySelector('section:nth-child(2)')
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className={`w-12 h-12 cursor-pointer mx-auto bg-orange-100 border-2 border-orange-100 flex items-center justify-center group hover:bg-orange-200 transition-all duration-500 ease-out delay-500 relative z-50 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <svg className="w-5 h-5 text-black group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}