import { getImageUrl } from '@/lib/directus'
import Image from 'next/image'

interface ArticleHeroImageProps {
  imageUrl: string | null
  alt: string
  className?: string
}

/**
 * Composant réutilisable pour l'image hero des articles
 * Hauteur réduite pour un meilleur rendu
 * Positionné par-dessus le header avec dégradés
 */
export default function ArticleHeroImage({ 
  imageUrl, 
  alt, 
  className = '' 
}: ArticleHeroImageProps) {
  return (
    <section 
      className={`relative w-full h-[25vh] min-h-[180px] overflow-visible border-0 ${className}`} 
      style={{ 
        marginTop: 0, 
        zIndex: 1, 
        borderBottom: 'none', 
        borderWidth: 0,
        border: 'none',
        outline: 'none'
      }}
      aria-label={alt}
    >
      {imageUrl ? (
        <>
          <div className="absolute inset-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {/* Dégradé noir en haut pour le header - plus sombre */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none" aria-hidden="true"></div>
          {/* Dégradé blanc en bas pour se fondre dans la page - commence à -1px pour éviter la bordure */}
          <div 
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: '-1px',
              background: 'linear-gradient(to top, rgb(255 255 255) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.4) 60%, transparent 100%)'
            }}
            aria-hidden="true"
          ></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-black/5" aria-label="Image non disponible">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-black/30">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs uppercase tracking-[0.2em]">Image non disponible</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

