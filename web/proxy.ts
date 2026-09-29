import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import {
  getSafeRedirectPath,
  isValidSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth'

function isPublicPath(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/onboarding' ||
    pathname === '/login'
  )
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const isAuthenticated = isValidSessionToken(sessionToken)

  if (isPublicPath(pathname)) {
    if (pathname === '/login' && isAuthenticated) {
      const nextPath = getSafeRedirectPath(
        request.nextUrl.searchParams.get('next'),
      )
      return NextResponse.redirect(
        new URL(nextPath === '/login' ? '/' : nextPath, request.url),
      )
    }

    return NextResponse.next()
  }

  if (isAuthenticated) return NextResponse.next()

  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Authentification requise.' },
      { status: 401 },
    )
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'
  loginUrl.search = ''
  loginUrl.searchParams.set('next', `${pathname}${search}`)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    '/((?!_next/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
