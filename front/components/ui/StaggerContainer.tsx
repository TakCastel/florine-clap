'use client'

import { motion, useInView, Variants, UseInViewOptions } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerChildren?: number
  once?: boolean
  threshold?: number
}

export const StaggerContainer = ({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0.1,
  once = true,
  threshold = 0.2,
}: StaggerContainerProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: threshold } as UseInViewOptions)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerChildren,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}

