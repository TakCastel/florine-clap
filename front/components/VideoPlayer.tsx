'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string
  title?: string
  className?: string
  ariaLabel?: string
}

export default function VideoPlayer({
  src,
  title,
  className = '',
  ariaLabel
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setIsLoading(true)
    setHasError(false)

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)

    // Timeout pour détecter si la vidéo ne charge pas
    const timeout = setTimeout(() => {
      setIsLoading((current) => {
        if (current && video.readyState === 0) {
          setHasError(true)
          return false
        }
        return current
      })
    }, 10000) // 10 secondes

    return () => {
      clearTimeout(timeout)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
    }
  }, [src])

  return (
    <div className={`relative w-full aspect-video overflow-hidden ${className}`}>
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
                if (videoRef.current) {
                  videoRef.current.load()
                }
              }}
              className="text-xs underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        controls
        preload="metadata"
        className={`w-full h-full object-contain ${isLoading || hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        aria-label={ariaLabel || title || 'Vidéo'}
      >
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  )
}

