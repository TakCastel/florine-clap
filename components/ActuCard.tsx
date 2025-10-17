import Link from 'next/link'

type ActuCardProps = {
  href: string
  title: string
  cover?: string
  excerpt?: string
  date: string
}

export default function ActuCard({ 
  href, 
  title, 
  cover, 
  excerpt, 
  date 
}: ActuCardProps) {
  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl">
        <div className="aspect-[3/2] relative overflow-hidden">
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-110" 
            style={{ 
              backgroundImage: cover ? `url(${cover})` : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
            }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/80 via-theme-dark/30 to-transparent"></div>
          <div className="absolute inset-0 bg-theme-dark/0 group-hover:bg-theme-dark/30 transition-all duration-500"></div>
          
          {/* Ligne décorative en haut */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-theme-yellow/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Contenu */}
          <div className="relative z-10 p-5 h-full flex flex-col justify-end">
            {/* Date */}
            <div className="flex items-center gap-2 text-theme-yellow text-xs mb-2.5 bg-theme-yellow/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit border border-theme-yellow/20 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {new Date(date).toLocaleDateString('fr-FR')}
            </div>

            {/* Titre */}
            <h3 
              className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2 mb-3 transition-colors duration-300" 
              style={{
                fontFamily: 'var(--font-andalemo), sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h3>

            {/* Ligne décorative qui s'étend au hover */}
            <div className="h-[2px] bg-white/20 overflow-hidden rounded-full">
              <div className="h-full bg-theme-yellow w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
