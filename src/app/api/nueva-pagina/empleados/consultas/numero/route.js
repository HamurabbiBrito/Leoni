import { executeQuery } from '../../../../../../lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const numero = searchParams.get('numero');

  if (!numero) {
    return new Response(JSON.stringify({ error: "El número es requerido" }), {
      status: 400,
    });
  }

  try {
    const query = `
      SELECT 
          "Empleados".nombre,
          "Empleados".clasificacion,
          "Empleados".puesto,
          "RegEmp".registro,
          "RegEmp".tipo
      FROM "Empleados"
      LEFT JOIN "RegEmp" ON "Empleados".numero = "RegEmp".numero
      WHERE "Empleados".numero = $1
      ORDER BY "RegEmp".fecha DESC
      LIMIT 1;
    `;

    const result = await executeQuery(query, [numero]);

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Empleado no encontrado" }), {
        status: 404,
      });
    }

    // Si no hay registros en "RegEmp", los campos relacionados serán null
    const empleado = {
      nombre: result[0].nombre,
      clasificacion: result[0].clasificacion,
      puesto: result[0].puesto,
      registro: result[0].registro || null, // Si no hay registro, será null
      tipo: result[0].tipo || 'Checada', // Si no hay tipo, será null
    };

    return new Response(JSON.stringify(empleado), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al buscar el empleado:", error);
    return new Response(JSON.stringify({ error: "Error al buscar el empleado" }), {
      status: 500,
    });
  }
}