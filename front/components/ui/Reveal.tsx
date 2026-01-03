'use client'

import { motion, useInView, Variant, UseInViewOptions } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  width?: 'fit-content' | '100%'
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
  threshold?: number
}

export const Reveal = ({
  children,
  width = 'fit-content',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = '',
  once = true,
  threshold = 0.2,
}: RevealProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold } as UseInViewOptions)

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.25, 0, 1] as [number, number, number, number], // Custom cubic-bezier for "Apple-like" feel
      },
    },
  }

  return (
    <div ref={ref} style={{ width, overflow: 'visible' }} className={className}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    </div>
  )
}
