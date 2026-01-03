'use client'

import { Clock, Play, Calendar } from 'lucide-react'
import ContentCard from '@/components/ContentCard'

type VideoArtCardProps = {
  href: string
  title: string
  cover?: string
  synopsis?: string
  duree?: string
  annee?: string
  vimeoId?: string
  isHero?: boolean
}

export default function VideoArtCard({ 
  href, 
  title, 
  cover, 
  synopsis, 
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
      description={synopsis}
      duration={duree}
      date={annee}
      theme="videos-art"
      ctaLabel="Découvrir"
      showPlayBadge={!!vimeoId}
      className={isHero ? "h-[500px] md:h-[600px]" : ""}
    />
  )
}



