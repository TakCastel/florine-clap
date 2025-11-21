export function canonical(pathname: string): string | undefined {
  const base = process.env.SITE_URL
  if (!base) return undefined
  if (pathname.startsWith('http')) return pathname
  return `${base}${pathname.startsWith('/') ? '' : '/'}${pathname}`
}


