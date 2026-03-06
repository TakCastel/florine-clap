'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CtaLinkProps {
  href?: string
  label: string
  tone?: 'light' | 'dark'
  isActive?: boolean
  className?: string
  as?: 'a' | 'span'
}

/** Détecte si l'URL est interne (navigation client-side) */
function isInternalLink(href: string | undefined): boolean {
  if (!href) return false
  return href.startsWith('/') && !href.startsWith('//')
}

export default function CtaLink({
  href,
  label,
  tone = 'dark',
  isActive,
  className = '',
  as = 'a'
}: CtaLinkProps) {
  const [isHovered, setIsHovered] = useState(false)
  const active = typeof isActive === 'boolean' ? isActive : isHovered

  const palette = tone === 'light'
    ? { text: 'text-white', line: 'bg-white', icon: 'text-white' }
    : { text: 'text-black', line: 'bg-black', icon: 'text-black' }

  const baseClasses = `group inline-flex items-center gap-3 text-xs md:text-sm font-medium uppercase tracking-wide transition-all duration-300 ${palette.text} ${className}`

  // Liens internes : Link Next.js pour navigation client-side
  if (as !== 'span' && href && isInternalLink(href)) {
    return (
      <Link
        href={href}
        className={baseClasses}
        prefetch
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{label}</span>
        <div className="flex items-center gap-1">
          <div
            className={`h-[2px] transition-all duration-500 ${palette.line}`}
            style={{ width: active ? 48 : 24 }}
          ></div>
          <svg
            className={`w-5 h-5 transition-transform duration-500 ${palette.icon}`}
            style={{ transform: active ? 'translateX(0)' : 'translateX(-8px)' }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </Link>
    )
  }

  // Liens externes (http/https) ou span
  const Tag = as === 'span' ? 'span' : 'a'
  const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
  return (
    <Tag
      {...(as === 'a' && href ? { href } : {})}
      className={baseClasses}
      {...(Tag === 'a' && isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{label}</span>
      <div className="flex items-center gap-1">
        <div
          className={`h-[2px] transition-all duration-500 ${palette.line}`}
          style={{ width: active ? 48 : 24 }}
        ></div>
        <svg
          className={`w-5 h-5 transition-transform duration-500 ${palette.icon}`}
          style={{ transform: active ? 'translateX(0)' : 'translateX(-8px)' }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </Tag>
  )
}

