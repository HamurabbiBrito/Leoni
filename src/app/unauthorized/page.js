// app/unauthorized/page.js
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">403 - No Autorizado</h1>
      <p className="mb-6">No tienes permisos para acceder a esta página</p>
      <Link href="/nueva-pagina" className="text-blue-500 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}