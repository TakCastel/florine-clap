import { useMDXComponent } from 'next-contentlayer2/hooks'
import Image from 'next/image'


const components = {
  img: (props: any) => (
    <Image {...props} alt={props.alt || ''} width={1200} height={800} />
  ),
  a: (props: any) => (
    <a {...props} className="text-theme-blue hover:text-theme-dark transition-colors font-display no-underline" />
  ),
  h1: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h1 {...restProps} className="font-display text-3xl font-bold mb-4 text-theme-blue">
        {children}
      </h1>
    )
  },
  h2: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h2 {...restProps} className="font-display text-2xl font-bold mb-3 text-theme-blue">
        {children}
      </h2>
    )
  },
  h3: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h3 {...restProps} className="font-display text-xl font-bold mb-2 text-theme-blue">
        {children}
      </h3>
    )
  },
  h4: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h4 {...restProps} className="font-display text-lg font-bold mb-2 text-theme-blue">
        {children}
      </h4>
    )
  },
  h5: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h5 {...restProps} className="font-display text-base font-bold mb-2 text-theme-blue">
        {children}
      </h5>
    )
  },
  h6: (props: any) => {
    const { children, ...restProps } = props
    return (
      <h6 {...restProps} className="font-display text-sm font-bold mb-2 text-theme-blue">
        {children}
      </h6>
    )
  },
}

export default function MdxRenderer({ code }: { code: string | { raw: string; html: string } | { code: string } }) {
  // Gérer différents formats de code
  let mdxCode: string
  if (typeof code === 'string') {
    mdxCode = code
  } else if (code && typeof code === 'object' && 'raw' in code) {
    mdxCode = code.raw
  } else if (code && typeof code === 'object' && 'code' in code) {
    mdxCode = code.code
  } else {
    console.error('Format de code non supporté:', code)
    return <div>Erreur de rendu du contenu</div>
  }
  
  const Component = useMDXComponent(mdxCode)
  
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Component components={components as any} />
    </div>
  )
}