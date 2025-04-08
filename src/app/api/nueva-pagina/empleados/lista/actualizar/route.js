import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { registrarBitacora } from '@/lib/bitacora';

export const runtime = 'nodejs';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name || 'Sistema';

    const body = await request.json();
    const { numero, id_area, clasificacion, puesto, estado } = body;

    // Validación de campos
    if (!numero || !id_area || !clasificacion || !puesto || !estado) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Actualizar empleado
    const query = `
      UPDATE "Empleados"
      SET id_area = $1, clasificacion = $2, puesto = $3, estado = $4
      WHERE numero = $5
      RETURNING *;
    `;
    
    const result = await executeQuery(query, [id_area, clasificacion, puesto, estado, numero]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Empleado no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Registrar en bitácora
    await registrarBitacora('EMPLEADOS', 'ACTUALIZAR', {
      empleado_numero: numero,
      usuario: usuario,
      cambios: {
        id_area: id_area,
        clasificacion: clasificacion,
        puesto: puesto,
        estado: estado
      }
    });

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualizando empleado:', error);
    
    
    return new Response(JSON.stringify({ error: 'Error al actualizar el empleado' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}