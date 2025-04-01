'use client'; // Necesario para usar hooks

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { APP_ROLES } from '@/constants/roles';

export default function Transportes() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Roles permitidos para esta página
    const allowedRoles = [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD];

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && !allowedRoles.includes(session.user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [status, session, router]);

  // Mostrar el spinner mientras NextAuth está verificando la sesión
  if (status !== 'authenticated') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Transportes</h1>
      <p>Contenido relacionado con transportes...</p>
    </div>
  );
}
