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
  variant?: 'default' | 'films' | 'ateliers' | 'actus'
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
  variant = 'default',
  category,
  role
}: Props) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'films':
        return {
          container: 'group block overflow-hidden bg-black hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col',
          title: 'text-2xl font-bold text-white',
          subtitle: 'text-base text-theme-yellow/80',
          excerpt: 'mt-2 text-base text-white line-clamp-3',
          meta: 'text-sm text-theme-yellow/60',
          button: 'mt-auto inline-flex items-center px-4 py-2 bg-theme-yellow text-theme-dark text-base font-medium hover:bg-theme-yellow/90 transition-colors w-fit'
        }
      case 'ateliers':
        return {
          container: 'group block overflow-hidden bg-theme-grey hover:shadow-sm h-full flex flex-col',
          title: 'text-base font-semibold text-theme-blue',
          subtitle: 'text-sm text-theme-yellow/80',
          excerpt: 'mt-2 text-sm text-theme-blue line-clamp-2'
        }
      case 'actus':
        return {
          container: 'group block overflow-hidden bg-theme-yellow hover:shadow-sm h-full flex flex-col',
          title: 'text-base font-semibold text-theme-dark',
          subtitle: 'text-sm text-theme-yellow/80',
          excerpt: 'mt-2 text-sm text-theme-dark line-clamp-2'
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

  const imageSrc = cover || placeholderImage

  // Fonction pour générer les badges de statut
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
        <div className="aspect-video relative overflow-hidden">
          <Image 
            src={imageSrc} 
            alt={title} 
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300" 
          />
          <div className="absolute inset-x-0 bottom-0 top-1 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <div className="p-6 flex flex-col gap-4 flex-1 justify-start" style={{ paddingTop: '40%' }}>
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
          
          {/* Métadonnées du film */}
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
          
          {/* Synopsis ou excerpt */}
          {(synopsis || excerpt) && (
            <p className={styles.excerpt}>
              {synopsis || excerpt}
            </p>
          )}
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
      </div>
    </Link>
  )
}
