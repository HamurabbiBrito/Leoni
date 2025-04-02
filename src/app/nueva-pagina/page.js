'use client'; 
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';

// Componente de la página (sin lógica de autenticación)
export function NuevaPagina() {
  return (
    <div>
      <h1>Bienvenido a la nueva pestaña</h1>
      <p>Selecciona una opción del menú para ver el contenido correspondiente.</p>
    </div>
  );
}

// Envuelve el componente con el HOC de autenticación
export default withAuth(NuevaPagina, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD, APP_ROLES.RH]);