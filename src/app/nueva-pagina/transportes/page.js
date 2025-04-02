'use client'; 
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';

export function Transportes() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Transportes</h1>
      <p>Contenido relacionado con transportes...</p>
    </div>
  );
}
export default withAuth(Transportes, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD]);