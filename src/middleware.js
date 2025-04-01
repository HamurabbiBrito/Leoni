// src/middleware.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Rutas públicas (accesibles sin autenticación)
  const publicPaths = [
    '/',
    '/login',
    '/unauthorized',
    '/api/auth',
    '/favicon.ico',
    '/_next/static',
    '/_next/image',
    '/images',
    '/icons',
    '/fonts'
  ];

  // Permitir acceso a rutas públicas
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Redirigir a login si no está autenticado
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Definición de permisos por ruta
  const protectedPaths = {
    '/nueva-pagina/usuarios': ['admin'],
    '/nueva-pagina/empleados': ['admin', 'rh', 'seguridad'],
    '/nueva-pagina/transportes': ['admin', 'seguridad'],
    '/nueva-pagina/maquinaria': ['admin', 'rh', 'seguridad'],
    '/nueva-pagina/registrar': ['admin'],
    '/nueva-pagina/configuracion': ['admin', 'rh'],
    '/nueva-pagina': ['admin', 'rh'],
    '/dashboard': ['admin', 'rh', 'seguridad']
  };

  // Verificar permisos para rutas protegidas
  for (const [path, allowedRoles] of Object.entries(protectedPaths)) {
    if (pathname.startsWith(path)) {
      // Verificar si el usuario tiene alguno de los roles permitidos
      const hasPermission = allowedRoles.includes(token.role);
      
      if (!hasPermission) {
        const unauthorizedUrl = new URL('/unauthorized', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
      
      // Si tiene permiso, continuar
      return NextResponse.next();
    }
  }

  // Permitir acceso por defecto a otras rutas autenticadas
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api/ routes
     * - _next/ static files
     * - _next/image images
     * - favicon.ico
     * - public folders
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts).*)',
  ],
};