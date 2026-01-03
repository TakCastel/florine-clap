interface BurgerIconProps {
  isOpen: boolean
  className?: string
  color?: 'black' | 'white'
}

export const BurgerIcon = ({ isOpen, className = '', color = 'black' }: BurgerIconProps) => {
  const barColor = color === 'white' ? 'bg-white' : 'bg-black'
  
  return (
    <div className={`relative w-5 h-5 flex items-center justify-center ${className}`}>
      {/* Barre du haut */}
      <span 
        className={`absolute w-full h-px ${barColor} transition-all duration-300 ease-in-out origin-center ${
          isOpen 
            ? 'rotate-45' 
            : '-translate-y-1.5'
        }`} 
      />
      {/* Barre du milieu */}
      <span 
        className={`absolute w-full h-px ${barColor} transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
        }`} 
      />
      {/* Barre du bas */}
      <span 
        className={`absolute w-full h-px ${barColor} transition-all duration-300 ease-in-out origin-center ${
          isOpen 
            ? '-rotate-45' 
            : 'translate-y-1.5'
        }`} 
      />
    </div>
  )
}

interface BurgerButtonProps {
  isOpen: boolean
  onClick: () => void
  isMobile?: boolean
  className?: string
  color?: 'black' | 'white'
}

export const BurgerButton = ({ isOpen, onClick, isMobile = false, className = '', color = 'black' }: BurgerButtonProps) => (
  <button
    onClick={onClick}
    className={`${isMobile ? 'md:hidden' : 'hidden md:flex'} items-center justify-center w-6 h-6 hover:opacity-60 transition-opacity duration-200 ${className}`}
    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
  >
    <BurgerIcon isOpen={isOpen} color={color} />
  </button>
)
