'use client'

import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getImageUrl } from '@/lib/directus'

type ContentItem = {
  id?: string
  _id?: string
  slug: string
  title: string
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
    return { subtitle: item.annee, details: item.duree }
  }
  return { subtitle: undefined, details: undefined }
}

export default function VerticalCarousel({ items, basePath, className = '' }: VerticalCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const scrollRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [navBottom, setNavBottom] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set([0]))

  useEffect(() => setMounted(true), [])

  useEffect(
    () => () => {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current)
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
    let rafId = 0
    const update = () => {
      rafId = requestAnimationFrame(() => {
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
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [mounted])

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  const smoothScrollTo = (targetY: number, duration: number, easing: (t: number) => number) => {
    const startY = window.scrollY
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easing(t)
      window.scrollTo(0, startY + (targetY - startY) * eased)
      if (t < 1) {
        scrollRef.current = requestAnimationFrame(tick)
      }
    }
    if (scrollRef.current) cancelAnimationFrame(scrollRef.current)
    scrollRef.current = requestAnimationFrame(tick)
  }

  const scrollToSlide = (index: number) => {
    const el = sectionRefs.current[index]
    if (!el) return

    setActiveIndex(index)

    const direction = index > activeIndex ? 1 : index < activeIndex ? -1 : 0

    const rect = el.getBoundingClientRect()
    const targetScrollY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2
    const slideDiff = Math.abs(index - activeIndex)
    const overshootPx =
      (slideDiff <= 1
        ? 22
        : Math.min(200, 25 + Math.pow(slideDiff, 1.35) * 9)) * direction

    if (direction === 0) {
      smoothScrollTo(targetScrollY, 650, easeInOutCubic)
      return
    }

    const overshootScrollY = targetScrollY + overshootPx

    smoothScrollTo(overshootScrollY, 420, easeInOutCubic)
    setTimeout(() => {
      smoothScrollTo(targetScrollY, 580, (t) => 1 - (1 - t) ** 3)
    }, 440)
  }

  useEffect(() => {
    const sectionEls = sectionRefs.current
    if (sectionEls.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = parseInt(entry.target.getAttribute('data-section-index') ?? '0', 10)
          setActiveIndex(index)
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
            const isActive = index === activeIndex

            return (
              <section
                key={item.id || item._id || index}
                ref={(el) => { sectionRefs.current[index] = el }}
                className="flex items-center py-1 md:py-2 lg:py-3"
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
                        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                          {item.title}
                        </h3>
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
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            key={index}
                            initial={{ x: 80, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 80, opacity: 0 }}
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
                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
                              {item.title}
                            </h3>
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
                        )}
                      </AnimatePresence>
                    )}
                  </div>

                  <div className="flex-1 lg:ml-auto lg:w-3/5 flex items-center lg:justify-end justify-center">
                    <motion.div
                      className={`w-full max-w-full ${!isActive ? 'lg:origin-right' : ''}`}
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : 0.88,
                        opacity: isActive ? 1 : 0.6,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 28,
                      }}
                    >
                      {isActive ? (
                        <Link href={href} className="block overflow-hidden aspect-[4/3]">
                          {cover ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={cover}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
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
                          className="block w-full overflow-hidden aspect-[4/3] cursor-pointer text-left"
                          aria-label={`Voir ${item.title}`}
                        >
                          {cover ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={cover}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? 'eager' : 'lazy'}
                            />
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
