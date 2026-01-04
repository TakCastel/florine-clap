'use client'

import { useEffect, useRef } from 'react'

interface VimeoPlayerProps {
  videoId: string
  className?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  width?: string | number
  height?: string | number
  title?: string
}

export default function VimeoPlayer({
  videoId,
  className = '',
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
  width = '100%',
  height = '100%',
  title
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    // Configuration des paramètres Vimeo pour un player léger
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      muted: muted ? '1' : '0',
      loop: loop ? '1' : '0',
      controls: controls ? '1' : '0',
      background: '0',
      byline: '0',
      title: '0',
      portrait: '0',
      responsive: '1',
      dnt: '1', // Do Not Track
      quality: 'auto', // Qualité automatique
      speed: '1', // Vitesse normale
      keyboard: '0', // Pas de contrôles clavier
      pip: '0', // Pas de picture-in-picture
      transparent: '0',
      playsinline: '1' // Lecture en ligne sur mobile
    })

    const src = `https://player.vimeo.com/video/${videoId}?${params.toString()}`
    
    if (iframeRef.current.src !== src) {
      iframeRef.current.src = src
    }
  }, [videoId, autoplay, muted, loop, controls])

  return (
    <div className={`relative w-full ${className}`} style={{ width, height }}>
      <iframe
        ref={iframeRef}
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || `Vimeo video ${videoId}`}
        aria-label={title || `Vidéo Vimeo ${videoId}`}
      />
    </div>
  )
}
