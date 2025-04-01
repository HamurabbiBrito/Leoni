'use client'; // Necesario para usar hooks

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { APP_ROLES } from '@/constants/roles';

export default function NuevaPagina() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // No ejecutar redirección hasta que termine de cargar

    // Roles permitidos para esta página
    const allowedRoles = [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD, APP_ROLES.RH];

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && (!session?.user?.role || !allowedRoles.includes(session.user.role))) {
      router.push('/unauthorized');
      return;
    }
  }, [status, session, router]);

  // Mostrar el spinner mientras NextAuth está verificando la sesión
  if (status === 'loading' || status !== 'authenticated') {
    return (
      <div className="flex justify-center items-center h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1>Bienvenido a la nueva pestaña</h1>
      <p>Selecciona una opción del menú para ver el contenido correspondiente.</p>
    </div>
  );
}
