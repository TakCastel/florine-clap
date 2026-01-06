'use client'

interface ScrollIndicatorProps {
  onClick: () => void
  label?: string
  className?: string
  ariaLabel?: string
}

export default function ScrollIndicator({ 
  onClick, 
  label = "Continuer vers le bas", 
  className = "",
  ariaLabel = "Continuer vers le bas"
}: ScrollIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex flex-col items-center transition-all duration-300 cursor-pointer ${className || 'text-white/60 hover:text-white'}`}
      aria-label={ariaLabel}
    >
      <span className="text-xs mb-2 transition-colors duration-300">
        {label}
      </span>
      <svg 
        className="w-6 h-6 transition-all duration-300 group-hover:translate-y-1" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        viewBox="0 0 24 24"
      >
        <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
      </svg>
    </button>
  )
}
