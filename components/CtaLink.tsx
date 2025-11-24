'use client'

import { useState } from 'react'

interface CtaLinkProps {
  href?: string
  label: string
  tone?: 'light' | 'dark'
  isActive?: boolean
  className?: string
  as?: 'a' | 'span'
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

  const Tag = as === 'span' ? 'span' : 'a'

  return (
    <Tag
      {...(as === 'a' ? { href } : {})}
      className={`group inline-flex items-center gap-3 text-sm md:text-base font-medium uppercase tracking-wide transition-all duration-300 ${palette.text} ${className}`}
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

