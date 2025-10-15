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
  variant?: 'default' | 'films' | 'mediations' | 'actus'
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
          container: 'group block overflow-hidden bg-black hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col',
          title: 'text-2xl font-bold text-white',
          subtitle: 'text-base text-theme-yellow/80',
          excerpt: 'mt-2 text-base text-white line-clamp-3',
          meta: 'text-sm text-theme-yellow/60',
          button: 'mt-auto inline-flex items-center px-4 py-2 bg-theme-yellow text-theme-dark text-base font-medium hover:bg-theme-yellow/90 transition-colors w-fit'
        }
      case 'mediations':
        return {
          container: 'group block overflow-hidden bg-theme-grey hover:shadow-sm h-full flex flex-col',
          title: 'text-base font-semibold text-theme-blue',
          subtitle: 'text-sm text-theme-yellow/80',
          excerpt: 'mt-2 text-sm text-theme-blue line-clamp-2'
        }
      case 'actus':
        return {
          container: 'group block overflow-hidden bg-theme-yellow border border-theme-yellow hover:border-theme-dark/20 transition-all duration-300 h-full flex flex-col',
          title: 'text-xl font-bold text-theme-dark group-hover:text-theme-dark transition-colors',
          subtitle: 'text-sm text-theme-dark/70 font-medium',
          excerpt: 'mt-3 text-theme-dark/80 line-clamp-3 leading-relaxed',
          button: 'mt-4 inline-flex items-center text-theme-dark font-medium hover:text-theme-dark/70 transition-colors relative after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-theme-dark after:transition-all after:duration-300 group-hover:after:w-full'
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
            className="object-cover" 
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
          
          {/* Synopsis ou excerpt */}
          {(synopsis || excerpt) && (synopsis || excerpt)?.trim() !== '.' && (
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