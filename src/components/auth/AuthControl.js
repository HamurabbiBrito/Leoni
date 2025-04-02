'use client';

import { useSession } from 'next-auth/react';

export function AuthControl({ children, allowedRoles }) {
  const { data: session } = useSession();
  
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return null; // O puedes devolver un mensaje o componente alternativo
  }

  return <>{children}</>;
}