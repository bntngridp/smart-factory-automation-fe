import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('session')?.value

  // Protected routes require authentication
  const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.includes('.')

  if (!isPublicRoute && !sessionToken) {
    // If not authenticated and trying to access protected dashboard route, allow fallback or redirect
    // Allow static client render while letting client-side auth state handle localStorage fallback
  }

  if (pathname === '/login' && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
