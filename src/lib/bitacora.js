// lib/bitacora.js
import { executeQuery } from './db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function registrarBitacora(modulo, accion, ...params) {
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name;
    
    if (!usuario) {
      console.warn('Bitácora: Usuario no autenticado');
      return;
    }

    // Construir string de detalles
    let detalles = '';
    for (let i = 0; i < params.length; i += 2) {
      const clave = params[i];
      const valor = params[i + 1] !== undefined ? params[i + 1] : 'N/A';
      detalles += `${clave}: ${valor}, `;
    }
    
    // Eliminar última coma y espacio
    detalles = detalles.replace(/, $/, '');

    await executeQuery(
      `INSERT INTO "Bitacora" 
      (usuario_app, modulo, accion, detalles, fecha_hora)
      VALUES ($1, $2, $3, $4, NOW())`,
      [usuario, modulo, accion, detalles]
    );
    
  } catch (error) {
    console.error('Error en bitácora:', error);
  }
}