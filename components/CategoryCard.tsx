'use client'

interface CategoryCardProps {
  href: string
  title: string
  description: string
  linkText: string
  imageSrc: string
  imageAlt: string
  bgColor: string
  hoverBgColor: string
  textColor: string
  linkColor: string
  hoverLinkColor: string
  underlineClass: string
  className?: string
  style?: React.CSSProperties
}

export default function CategoryCard({
  href,
  title,
  description,
  linkText,
  imageSrc,
  imageAlt,
  bgColor,
  hoverBgColor,
  textColor,
  linkColor,
  hoverLinkColor,
  underlineClass,
  className,
  style
}: CategoryCardProps) {
  return (
    <div 
      className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 w-full h-full hover:scale-105 flex flex-col`}
      style={style}
    >
      <img 
        src={imageSrc} 
        alt={imageAlt}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:object-center"
      />
      <div className={`absolute inset-0 ${bgColor} group-hover:${hoverBgColor} transition-all duration-500 flex flex-col`}>
        <div className="p-6 text-center pt-12">
          <h3 className={`font-bold ${textColor} text-2xl md:text-3xl lg:text-4xl relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-1.5 ${underlineClass} after:transition-all after:duration-500 group-hover:after:w-[97.5%]`}>
            {title}
          </h3>
        </div>
        <div className="p-6 text-center pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-100">
          <p className={`${textColor} text-sm md:text-base leading-relaxed text-center w-64 mx-auto`}>
            {description}
          </p>
        </div>
        <div className="p-6 text-center pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 delay-200">
          <span className={`${linkColor} font-medium hover:${hoverLinkColor} transition-all duration-300 text-sm md:text-base group-hover:translate-x-1 inline-flex items-center`}>
            {linkText}
            <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
      <a 
        href={href} 
        className="absolute inset-0 z-10"
        aria-label={`Aller à ${title}`}
      />
    </div>
  )
}
