interface NavigationProps {
  isHomePage?: boolean
}

export default function Navigation({ isHomePage = false }: NavigationProps) {
  const navItems = [
    { href: '/films', label: 'Films' },
    { href: '/ateliers', label: 'Médiations' },
    { href: '/actus', label: 'Actualités' },
    { href: '/bio', label: 'Bio' }
  ]

  return (
    <nav className="hidden md:flex items-center">
      {navItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <a 
            href={item.href} 
            className={`text-xl hover:text-theme-yellow transition-colors ${
              isHomePage ? 'text-white' : 'text-theme-dark'
            }`}
          >
            {item.label}
          </a>
          {index < navItems.length - 1 && (
            <span className={`mx-8 ${
              isHomePage ? 'text-white/60' : 'text-gray-400'
            }`}>
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
