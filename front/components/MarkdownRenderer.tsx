'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { getImageUrl } from '@/lib/directus'

const components = {
  img: (props: any) => {
    const src = props.src?.startsWith('http') 
      ? props.src 
      : props.src?.startsWith('/') 
        ? props.src 
        : `/images/${props.src}`
    
    return (
      <Image 
        {...props} 
        src={src}
        alt={props.alt || ''} 
        width={1200} 
        height={800}
        className="rounded-lg"
      />
    )
  },
  a: (props: any) => (
    <a {...props} className="text-black hover:text-black/80 transition-colors font-display no-underline" />
  ),
  h1: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h1 {...restProps} className="font-display text-3xl font-bold mb-4 text-black">
        {children}
      </h1>
    )
  },
  h2: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h2 {...restProps} className="font-display text-2xl font-bold mb-3 text-black">
        {children}
      </h2>
    )
  },
  h3: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h3 {...restProps} className="font-display text-xl font-bold mb-2 text-black">
        {children}
      </h3>
    )
  },
  h4: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h4 {...restProps} className="font-display text-lg font-bold mb-2 text-black">
        {children}
      </h4>
    )
  },
  h5: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h5 {...restProps} className="font-display text-base font-bold mb-2 text-black">
        {children}
      </h5>
    )
  },
  h6: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h6 {...restProps} className="font-display text-sm font-bold mb-2 text-black">
        {children}
      </h6>
    )
  },
  p: (props: any) => (
    <p {...props} className="mb-4 text-black/90 leading-relaxed" />
  ),
  ul: (props: any) => (
    <ul {...props} className="list-disc list-inside mb-4 space-y-2" />
  ),
  ol: (props: any) => (
    <ol {...props} className="list-decimal list-inside mb-4 space-y-2" />
  ),
  li: (props: any) => (
    <li {...props} className="text-black/90" />
  ),
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-black/20 pl-4 italic my-4 text-black/80" />
  ),
  code: (props: any) => (
    <code {...props} className="bg-black/5 px-1 py-0.5 rounded text-sm font-mono" />
  ),
  pre: (props: any) => (
    <pre {...props} className="bg-black/5 p-4 rounded-lg overflow-x-auto my-4" />
  ),
}

export default function MarkdownRenderer({ 
  content,
  skipFirstHeading = false 
}: { 
  content: string
  skipFirstHeading?: boolean
}) {
  let markdownContent = content || ''
  
  // Si skipFirstHeading, supprimer le premier h1 du contenu
  if (skipFirstHeading) {
    markdownContent = markdownContent.replace(/^#\s+.*$/m, '').trim()
  }
  
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components as any}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}

