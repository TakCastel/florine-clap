"use client"
import { useMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const components = {
  img: (props: any) => (
    <Image {...props} alt={props.alt || ''} width={1200} height={800} />
  ),
  h1: (props: any) => <h1 {...props} className="font-andale-mono text-3xl font-bold mb-4 text-theme-blue" />,
  h2: (props: any) => <h2 {...props} className="font-andale-mono text-2xl font-bold mb-3 text-theme-blue" />,
  h3: (props: any) => <h3 {...props} className="font-andale-mono text-xl font-bold mb-2 text-theme-blue" />,
  h4: (props: any) => <h4 {...props} className="font-andale-mono text-lg font-bold mb-2 text-theme-blue" />,
  h5: (props: any) => <h5 {...props} className="font-andale-mono text-base font-bold mb-2 text-theme-blue" />,
  h6: (props: any) => <h6 {...props} className="font-andale-mono text-sm font-bold mb-2 text-theme-blue" />,
}

export default function MdxRenderer({ code }: { code: string | { raw: string; html: string } }) {
  const Component = useMDXComponent(typeof code === 'string' ? code : code.raw)
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    // Supprimer les liens dans les titres en gardant le texte - immédiatement
    const removeLinksFromHeadings = () => {
      const headings = containerRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings?.forEach(heading => {
        const links = heading.querySelectorAll('a')
        links.forEach(link => {
          // Remplacer le lien par son contenu texte
          const textNode = document.createTextNode(link.textContent || '')
          link.parentNode?.replaceChild(textNode, link)
        })
      })
    }
    
    // Exécuter immédiatement
    removeLinksFromHeadings()
    
    // Observer les changements du DOM pour traiter les nouveaux éléments
    const observer = new MutationObserver(() => {
      removeLinksFromHeadings()
    })
    
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true
    })
    
    return () => {
      observer.disconnect()
    }
  }, [code])
  
  return (
    <div ref={containerRef} className="prose prose-neutral dark:prose-invert max-w-none">
      <Component components={components as any} />
    </div>
  )
}


