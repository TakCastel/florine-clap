'use client'

interface BackgroundVideoProps {
  src: string
  alt?: string
  isFixed?: boolean
}

export default function BackgroundVideo({ src, alt = "Vidéo de fond", isFixed = true }: BackgroundVideoProps) {
  return (
    <div 
      className={isFixed ? "fixed inset-0 z-10" : "absolute inset-0 z-10"}
      style={isFixed ? {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      } : {
        width: '100%',
        height: '100%'
      }}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  )
}
