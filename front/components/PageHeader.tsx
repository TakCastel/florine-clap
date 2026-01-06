'use client'

import { useState, useEffect } from 'react'

interface PageHeaderProps {
  title: string
  description: string
  className?: string
}

export default function PageHeader({ title, description, className = '' }: PageHeaderProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  return (
    <div className={`mb-8 md:mb-12 ${className}`}>
      <div 
        className="overflow-hidden mb-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
        }}
      >
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black">
          {title}
        </h1>
      </div>
      
      {/* Ligne décorative animée */}
      <div className="h-[2px] bg-black/10 w-full max-w-md overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-500 ease-out"
          style={{
            width: isVisible ? '100%' : '0%',
            transitionDelay: '0.1s',
          }}
        ></div>
      </div>

      <p 
        className="text-base leading-relaxed font-normal text-black/80 mt-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s',
        }}
      >
        {description}
      </p>
    </div>
  )
}

