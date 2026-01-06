'use client'

import { useEffect, useRef, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!iframeRef.current) return

    setIsLoading(true)
    setHasError(false)

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

    let timeoutId: NodeJS.Timeout | null = null

    // Écouter le chargement de l'iframe
    const handleLoad = () => {
      setIsLoading(false)
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }

    // Timeout pour détecter si la vidéo ne charge pas
    timeoutId = setTimeout(() => {
      setIsLoading((current) => {
        if (current) {
          setHasError(true)
          return false
        }
        return current
      })
      timeoutId = null
    }, 10000) // 10 secondes

    iframeRef.current.addEventListener('load', handleLoad)
    iframeRef.current.addEventListener('error', handleError)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleLoad)
        iframeRef.current.removeEventListener('error', handleError)
      }
    }
  }, [videoId, autoplay, muted, loop, controls])

  return (
    <div className={`relative w-full ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs">Chargement de la vidéo...</p>
          </div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-xs mb-2">Erreur de chargement de la vidéo</p>
            <button
              onClick={() => {
                setHasError(false)
                setIsLoading(true)
                if (iframeRef.current) {
                  iframeRef.current.src = iframeRef.current.src
                }
              }}
              className="text-xs underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className={`absolute inset-0 w-full h-full ${isLoading || hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || `Vimeo video ${videoId}`}
        aria-label={title || `Vidéo Vimeo ${videoId}`}
      />
    </div>
  )
}
