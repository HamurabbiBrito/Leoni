'use client'; 
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';
import Image from 'next/image';


// Componente de la página (sin lógica de autenticación)
export function NuevaPagina() {
  return (
    <div>
      <Image 
    src="/images/Logo.png" 
    alt="Logo de la empresa" 
    width={200} 
    height={100} 
  />
      <h1>Bienvenido al sistema de Caseta</h1>
      <p>Selecciona una opción del menú para ver el contenido correspondiente.</p>
    </div>
    
  
  );
}

// Envuelve el componente con el HOC de autenticación
export default withAuth(NuevaPagina, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD, APP_ROLES.RH]);