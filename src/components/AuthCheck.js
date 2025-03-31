// components/AuthCheck.js
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCheck({ allowedRoles, children, loadingComponent }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated' || 
        (status === 'authenticated' && !allowedRoles.includes(session.user.role))) {
      router.push('/unauthorized');
    }
  }, [status, session, allowedRoles, router]);

  if (status === 'loading') {
    return loadingComponent || (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'authenticated' && allowedRoles.includes(session.user.role)) {
    return children;
  }

  return null;
}