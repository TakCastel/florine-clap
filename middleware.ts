import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Laisser passer les fichiers statiques du CMS (config.yml, index.html)
  if (req.nextUrl.pathname === '/admin/config.yml' || 
      req.nextUrl.pathname === '/admin/index.html' ||
      req.nextUrl.pathname === '/admin/') {
    return NextResponse.next()
  }
  
  // Pas d'authentification basique - Decap CMS gère l'auth via GitHub
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


