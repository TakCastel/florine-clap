'use client'

import { Calendar } from 'lucide-react'
import ContentCard from '@/components/ContentCard'

type ActuCardProps = {
  href: string
  title: string
  cover?: string
  excerpt?: string
  date: string
}

export default function ActuCard({ 
  href, 
  title, 
  cover, 
  excerpt, 
  date 
}: ActuCardProps) {
  return (
    <ContentCard
      href={href}
      title={title}
      imageSrc={cover}
      description={excerpt}
      date={new Date(date).toLocaleDateString('fr-FR')}
      theme="actus"
      ctaLabel="Lire"
    />
  )
}
