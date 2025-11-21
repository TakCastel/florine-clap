'use client'

import { motion, useTransform, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import FilmCard from './FilmCard'

type StickyFilmCardProps = {
  i: number
  film: {
    _id: string
    slug: string
    title: string
    image?: string
    shortSynopsis?: string
    duree?: string
    annee?: string
    vimeoId?: string
  }
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

export const StickyFilmCard = ({
  i,
  film,
  progress,
  range,
  targetScale,
}: StickyFilmCardProps) => {
  const container = useRef<HTMLDivElement>(null)
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div
      ref={container}
      className="sticky top-0 flex items-center justify-center"
      style={{
        height: '100vh',
      }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 20 + 250}px)`,
        }}
        className="rounded-2xl relative -top-1/4 flex h-[600px] w-full max-w-6xl origin-top flex-col overflow-hidden px-6 md:px-10 lg:px-16"
      >
        <FilmCard
          href={`/films/${film.slug}`}
          title={film.title}
          cover={film.image}
          synopsis={film.shortSynopsis}
          duree={film.duree}
          annee={film.annee}
          vimeoId={film.vimeoId}
          isHero={true}
        />
      </motion.div>
    </div>
  )
}




