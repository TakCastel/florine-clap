interface HeroProps {
  title: string
  description: string
  onScrollClick: () => void
}

export default function Hero({ title, description, onScrollClick }: HeroProps) {
  return (
    <section className="relative min-h-screen z-10 flex items-end justify-center pb-0">
      <div className="w-[90vw] md:w-[50vw] mx-4 md:mx-0 h-[50vh] relative">
        {/* Cadre sobre avec double bordure */}
        {/* Bordure extérieure - sans bordure du bas */}
        <div className="absolute inset-0 border-t-4 border-l-4 border-r-4 border-white"></div>
        {/* Bordure intérieure - sans bordure du bas, décalée vers le bas */}
        <div className="absolute top-4 left-4 right-4 bottom-0 border-t-4 border-l-4 border-r-4 border-white"></div>
        
        {/* Contenu */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-8">
          <h1 className="text-4xl md:text-6xl font-oswald font-light mb-4 tracking-wide text-white">
            {title}
          </h1>
          <p className="text-base md:text-lg font-oswald font-light leading-relaxed text-white mb-8 max-w-md mx-auto">
            {description}
          </p>
          
          {/* Bouton de scroll sobre */}
          <button 
            onClick={onScrollClick}
            className="w-10 h-10 cursor-pointer mx-auto bg-white border border-white flex items-center justify-center group hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-black group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}