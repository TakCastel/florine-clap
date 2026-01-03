// import Link from 'next/link' - Removed to use native HTML links like the logo

type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
  variant?: 'default' | 'blue' | 'grey' | 'yellow' | 'dark' | 'white'
}

export default function Breadcrumb({ items, variant = 'default' }: Props) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'blue':
        return {
          container: 'bg-theme-blue/80 backdrop-blur-md',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      case 'grey':
        return {
          container: 'bg-gray-100/80 backdrop-blur-md',
          text: 'text-theme-blue/80',
          separator: 'text-theme-blue/60',
          hover: 'hover:text-theme-blue',
          current: 'text-theme-blue'
        }
      case 'yellow':
        return {
          container: 'bg-theme-yellow/80 backdrop-blur-md',
          text: 'text-black/80',
          separator: 'text-black/60',
          hover: 'hover:text-black',
          current: 'text-black'
        }
      case 'dark':
        return {
          container: 'bg-black/70 backdrop-blur-md',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      case 'white':
        return {
          container: 'bg-white/70 backdrop-blur-md',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      default:
        return {
          container: 'bg-theme-white/80 backdrop-blur-md',
          text: 'text-black/80',
          separator: 'text-black/60',
          hover: 'hover:text-black',
          current: 'text-black'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`${styles.container} py-4 sr-only`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <nav className={`flex items-center text-sm font-display ${styles.text}`} aria-label="Breadcrumb">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <span className={`mx-3 ${styles.separator} font-display`}>/</span>
              )}
              {item.href ? (
                <a 
                  href={item.href} 
                  className={`${styles.hover} transition-colors font-display`}
                >
                  {item.label}
                </a>
              ) : (
                <span className={`${styles.current} font-medium font-display`}>{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}