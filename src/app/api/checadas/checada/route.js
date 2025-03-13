import { executeQuery } from '../../../../lib/db';

export async function POST(request) {
  try {
    const { numero, fechaHora, registro, clasificacion, tipo } = await request.json();

    console.log("Datos recibidos:", { numero, fechaHora, registro, clasificacion, tipo }); // Depuración

    // Convertir `numero` a entero
    const numeroEntero = parseInt(numero, 10);
    if (isNaN(numeroEntero)) {
      return new Response(JSON.stringify({ error: "El número debe ser un valor válido" }), {
        status: 400,
      });
    }

    // Validar `fechaHora`
    if (!Date.parse(fechaHora)) {
      return new Response(JSON.stringify({ error: "La fecha y hora deben ser un valor válido" }), {
        status: 400,
      });
    }

    // Verificar si ya existe un registro con el mismo estado para el empleado
    const queryVerificar = `
      SELECT registro FROM "RegEmp"
      WHERE numero = $1
      ORDER BY fecha DESC
      LIMIT 1;
    `;

    const resultadoVerificacion = await executeQuery(queryVerificar, [
      numeroEntero,
     // registro,
    ]);
    if (resultadoVerificacion.length > 0 && resultadoVerificacion[0].registro == registro) {
     
      return new Response(JSON.stringify({ error: `Ya tienes registrada una ${registro}` }), {
        status: 400,
      });
    }

    // Si no existe, registrar la checada
    const queryInsertar = `
      INSERT INTO "RegEmp" (numero, fecha, registro, clasificacion, tipo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const resultado = await executeQuery(queryInsertar, [
      numeroEntero,
      fechaHora,
      registro,
      clasificacion,
      tipo,
    ]);

    const queryUpdate = `
     UPDATE public."Empleados"SET registro=$1
     	WHERE numero=$2
      RETURNING *;
    `;
    const resultado1 = await executeQuery(queryUpdate, [
      registro,
      numeroEntero,
    ]);

    return new Response(JSON.stringify(resultado[0]), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error al registrar la checada:", error);
    return new Response(JSON.stringify({ error: "Error al registrar la checada" }), {
      status: 500,
    });
  }
}