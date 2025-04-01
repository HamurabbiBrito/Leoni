// src/components/TopBar.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="bg-[#07063f] text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <span className="font-semibold text-lg">{session.user.name}</span>
        <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold">
          {session.user.role.toUpperCase()}
        </span>
      </div>
      <button 
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
        Cerrar sesión
      </button>
    </div>
  );
}