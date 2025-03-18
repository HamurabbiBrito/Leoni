// app/api/nueva-pagina/empleados/actualizar/route.js
import { executeQuery } from '@/lib/db';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { numero, id_area, clasificacion, estado } = body;

    if (!numero || !id_area || !clasificacion || !estado) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Consulta para actualizar el empleado
    const query = `
      UPDATE "Empleados"
      SET id_area = $1, clasificacion = $2, estado = $3
      WHERE numero = $4
      RETURNING *;
    `;
    const result = await executeQuery(query, [id_area, clasificacion, estado, numero]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Empleado no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(result[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al actualizar el empleado' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}