'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function withAuth(Component, allowedRoles) {
  return function AuthenticatedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.replace('/login');
        return;
      }

      if (status === 'authenticated') {
        if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
          router.replace('/unauthorized');
          return;
        }
        setIsAuthorized(true);
      }
    }, [status, session, router]);

    if (!isAuthorized || status !== 'authenticated') {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}