import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll'

interface HeroProps {
  onScrollClick: () => void
}

export default function Hero({ onScrollClick }: HeroProps) {
  const { ref, isVisible } = useAnimationOnScroll()

  return (
    <section ref={ref} className="relative max-h-[calc(100vh-88px)] h-[calc(100vh-88px)] z-20 flex items-end justify-center pb-0 mt-[88px] md:mt-0">
      <div className="w-full mx-auto px-4 md:px-6 h-[50vh] relative" style={{ maxWidth: 'calc(72rem - 3rem)' }}>
        {/* Cadre sobre avec double bordure */}
        {/* Bordure extérieure - sans bordure du bas */}
        <div className={`absolute inset-0 border-t-2 border-l-2 border-r-2 border-orange-100 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
        {/* Bordure intérieure - sans bordure du bas, décalée vers le bas */}
        <div className={`absolute top-2 left-2 right-2 bottom-0 border-t-2 border-l-2 border-r-2 border-orange-100 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
        
          {/* Contenu */}
          <div className="relative h-full flex flex-col justify-end items-center text-center px-4 md:px-8 pb-8">
          {/* Bouton de scroll sobre */}
          <button 
            onClick={onScrollClick}
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