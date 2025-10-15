'use client'

interface LogoMarqueeProps {
  title?: string
  className?: string
}

function LogoMarquee({ title, className = '' }: LogoMarqueeProps) {
  const logos = [
    { src: '/images/logos/CNC-Logo.svg', alt: 'CNC' },
    { src: '/images/logos/france-tv.png', alt: 'France TV' },
    { src: '/images/logos/la-scam.svg', alt: 'La SCAM' },
    { src: '/images/logos/fondation-louis-vuitton.png', alt: 'Fondation Louis Vuitton' },
    { src: '/images/logos/logo-partenaire.png', alt: 'Partenaire', invert: true, isLarge: true },
    { src: '/images/logos/Utopia_logo.png', alt: 'Utopia', isMedium: true },
  ]

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
          {title}
        </h3>
      )}
      
      <div className="relative overflow-hidden w-full">
        {/* Marquee container */}
        <div className="flex animate-marquee hover:pause w-max">
          {/* Premier set de logos */}
          <div className="flex items-center gap-16 flex-shrink-0 whitespace-nowrap">
            {logos.map((logo, index) => (
              <img
                key={`first-${index}`}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.isLarge ? 'h-20' : logo.isMedium ? 'h-14' : 'h-12'} w-auto object-contain filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 flex-shrink-0 ${logo.invert ? 'invert' : ''}`}
              />
            ))}
            {/* Espace pour simuler le défilement */}
            <div className="w-8 flex-shrink-0"></div>
          </div>
          
          {/* Deuxième set de logos (pour la continuité) */}
          <div className="flex items-center gap-16 flex-shrink-0 whitespace-nowrap">
            {logos.map((logo, index) => (
              <img
                key={`second-${index}`}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.isLarge ? 'h-20' : logo.isMedium ? 'h-14' : 'h-12'} w-auto object-contain filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 flex-shrink-0 ${logo.invert ? 'invert' : ''}`}
              />
            ))}
            {/* Espace pour simuler le défilement */}
            <div className="w-8 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoMarquee
