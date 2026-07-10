'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/lib/directus'

type ContentItem = {
  id?: string
  _id?: string
  slug: string
  title: string
  subtitle?: string
  image?: string | { id: string; filename_download: string }
  content?: string | { id: string; filename_download: string }
  cover?: string | { id: string; filename_download: string }
  duree?: string
  annee?: string
  date?: string | Date
  lieu?: string
  [key: string]: unknown
}

type VerticalCarouselProps = {
  items: ContentItem[]
  basePath: string
  className?: string
}

function getCoverUrl(item: ContentItem): string | undefined {
  const raw = typeof item.content === 'string' && item.content.startsWith('http')
    ? item.content
    : typeof item.image === 'string' && item.image.startsWith('http')
    ? item.image
    : typeof item.cover === 'string' && item.cover.startsWith('http')
    ? item.cover
    : getImageUrl(item.content) || getImageUrl(item.image) || getImageUrl(item.cover) || undefined
  return raw
}

function getMetadata(item: ContentItem, basePath: string) {
  if (basePath === '/films') {
    return { subtitle: item.annee, details: [item.duree, item.annee].filter(Boolean).join(' | ') }
  }
  if (basePath === '/mediations') {
    return { subtitle: item.lieu, details: item.date ? new Date(item.date).toLocaleDateString('fr-FR') : undefined }
  }
  if (basePath === '/videos-art') {
    return { subtitle: item.annee, details: item.duree, freeSubtitle: item.subtitle }
  }
  return { subtitle: undefined, details: undefined }
}

export default function VerticalCarousel({ items, basePath, className = '' }: VerticalCarouselProps) {
  const TEXT_DELAY_PREV_MS = 220
  const TEXT_DELAY_NEXT_MS = 140
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const scrollRef = useRef<number | null>(null)
  const activationTimeoutRef = useRef<number | null>(null)
  const isNavigatingRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [navBottom, setNavBottom] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set([0]))
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(() => new Set([0]))
  const imageDisplayedIndex =
    !isMobile && hoveredIndex !== null && visibleIndexes.has(hoveredIndex)
      ? hoveredIndex
      : activeIndex
  const textDisplayedIndex =
    !isMobile && hoveredIndex !== null && visibleIndexes.has(hoveredIndex)
      ? hoveredIndex
      : textIndex

  useEffect(() => setMounted(true), [])

  useEffect(
    () => () => {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current)
      if (activationTimeoutRef.current !== null) window.clearTimeout(activationTimeoutRef.current)
    },
    []
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, items.length)
  }, [items.length])

  useEffect(() => {
    const footer = document.getElementById('site-footer')
    if (!footer) return
    let rafId: number | null = null
    const update = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        const rect = footer.getBoundingClientRect()
        const vh = window.innerHeight
        setNavBottom(rect.top < vh ? vh - rect.top + 32 : null)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(footer)
    update()
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [mounted])

  const scrollToSlide = (index: number) => {
    const el = sectionRefs.current[index]
    if (!el) return

    isNavigatingRef.current = true
    setHoveredIndex(null)
    if (activationTimeoutRef.current !== null) {
      window.clearTimeout(activationTimeoutRef.current)
      activationTimeoutRef.current = null
    }

    setActiveIndex(index)

    const isGoingUp = index < activeIndex
    const isGoingDown = index > activeIndex
    if (isGoingUp) {
      setTextIndex(-1)
      activationTimeoutRef.current = window.setTimeout(() => {
        setTextIndex(index)
        activationTimeoutRef.current = null
      }, TEXT_DELAY_PREV_MS)
    } else if (isGoingDown) {
      setTextIndex(-1)
      activationTimeoutRef.current = window.setTimeout(() => {
        setTextIndex(index)
        activationTimeoutRef.current = null
      }, TEXT_DELAY_NEXT_MS)
    } else {
      setTextIndex(index)
    }

    const rect = el.getBoundingClientRect()
    const targetY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
    window.scrollTo(0, targetY)

    window.setTimeout(() => {
      isNavigatingRef.current = false
    }, 600)
  }

  useEffect(() => {
    const sectionEls = sectionRefs.current
    if (sectionEls.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-section-index') ?? '0', 10)
          setVisibleIndexes((prev) => {
            const next = new Set(prev)
            if (entry.isIntersecting) next.add(index)
            else next.delete(index)
            return next
          })
          if (!entry.isIntersecting || isNavigatingRef.current) return
          setActiveIndex(index)
          setTextIndex(index)
        })
      },
      {
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0,
      }
    )
    const mobileObserver = new IntersectionObserver(
      (entries) => {
        if (!mounted || !isMobile) return
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = parseInt(entry.target.getAttribute('data-section-index') ?? '0', 10)
          setRevealed((prev) => (prev.has(index) ? prev : new Set(prev).add(index)))
        })
      },
      { rootMargin: '0px 0px -40% 0px', threshold: 0 }
    )
    sectionEls.forEach((el, i) => {
      if (el) {
        el.setAttribute('data-section-index', String(i))
        observer.observe(el)
        mobileObserver.observe(el)
      }
    })
    return () => {
      observer.disconnect()
      mobileObserver.disconnect()
    }
  }, [items.length, mounted, isMobile])

  if (items.length === 0) return null

  const navEl = (
    <nav
      className="hidden lg:flex flex-col gap-1 left-8 xl:left-16 w-44 xl:w-52 z-[100] pb-2 max-h-[50vh] overflow-y-auto"
      style={{
        position: 'fixed',
        bottom: navBottom !== null ? navBottom : 32,
      }}
      aria-label="Navigation dans la liste"
    >
      {items.map((item, index) => (
              <button
                key={item.id || item._id || index}
                onClick={() => scrollToSlide(index)}
                className="text-left py-2 px-0 text-sm font-medium border-l-2 pl-3 -ml-px transition-colors hover:text-black/70"
                style={{
                  borderColor: index === activeIndex ? '#000' : 'transparent',
                  color: index === activeIndex ? '#000' : 'rgba(0,0,0,0.4)',
                }}
              >
                {item.title}
              </button>
            ))}
    </nav>
  )

  return (
    <div className={`relative ${className}`}>
      {mounted && createPortal(navEl, document.body)}
      <div ref={containerRef} className="relative lg:pl-52">
        {/* Liste des sections */}
        <div className="flex flex-col gap-1 pb-16 md:pb-24 lg:pb-32">
          {items.map((item, index) => {
            const cover = getCoverUrl(item)
            const meta = getMetadata(item, basePath)
            const href = `${basePath}/${item.slug}`
            const isImageActive = index === imageDisplayedIndex
            const isTextActive = index === textDisplayedIndex && textDisplayedIndex >= 0
            const isCurrent = index === activeIndex

            return (
              <section
                key={item.id || item._id || index}
                ref={(el) => { sectionRefs.current[index] = el }}
                className="flex items-center py-1 md:py-2 lg:py-3"
                onMouseEnter={() => {
                  if (!isMobile) setHoveredIndex(index)
                }}
                onMouseMove={() => {
                  if (!isMobile) setHoveredIndex(index)
                }}
                onMouseLeave={() => {
                  if (!isMobile) setHoveredIndex(null)
                }}
              >
                <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-start gap-8">
                  <div className="flex-shrink-0 w-full lg:w-2/5 min-h-[8rem] lg:min-h-0 text-left lg:text-right">
                    {isMobile ? (
                      revealed.has(index) && (
                        <motion.div
                          initial={{ x: 60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 24,
                            bounce: 0.4,
                            delay: 0.1,
                          }}
                        >
                        {meta.subtitle && (
                          <p className="text-sm text-black/50 uppercase tracking-wider mb-2">{meta.subtitle}</p>
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                          {item.title}
                        </h2>
                        {meta.freeSubtitle && (
                          <p className="text-sm text-black/70 mt-2 leading-relaxed">
                            {meta.freeSubtitle}
                          </p>
                        )}
                        {meta.details && (
                          <p className="text-sm text-black/50 mt-2">{meta.details}</p>
                        )}
                        <Link
                          href={href}
                          className="inline-flex items-center gap-2 mt-4 text-xs font-medium uppercase tracking-wide text-black/60 hover:text-black transition-colors"
                        >
                          Découvrir
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                        </motion.div>
                      )
                    ) : (
                      isTextActive && (
                        <motion.div
                          key={index}
                          initial={{ x: 80, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 320,
                            damping: 22,
                            mass: 0.8,
                          }}
                        >
                          {meta.subtitle && (
                            <p className="text-sm text-black/50 uppercase tracking-wider mb-2">{meta.subtitle}</p>
                          )}
                          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                            {item.title}
                          </h2>
                          {meta.freeSubtitle && (
                            <p className="text-sm text-black/70 mt-2 leading-relaxed">
                              {meta.freeSubtitle}
                            </p>
                          )}
                          {meta.details && (
                            <p className="text-sm text-black/50 mt-2">{meta.details}</p>
                          )}
                          <Link
                            href={href}
                            className="inline-flex items-center gap-2 mt-4 text-xs font-medium uppercase tracking-wide text-black/60 hover:text-black transition-colors"
                          >
                            Découvrir
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </motion.div>
                      )
                    )}
                  </div>

                  <div className="flex-1 lg:ml-auto lg:w-3/5 flex items-center lg:justify-end justify-center">
                    <motion.div
                      className={`w-full max-w-full ${!isImageActive ? 'lg:origin-right' : ''}`}
                      initial={false}
                      animate={{
                        scale: isImageActive ? 1 : 0.88,
                        opacity: isImageActive ? 1 : 0.6,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 28,
                      }}
                    >
                      {isCurrent ? (
                        <Link href={href} className="block overflow-hidden aspect-[4/3] relative">
                          {cover ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={cover}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                                quality={85}
                                priority={index === 0}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-black/5 flex items-center justify-center">
                              <span className="text-black/30 text-sm uppercase">Image non disponible</span>
                            </div>
                          )}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => scrollToSlide(index)}
                          className="block w-full overflow-hidden aspect-[4/3] cursor-pointer text-left relative"
                          aria-label={`Voir ${item.title}`}
                        >
                          {cover ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={cover}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                                quality={85}
                                priority={index === 0}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-black/5 flex items-center justify-center">
                              <span className="text-black/30 text-sm uppercase">Image non disponible</span>
                            </div>
                          )}
                        </button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
