'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import { getImageUrl } from '@/lib/directus'

const components = {
  h1: (props: any) => {
    const { children, ...restProps } = props
    // S'assurer que children est bien rendu
    const content = typeof children === 'string' ? children : (Array.isArray(children) ? children.join('') : String(children || ''))
    return (
      <h1 {...restProps} className="text-2xl font-display font-bold text-black mb-6 mt-8 first:mt-0">
        {content}
      </h1>
    )
  },
  h2: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h2 {...restProps} className="text-xl font-display font-bold text-black mb-4 mt-8 first:mt-0">
        {children}
      </h2>
    )
  },
  h3: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h3 {...restProps} className="text-lg md:text-xs font-display font-semibold text-black mb-3 mt-6 first:mt-0">
        {children}
      </h3>
    )
  },
  h4: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h4 {...restProps} className="text-base font-display font-semibold text-black mb-2 mt-4 first:mt-0">
        {children}
      </h4>
    )
  },
  h5: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h5 {...restProps} className="text-sm font-display font-medium text-black mb-2 mt-4 first:mt-0">
        {children}
      </h5>
    )
  },
  h6: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h6 {...restProps} className="text-xs font-display font-medium text-black mb-2 mt-4 first:mt-0">
        {children}
      </h6>
    )
  },
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
        className=""
      />
    )
  },
  a: (props: any) => (
    <a {...props} className="text-black hover:text-black/80 transition-colors font-display no-underline" />
  ),
  p: (props: any) => (
    <p {...props} className="mb-4 text-base text-black/90 leading-relaxed" />
  ),
  ul: (props: any) => (
    <ul {...props} className="list-disc list-inside mb-4 space-y-2" />
  ),
  ol: (props: any) => (
    <ol {...props} className="list-decimal list-inside mb-4 space-y-2" />
  ),
  li: (props: any) => {
    const { children, ...restProps } = props
    return (
      <li {...restProps} className="text-base text-black/90">
        {children}
      </li>
    )
  },
  blockquote: (props: any) => (
    <blockquote {...props} className="border-l-4 border-black/20 pl-4 italic my-4 text-base text-black/80" />
  ),
  code: (props: any) => (
    <code {...props} className="bg-black/5 px-1 py-0.5 rounded text-xs font-mono" />
  ),
  pre: (props: any) => (
    <pre {...props} className="bg-black/5 p-4 rounded-lg overflow-x-auto my-4" />
  ),
}

export default function MarkdownRenderer({ 
  content,
  skipFirstHeading = false,
  shiftHeadings = false // Si true, # devient h2, ## devient h3, etc.
}: { 
  content: string
  skipFirstHeading?: boolean
  shiftHeadings?: boolean
}) {
  let markdownContent = content || ''
  
  // Si skipFirstHeading, supprimer uniquement le premier h1 du contenu (pas les h2, h3, etc.)
  if (skipFirstHeading) {
    // Supprimer seulement le premier h1 (# titre) mais garder tous les autres titres
    markdownContent = markdownContent.replace(/^#\s+[^\n]+$/m, '').trim()
  }
  
  // Si shiftHeadings, décaler les niveaux de titres : # devient h2, ## devient h3, etc.
  // Mais garder le premier H1 (titre de l'article) en H1
  if (shiftHeadings) {
    // Séparer le premier H1 (titre) du reste
    const lines = markdownContent.split('\n')
    let firstH1 = ''
    let restContent = ''
    let foundFirstH1 = false
    
    for (let i = 0; i < lines.length; i++) {
      if (!foundFirstH1 && lines[i].match(/^#\s+/)) {
        firstH1 = lines[i]
        foundFirstH1 = true
      } else {
        restContent += lines[i] + '\n'
      }
    }
    
    // Décale les titres dans le reste du contenu : # devient ##, ## devient ###, etc.
    restContent = restContent
      .replace(/^####### /gm, '######## ') // h7 -> h8 (limite)
      .replace(/^###### /gm, '####### ')   // h6 -> h7
      .replace(/^##### /gm, '###### ')     // h5 -> h6
      .replace(/^#### /gm, '##### ')       // h4 -> h5
      .replace(/^### /gm, '#### ')          // h3 -> h4
      .replace(/^## /gm, '### ')            // h2 -> h3
      .replace(/^# /gm, '## ')              // h1 -> h2 (dans le contenu, pas le titre)
    
    // Reconstruire avec le premier H1 intact
    markdownContent = foundFirstH1 
      ? `${firstH1}\n\n${restContent.trim()}`
      : restContent.trim()
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



