// components/auth/require-auth.js
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children, allowedRoles }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
    } else if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized");
    }
  }, [session, status, allowedRoles, router]);

  if (status === "loading" || !session) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <div className="flex justify-center items-center h-screen">No tienes permisos para acceder a esta página</div>;
  }

  return children;
}