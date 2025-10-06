import Link from 'next/link'

type BreadcrumbItem = {
  label: string
  href?: string
}

type Props = {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-orange-200 mb-8" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-orange-100 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-orange-100 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
