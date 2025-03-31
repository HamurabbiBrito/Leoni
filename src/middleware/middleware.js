// middleware.js
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const userRole = req.auth?.user?.role;

  // Rutas públicas
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Si no está autenticado, redirigir a login
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Control de acceso por roles
  const rolePermissions = {
    "/nueva-pagina/empleados": ["Admin", "RH", "Seguridad"],
    "/nueva-pagina/transportes": ["Admin", "Seguridad"],
    "/nueva-pagina/maquinaria": ["Admin", "RH", "Seguridad"],
    "/nueva-pagina/registrar": ["Admin"],
    "/nueva-pagina/usuario": ["Admin"]
  };

  // Verificar permisos para la ruta actual
  for (const [route, allowedRoles] of Object.entries(rolePermissions)) {
    if (pathname.startsWith(route) {
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      break;
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};