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
}

export default function VimeoPlayer({
  videoId,
  className = '',
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
  width = '100%',
  height = '100%'
}: VimeoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    // Configuration des paramètres Vimeo
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      muted: muted ? '1' : '0',
      loop: loop ? '1' : '0',
      controls: controls ? '1' : '0',
      background: '0',
      byline: '0',
      title: '0',
      portrait: '0',
      responsive: '1'
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
        title={`Vimeo video ${videoId}`}
      />
    </div>
  )
}
