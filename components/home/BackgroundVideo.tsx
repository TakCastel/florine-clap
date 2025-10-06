'use client'

interface BackgroundVideoProps {
  src: string
  alt?: string
}

export default function BackgroundVideo({ src, alt = "Vidéo de fond" }: BackgroundVideoProps) {
  return (
    <div 
      className="fixed inset-0 z-10"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
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
