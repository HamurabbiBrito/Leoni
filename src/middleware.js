import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts).*)',
  ],
  runtime: 'experimental-edge'
};

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Rutas públicas
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

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Configuración de permisos
  const rolePermissions = {
    '/nueva-pagina/usuarios': ['admin'],
    '/nueva-pagina/empleados': ['admin', 'rh', 'seguridad'],
    '/nueva-pagina/transportes': ['admin', 'seguridad'],
    '/nueva-pagina/maquinaria': ['admin', 'rh', 'seguridad'],
    '/nueva-pagina/registrar': ['admin'],
    '/nueva-pagina/configuracion': ['admin', 'rh'],
    '/nueva-pagina': ['admin', 'rh'],
    '/dashboard': ['admin', 'rh', 'seguridad']
  };

  for (const [path, allowedRoles] of Object.entries(rolePermissions)) {
    if (pathname.startsWith(path)) {
      if (!allowedRoles.includes(token.role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}