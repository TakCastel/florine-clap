"use client"
import { useMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'

const components = {
  img: (props: any) => (
    <Image {...props} alt={props.alt || ''} width={1200} height={800} />
  ),
}

export default function MdxRenderer({ code }: { code: string | { raw: string; html: string } }) {
  const Component = useMDXComponent(typeof code === 'string' ? code : code.raw)
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Component components={components as any} />
    </div>
  )
}


