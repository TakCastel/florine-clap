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
          container: 'bg-theme-blue',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      case 'grey':
        return {
          container: 'bg-gray-100',
          text: 'text-theme-blue/80',
          separator: 'text-theme-blue/60',
          hover: 'hover:text-theme-blue',
          current: 'text-theme-blue'
        }
      case 'yellow':
        return {
          container: 'bg-theme-yellow',
          text: 'text-theme-dark/80',
          separator: 'text-theme-dark/60',
          hover: 'hover:text-theme-dark',
          current: 'text-theme-dark'
        }
      case 'dark':
        return {
          container: 'bg-theme-dark',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      case 'white':
        return {
          container: 'bg-theme-dark',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
      default:
        return {
          container: 'bg-theme-dark',
          text: 'text-white/80',
          separator: 'text-white/60',
          hover: 'hover:text-white',
          current: 'text-white'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`${styles.container} py-4`}>
      <div className="max-w-6xl mx-auto px-4">
        <nav className={`flex items-center text-sm font-andale-mono ${styles.text}`} aria-label="Breadcrumb">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <span className={`mx-8 ${styles.separator} font-andale-mono`}>/</span>
              )}
              {item.href ? (
                <a 
                  href={item.href} 
                  className={`${styles.hover} transition-colors font-andale-mono`}
                >
                  {item.label}
                </a>
              ) : (
                <span className={`${styles.current} font-medium font-andale-mono`}>{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}