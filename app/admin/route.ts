import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const htmlPath = join(process.cwd(), 'public', 'admin', 'index.html')
    const htmlContent = readFileSync(htmlPath, 'utf8')
    
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error reading admin HTML:', error)
    return new NextResponse('Admin not found', { status: 404 })
  }
}
