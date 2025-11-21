import Link from 'next/link'

export const MENU_ITEMS = [
  { href: '/films', label: 'FILMS' },
  { href: '/mediations', label: 'MÉDIATIONS' },
  { href: '/videos-art', label: 'VIDÉOS/ART' },
  { href: '/actus', label: 'ACTUALITÉS' },
  { href: '/bio', label: 'BIO' }
]

interface MenuLinkProps {
  href: string
  label: string
  onClick?: () => void
  className?: string
}

export const MenuLink = ({ href, label, onClick, className = '' }: MenuLinkProps) => (
  <Link 
    href={href} 
    onClick={onClick}
    className={`text-black hover:text-gray-700 transition-colors duration-300 text-base font-medium tracking-wide ${className}`}
  >
    {label}
  </Link>
)

interface DesktopMenuProps {
  className?: string
}

export const DesktopMenu = ({ className = '' }: DesktopMenuProps) => (
  <nav className={`hidden md:flex items-center space-x-6 ${className}`}>
    {MENU_ITEMS.map((item, index) => (
      <div key={item.href} className="flex items-center">
        <MenuLink href={item.href} label={item.label} />
        {index < MENU_ITEMS.length - 1 && <span className="text-black text-lg mx-2">/</span>}
      </div>
    ))}
  </nav>
)

interface MobileOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileOverlay = ({ isOpen, onClose }: MobileOverlayProps) => (
  <div className={`md:hidden fixed inset-0 z-40 transition-all duration-700 ease-out ${
    isOpen ? 'opacity-100 visible bg-black' : 'opacity-0 invisible'
  }`}>
    <div className="flex items-center justify-center h-full">
      <nav className="text-center space-y-8">
        {MENU_ITEMS.map((item, index) => (
          <div key={item.href} className={`transition-all duration-500 ease-out transform ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{ transitionDelay: isOpen ? `${200 + index * 100}ms` : '0ms' }}>
            <MenuLink 
              href={item.href} 
              label={item.label} 
              onClick={onClose}
              className="inline-block text-2xl font-light text-white"
            />
          </div>
        ))}
      </nav>
    </div>
  </div>
)

interface DesktopDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export const DesktopDropdown = ({ isOpen, onClose }: DesktopDropdownProps) => (
  <div className={`hidden md:block fixed top-[88px] right-0 z-40 transition-all duration-500 ease-out ${
    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
  }`}>
    <div className="bg-orange-100 shadow-lg px-8 h-[88px] flex items-center">
      <nav className="flex items-center space-x-8">
        {MENU_ITEMS.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <MenuLink 
              href={item.href} 
              label={item.label} 
              onClick={onClose}
            />
            {index < MENU_ITEMS.length - 1 && <span className="text-black text-lg mx-2">/</span>}
          </div>
        ))}
      </nav>
    </div>
  </div>
)