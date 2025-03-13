import { executeQuery } from '../../../../lib/db';

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
          "RegEmp".registro,
          "Empleados".clasificacion,
          "RegEmp".tipo
      FROM "Empleados"
      INNER JOIN "RegEmp" ON "Empleados".numero = "RegEmp".numero
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

    return new Response(JSON.stringify(result[0]), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al buscar el empleado:", error);
    return new Response(JSON.stringify({ error: "Error al buscar el empleado" }), {
      status: 500,
    });
  }
}