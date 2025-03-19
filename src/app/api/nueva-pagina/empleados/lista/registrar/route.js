import { executeQuery } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, id_area, clasificacion, puesto, estado } = body;

    // Validar campos obligatorios
    if (!nombre || !id_area || !clasificacion || !puesto || !estado) {
      return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Consulta para insertar un nuevo empleado (sin incluir el campo "numero")
    const query = `
      INSERT INTO "Empleados" (nombre, id_area, clasificacion, puesto, estado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await executeQuery(query, [nombre, id_area, clasificacion, puesto, estado]);

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al registrar el empleado' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}