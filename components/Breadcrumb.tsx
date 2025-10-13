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
          text: 'text-theme-blue/80',
          separator: 'text-theme-blue/60',
          hover: 'hover:text-theme-blue',
          current: 'text-theme-blue'
        }
      case 'grey':
        return {
          text: 'text-theme-blue/80',
          separator: 'text-theme-blue/60',
          hover: 'hover:text-theme-blue',
          current: 'text-theme-blue'
        }
      case 'yellow':
        return {
          text: 'text-theme-yellow/80',
          separator: 'text-theme-yellow/60',
          hover: 'hover:text-theme-yellow',
          current: 'text-theme-yellow'
        }
      case 'dark':
        return {
          text: 'text-theme-dark/80',
          separator: 'text-theme-dark/60',
          hover: 'hover:text-theme-dark',
          current: 'text-theme-dark'
        }
      case 'white':
        return {
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      default:
        return {
          text: 'text-gray-600',
          separator: 'text-gray-400',
          hover: 'hover:text-gray-800',
          current: 'text-gray-800'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <nav className={`flex items-center text-sm ${styles.text} mb-8`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className={`mx-8 ${styles.separator}`}>/</span>
          )}
          {item.href ? (
            <a 
              href={item.href} 
              className={`${styles.hover} transition-colors`}
            >
              {item.label}
            </a>
          ) : (
            <span className={`${styles.current} font-medium`}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}