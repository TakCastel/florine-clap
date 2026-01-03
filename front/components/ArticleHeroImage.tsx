import { getImageUrl } from '@/lib/directus'

interface ArticleHeroImageProps {
  imageUrl: string | null
  alt: string
  className?: string
}

/**
 * Composant réutilisable pour l'image hero des articles
 * Même hauteur que dans la bio (45vh, min 300px)
 * Positionné par-dessus le header avec dégradés
 */
export default function ArticleHeroImage({ 
  imageUrl, 
  alt, 
  className = '' 
}: ArticleHeroImageProps) {
  return (
    <section 
      className={`article-hero-image relative w-full h-[45vh] min-h-[300px] overflow-visible ${className}`} 
      style={{ 
        marginTop: 0, 
        zIndex: 1, 
        borderBottom: 'none', 
        borderWidth: 0,
        border: 'none',
        outline: 'none'
      }}
    >
      {imageUrl ? (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Dégradé noir en haut pour le header */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none"></div>
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
          ></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-black/5">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-black/30">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm uppercase tracking-[0.2em]">Image non disponible</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

