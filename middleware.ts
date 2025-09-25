import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    // Decap gère l'auth via GitHub/Netlify Identity dans l'UI. Option: Basic Auth via env.
    const user = process.env.BASIC_AUTH_USER
    const pass = process.env.BASIC_AUTH_PASS
    if (user && pass) {
      const header = req.headers.get('authorization')
      if (!header?.startsWith('Basic ')) {
        return new NextResponse('Auth required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' } })
      }
      const [u, p] = Buffer.from(header.split(' ')[1], 'base64').toString().split(':')
      if (u !== user || p !== pass) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}


