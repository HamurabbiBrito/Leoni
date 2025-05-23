// src/providers/SessionProvider.jsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {  // Exportado como default
  return <SessionProvider>{children}</SessionProvider>;
}