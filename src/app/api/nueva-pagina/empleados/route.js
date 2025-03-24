import { executeQuery } from '@/lib/db'; // Importa tu función para ejecutar consultas

export async function GET() {
  try {
    // Consulta para empleados en planta (registro "E")
    const empleadosPlanta = await executeQuery(`
        SELECT COUNT(*) AS count FROM "Empleados"
        WHERE registro = 'E' AND estado = 'Activo'
      `);

    // Consulta para brigada (registro "S")
    const brigada = await executeQuery(
      `SELECT COUNT(*) AS count FROM "Empleados" WHERE registro = 'E' AND estado = 'Activo' AND brigada = 'S'` 
    );

    // Consulta para el total de empleados activos
    const totalEmpleados = await executeQuery(
      `SELECT COUNT(*) AS count FROM "Empleados" WHERE estado = 'Activo'`
    );

    // Devuelve los resultados en formato JSON
    return new Response(JSON.stringify({
      empleadosPlanta: empleadosPlanta[0].count,
      brigada: brigada[0].count,
      totalEmpleados: totalEmpleados[0].count,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return new Response(JSON.stringify({ error: "Error al obtener los datos" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}