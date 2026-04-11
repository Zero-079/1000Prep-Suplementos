// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Rutas que requieren autenticación
 */
const protectedRoutes = ['/cuenta', '/pedidos']

/**
 * Rutas públicas que deben ser accesibles sin autenticación
 */
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/catalogo']

/**
 * Rutas que deben redirigir a vendedores al catálogo
 */
const sellerRedirectRoutes = ['/']

/**
 * Middleware de autenticación server-side
 * - Verifica cookies de autenticación
 * - Protege rutas privadas
 * - Maneja redirect de vendedores
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener tokens de las cookies
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const hasAuth = !!accessToken || !!refreshToken

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  // Verificar si es ruta de API o static
  const isApiRoute = pathname.startsWith('/api/')
  const isStaticFile = pathname.includes('.') && !pathname.startsWith('/api/')

  // Saltar middleware para rutas no relevantes
  if (isApiRoute || isStaticFile || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // 1. Rutas protegidas requieren autenticación
  if (isProtectedRoute && !hasAuth) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Redirigir vendedores desde la raíz
  // Nota: Esto requiere verificar el rol del usuario, que solo está disponible
  // desde el client-side. Para server-side completo, el backend debería
  // devolver un header con el rol o usar un token decodificado.
  // Por ahora, deferimos esta lógica al client-side (AuthContext).

  // 3. Si está autenticado y trata de acceder a login/register, redirigir
  if (hasAuth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

/**
 * Configurar en qué rutas aplica el middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}