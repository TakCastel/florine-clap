'use client'

import { Clock, Play, Calendar } from 'lucide-react'
import ContentCard from '@/components/ContentCard'

type VideoArtCardProps = {
  href: string
  title: string
  cover?: string
  body?: string
  duree?: string
  annee?: string
  vimeoId?: string
  isHero?: boolean
}

export default function VideoArtCard({ 
  href, 
  title, 
  cover, 
  body, 
  duree,
  annee,
  vimeoId,
  isHero = false
}: VideoArtCardProps) {
  return (
    <ContentCard
      href={href}
      title={title}
      imageSrc={cover}
      description={body}
      duration={duree}
      date={annee}
      theme="videos-art"
      ctaLabel="Découvrir"
      showPlayBadge={!!vimeoId}
      className={isHero ? "h-[500px] md:h-[600px]" : ""}
    />
  )
}



