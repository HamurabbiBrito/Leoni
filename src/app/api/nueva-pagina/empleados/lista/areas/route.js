// app/api/nueva-pagina/empleados/lista/areas/route.js
import { executeQuery } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const numeroEmpleado = searchParams.get('numero'); // Obtén el número de empleado de la URL

  try {
    // Obtener todas las áreas
    const areasQuery = 'SELECT id_area, area FROM "Areas"';
    const areas = await executeQuery(areasQuery);

    let areaEmpleado = null;

    // Obtener el área actual del empleado (solo si se proporciona un número de empleado)
    if (numeroEmpleado) {
      const empleadoQuery = `
        SELECT a.id_area, a.area 
        FROM "Empleados" e
        INNER JOIN "Areas" a ON e.id_area = a.id_area
        WHERE e.numero = $1;
      `;
      const empleadoArea = await executeQuery(empleadoQuery, [numeroEmpleado]);

      if (empleadoArea.length > 0) {
        areaEmpleado = empleadoArea[0];
      }
    }

    // Devolver todas las áreas y el área actual del empleado (si existe)
    return new Response(
      JSON.stringify({
        areas: areas,
        areaEmpleado: areaEmpleado, // Puede ser null si no se proporciona un número de empleado
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