// app/api/nueva-pagina/empleados/lista/areas/route.js
import { executeQuery } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idEmpleado = searchParams.get('numero'); // Obtén el id_empleado de la URL

  if (!idEmpleado) {
    return new Response(JSON.stringify({ error: 'numero de empleado es requerido' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Obtener todas las áreas
    const areasQuery = 'SELECT id_area, area FROM "Areas"';
    const areas = await executeQuery(areasQuery);

    // Obtener el área actual del empleado
    const empleadoQuery = `
      SELECT a.id_area, a.area 
      FROM "Empleados" e
      INNER JOIN "Areas" a ON e.id_area = a.id_area
      WHERE e.id_empleado = $1;
    `;
    const empleadoArea = await executeQuery(empleadoQuery, [idEmpleado]);

    if (empleadoArea.length === 0) {
      return new Response(JSON.stringify({ error: 'Empleado no encontrado' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Devolver todas las áreas y el área actual del empleado
    return new Response(
      JSON.stringify({
        areas: areas,
        areaEmpleado: empleadoArea[0],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener las áreas' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}