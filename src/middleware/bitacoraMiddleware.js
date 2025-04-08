import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/api/nueva-pagina/:path*',
    '/api/usuarios/:path*',
    '/api/transportes/:path*'
  ],
  runtime: 'experimental-edge'
};

export default async function middleware(request) {
  const response = NextResponse.next();
  const { pathname, method } = request.nextUrl;

  try {
    if (pathname.startsWith('/api/nueva-pagina')) {
      const body = await request.clone().json().catch(() => ({}));
      
      response.waitUntil((async () => {
        if (response.status >= 200 && response.status < 300) {
          const modulo = pathname.split('/')[3];
          await fetch(`${request.nextUrl.origin}/api/bitacora`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': request.headers.get('Authorization') || ''
            },
            body: JSON.stringify({
              modulo: modulo.toUpperCase(),
              accion: method,
              detalles: {
                endpoint: pathname,
                ...(Object.keys(body).length > 0 && { body })
              }
            })
          });
        }
      })());
    }
  } catch (error) {
    console.error('Error en middleware:', error);
  }

  return response;
}