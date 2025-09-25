import Image from 'next/image'

interface BackgroundImageProps {
  src: string
  alt: string
}

export default function BackgroundImage({ src, alt }: BackgroundImageProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}


