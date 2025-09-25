import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Pas d'authentification basique - Decap CMS gère l'auth via GitHub
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


