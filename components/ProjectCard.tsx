import Image from 'next/image'
import Link from 'next/link'
import { Clock, Video } from 'lucide-react'

type Props = {
  href: string
  title: string
  subtitle?: string
  cover?: string
  excerpt?: string
  duree?: string
  statut?: string
  synopsis?: string
  placeholderImage?: string
  vimeoId?: string
  variant?: 'default' | 'films' | 'mediations' | 'actus' | 'actus-featured'
  category?: string
  role?: string
}

export default function ProjectCard({ 
  href, 
  title, 
  subtitle, 
  cover, 
  excerpt, 
  duree,
  statut,
  synopsis,
  placeholderImage,
  vimeoId,
  variant = 'default',
  category,
  role
}: Props) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'films':
        return {
          container: 'group block overflow-hidden bg-theme-films hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col',
          title: 'text-2xl font-bold text-theme-films-text',
          subtitle: 'text-base text-theme-films-text/80',
          excerpt: 'mt-2 text-base text-theme-films-text line-clamp-3',
          meta: 'text-sm text-theme-films-text/60',
          button: 'mt-auto inline-flex items-center px-4 py-2 bg-theme-films-text text-theme-films text-base font-medium hover:bg-theme-films-text/90 transition-colors w-fit'
        }
      case 'mediations':
        return {
          container: 'group block overflow-hidden bg-theme-mediations hover:shadow-sm h-full flex flex-col',
          title: 'text-base font-semibold text-theme-mediations-text',
          subtitle: 'text-sm text-theme-mediations-text/80',
          excerpt: 'mt-2 text-sm text-theme-mediations-text line-clamp-2'
        }
      case 'actus':
        return {
          container: 'group block overflow-hidden bg-theme-actus/90 hover:bg-theme-actus transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-xl',
          title: 'text-xl font-bold text-theme-actus-text group-hover:text-theme-actus-text transition-colors',
          subtitle: 'text-sm text-theme-actus-text/70 font-medium',
          excerpt: 'mt-3 text-theme-actus-text/80 line-clamp-3 leading-relaxed',
          button: 'mt-4 inline-flex items-center text-theme-actus-text font-medium hover:text-theme-actus-text/70 transition-colors relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-actus-text after:transition-all after:duration-300 group-hover:after:w-full'
        }
      case 'actus-featured':
        return {
          container: 'group relative block overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-300 h-96 shadow-lg hover:shadow-xl',
          title: 'absolute bottom-0 left-0 right-0 p-6 text-white font-bold text-2xl md:text-3xl bg-gradient-to-t from-theme-dark/90 via-theme-dark/60 to-transparent',
          subtitle: 'absolute bottom-0 left-0 right-0 p-6 pb-16 text-white/90 text-sm font-medium',
          excerpt: 'absolute bottom-0 left-0 right-0 p-6 pb-20 text-white/80 text-base leading-relaxed line-clamp-2',
          button: 'absolute bottom-6 left-6 inline-flex items-center text-white font-medium hover:text-white/80 transition-colors relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full'
        }
      default:
        return {
          container: 'group block overflow-hidden border hover:shadow-sm',
          title: 'text-base font-semibold',
          subtitle: 'text-sm text-gray-500',
          excerpt: 'mt-2 text-sm text-gray-600 line-clamp-2'
        }
    }
  }

  const styles = getVariantStyles()

  // Utiliser l'image fournie, sinon la miniature Vimeo, sinon l'image placeholder
  const imageSrc = cover || (vimeoId ? `https://vumbnail.com/${vimeoId}.jpg` : placeholderImage)

  // Fonction pour generer les badges de statut
  const getStatusBadges = () => {
    const badges = []
    
    if (category === "Films d'atelier") {
      badges.push({
        text: "Film d'atelier",
        className: "bg-blue-600 text-white px-2 py-1 text-xs font-medium"
      })
    }
    
    if (role === "Monteuse") {
      badges.push({
        text: "Monteuse",
        className: "bg-purple-600 text-white px-2 py-1 text-xs font-medium"
      })
    }
    
    return badges
  }

  return (
    <Link href={href} className={styles.container}>
      {imageSrc && (
        <div className="relative overflow-hidden" style={{ aspectRatio: '594/458' }}>
          <Image 
            src={imageSrc} 
            alt={title} 
            fill
            className={`object-cover ${
              variant === 'films' ? 'filter-[sepia(20%)_saturate(150%)_hue-rotate(340deg)_brightness(0.9)]' :
              variant === 'mediations' ? 'filter-[sepia(10%)_saturate(120%)_hue-rotate(200deg)_brightness(0.7)]' :
              variant === 'actus' ? 'filter-[sepia(30%)_saturate(180%)_hue-rotate(15deg)_brightness(0.95)]' :
              ''
            }`}
          />
        </div>
      )}
      
      <div className="p-6 flex flex-col gap-4 flex-1 justify-start">
        <div className="flex-grow">
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          
          {/* Badges de statut */}
          {variant === 'films' && (
            <div className="flex flex-wrap gap-2 mt-2">
              {getStatusBadges().map((badge, index) => (
                <span key={index} className={badge.className}>
                  {badge.text}
                </span>
              ))}
            </div>
          )}
          
          {/* Metadonnees du film */}
          <div className="flex flex-wrap gap-3 mt-2">
            {duree && (
              <span className={`${styles.meta} flex items-center gap-1`}>
                <Clock className="w-3 h-3" />
                {duree}
              </span>
            )}
            {statut && (
              <span className={`${styles.meta} flex items-center gap-1`}>
                <Video className="w-3 h-3" />
                {statut}
              </span>
            )}
          </div>
          
          {/* Excerpt supprimé pour éviter les points parasites */}
        </div>
        
        {/* Bouton "Voir plus" pour les films - toujours en bas */}
        {variant === 'films' && (
          <div className={`${styles.button} mt-8`}>
            Voir plus
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
        
        {/* Bouton "Lire plus" pour les actualités */}
        {variant === 'actus' && (
          <div className="mt-auto pt-4">
            <span className={styles.button}>
              Lire plus →
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}