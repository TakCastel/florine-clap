import Link from 'next/link'

type ActuCardProps = {
  href: string
  title: string
  cover: string
  excerpt?: string
  date: string
}

export default function ActuCard({ 
  href, 
  title, 
  cover, 
  excerpt, 
  date 
}: ActuCardProps) {
  return (
    <Link href={href} className="group block">
      <article className="bg-white/95 hover:bg-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] overflow-hidden transform">
        <div className="aspect-[3/2] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${cover})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/0 via-theme-dark/0 to-theme-dark/0 group-hover:from-theme-dark/80 group-hover:via-theme-dark/40 group-hover:to-theme-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
          <div className="relative z-10 p-4 h-full flex flex-col justify-end">
            <div className="text-theme-yellow text-xs font-andale-mono mb-1">
              {new Date(date).toLocaleDateString('fr-FR')}
            </div>
            <h3 className="text-base font-andale-mono font-bold text-white mb-1 leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </article>
    </Link>
  )
}
