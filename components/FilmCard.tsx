import Link from 'next/link'
import Image from 'next/image'
import { Clock, Play, Calendar } from 'lucide-react'

type FilmCardProps = {
  href: string
  title: string
  cover: string
  synopsis?: string
  duree?: string
  annee?: string
  vimeoId?: string
  isHero?: boolean
}

export default function FilmCard({ 
  href, 
  title, 
  cover, 
  synopsis, 
  duree,
  annee,
  vimeoId,
  isHero = false
}: FilmCardProps) {
  if (isHero) {
    return (
      <Link href={href} className="group block">
        <article className="relative overflow-hidden bg-black rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform">
          <div className="aspect-[16/9] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${cover})` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/90 group-hover:via-black/60 group-hover:to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
            ></div>
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end">
              <div className="max-w-xl">
                <div className="flex items-center gap-4 text-white text-sm font-andale-mono mb-2">
                  {duree && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {duree}
                    </span>
                  )}
                  {annee && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {annee}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-andale-mono font-bold text-white mb-3 leading-tight">
                  {title}
                </h3>
                {synopsis && (
                  <p className="text-white/90 text-base mb-3 line-clamp-2 leading-relaxed">
                    {synopsis}
                  </p>
                )}
                <div className="inline-flex items-center text-white font-andale-mono font-medium group-hover:text-white/80 transition-colors">
                  Découvrir le film
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={href} className="group block">
      <article className="relative overflow-hidden bg-black rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform">
        <div className="aspect-video bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${cover})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 group-hover:from-black/80 group-hover:via-black/40 group-hover:to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></div>
          
          {/* Badge de lecture si Vimeo disponible */}
          {vimeoId && (
            <div className="absolute top-3 right-3 bg-white text-black px-2 py-1 rounded-full text-xs font-andale-mono font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-3 h-3" />
              Voir
            </div>
          )}
          
          <div className="relative z-10 p-4 h-full flex flex-col justify-end">
            <div className="flex items-center gap-3 text-white/80 text-xs font-andale-mono mb-2">
              {duree && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {duree}
                </span>
              )}
              {annee && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {annee}
                </span>
              )}
            </div>
            <h3 className="text-sm font-andale-mono font-bold text-white mb-1 leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  )
}
