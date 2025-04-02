// src/app/maquinaria/page.js
'use client'; // Necesario para usar hooks

import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';


function  Maquinaria() {
    return (
      <div>
        <h1 className="text-3xl font-bold">Maquinaria y Equipo</h1>
        <p>Contenido relacionado con maquinaria y equipo...</p>
      </div>
    );
  }
  export default withAuth(Maquinaria, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD, APP_ROLES.RH]);