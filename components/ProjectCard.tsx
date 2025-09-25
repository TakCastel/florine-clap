import Image from 'next/image'
import Link from 'next/link'

type Props = {
  href: string
  title: string
  subtitle?: string
  cover?: string
  excerpt?: string
}

export default function ProjectCard({ href, title, subtitle, cover, excerpt }: Props) {
  return (
    <Link href={href} className="group block overflow-hidden border hover:shadow-sm">
      {cover && (
        <div className="aspect-video relative">
          <Image src={cover} alt={title} fill className="object-cover transition-transform group-hover:scale-[1.02]" />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {excerpt && <p className="mt-2 text-sm text-gray-600 line-clamp-2">{excerpt}</p>}
      </div>
    </Link>
  )}


