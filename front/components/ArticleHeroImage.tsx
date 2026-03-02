import { getImageUrl } from '@/lib/directus'
import Image from 'next/image'

interface ArticleHeroImageProps {
  imageUrl: string | null
  alt: string
  className?: string
}

/**
 * Composant réutilisable pour l'image hero des articles
 * Image abstraite, floue et discrète en arrière-plan
 * Effet de focale avec disparition progressive
 */
export default function ArticleHeroImage({ 
  imageUrl, 
  alt, 
  className = '' 
}: ArticleHeroImageProps) {
  return (
    <section 
      className={`relative w-full h-[66vh] overflow-hidden border-0 ${className}`} 
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
          {/* Image de fond sur 100% de largeur */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ 
                objectPosition: 'center 30%',
                filter: 'blur(15px) brightness(1.15) grayscale(0.3)',
                transform: 'scale(1.1)',
              }}
              priority={false}
              quality={85}
            />
          </div>
          
          {/* Effet de focale radial (flou plus intense sur les bords) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.4) 100%)',
              mixBlendMode: 'overlay',
            }}
            aria-hidden="true"
          />
          
          {/* Overlay blanc léger pour rendre l'image plus claire et discrète */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.8) 100%)'
            }}
            aria-hidden="true"
          />
          
          {/* Dégradé blanc à transparent de bas vers le haut pour la lisibilité du contenu */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0) 60%)'
            }}
            aria-hidden="true"
          />
          
          {/* Halo blanc très léger pour améliorer la lisibilité des textes noirs */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: 'rgba(255, 255, 255, 0.28)'
            }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-white/10" aria-label="Image non disponible">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-black/20">
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

