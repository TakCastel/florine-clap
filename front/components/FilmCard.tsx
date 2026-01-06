'use client'

import ContentCard from '@/components/ContentCard'

type FilmCardProps = {
  href: string
  title: string
  cover?: string
  body?: string
  duree?: string
  annee?: string
  vimeoId?: string
  isHero?: boolean
}

export default function FilmCard({ 
  href, 
  title, 
  cover, 
  body, 
  duree,
  annee,
  vimeoId,
  isHero = false
}: FilmCardProps) {
  
  // Si c'est une carte Hero, on peut soit garder un style spécifique, soit utiliser une version agrandie de ContentCard
  // Pour l'instant, j'utilise ContentCard partout pour l'uniformité
  
  return (
    <ContentCard
      href={href}
      title={title}
      imageSrc={cover}
      description={body}
      duration={duree}
      date={annee}
      theme="films"
      ctaLabel="Découvrir"
      showPlayBadge={!!vimeoId}
      className={isHero ? "h-[500px] md:h-[600px]" : ""}
    />
  )
}