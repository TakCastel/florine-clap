'use client'

import { Calendar } from 'lucide-react'
import ContentCard from '@/components/ContentCard'

type MediationCardProps = {
  href: string
  title: string
  cover?: string
  excerpt?: string
  date?: string | Date
  lieu?: string
}

export default function MediationCard({ 
  href, 
  title, 
  cover, 
  excerpt,
  date,
  lieu
}: MediationCardProps) {
  return (
    <ContentCard
      href={href}
      title={title}
      imageSrc={cover}
      description={excerpt}
      date={date ? new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
      category={lieu}
      theme="mediations"
      ctaLabel="Découvrir"
    />
  )
}

