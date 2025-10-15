'use client'

export default function HeroSection() {
  return (
    <section id="hero-section" className="w-full relative">
      {/* Vidéo */}
      <div className="relative h-screen">
        <video
          src="/videos/example.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
        
        {/* Bouton de navigation en bas */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={() => {
              const categoriesSection = document.getElementById('categories-section')
              if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }}
            className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 text-lg group"
          >
            Découvrir mon travail
            <svg 
              className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
