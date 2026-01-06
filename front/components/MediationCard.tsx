'use client'

import { Calendar } from 'lucide-react'
import ContentCard from '@/components/ContentCard'

type MediationCardProps = {
  href: string
  title: string
  cover?: string
  body?: string
  date?: string | Date
  lieu?: string
}

export default function MediationCard({ 
  href, 
  title, 
  cover, 
  body,
  date,
  lieu
}: MediationCardProps) {
  return (
    <ContentCard
      href={href}
      title={title}
      imageSrc={cover}
      description={body}
      date={date ? new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined}
      category={lieu}
      theme="mediations"
      ctaLabel="Découvrir"
    />
  )
}

