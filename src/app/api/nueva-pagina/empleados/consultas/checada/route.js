import { executeQuery } from '../../../../../../lib/db';

export async function POST(request) {
  try {
    const { numero, fechaHora, registro = "E", clasificacion, tipo = "checada" } = await request.json();

    console.log("Datos recibidos:", { numero, fechaHora, registro, clasificacion, tipo });

    // Validación de campos requeridos
    if (!numero || !fechaHora || !clasificacion) {
      return new Response(JSON.stringify({ 
        error: "Faltan campos requeridos",
        detalles: { numero: !numero, fechaHora: !fechaHora, clasificacion: !clasificacion }
      }), { status: 400 });
    }

    // Convertir `numero` a entero
    const numeroEntero = parseInt(numero, 10);
    if (isNaN(numeroEntero)) {
      return new Response(JSON.stringify({ 
        error: "El número debe ser un valor válido",
        valorRecibido: numero
      }), { status: 400 });
    }

    // Validar `fechaHora`
    if (!Date.parse(fechaHora)) {
      return new Response(JSON.stringify({ 
        error: "La fecha y hora deben ser un valor válido",
        valorRecibido: fechaHora
      }), { status: 400 });
    }

    // Verificar si el último registro es IGUAL al que se quiere registrar
    const queryVerificar = `
      SELECT registro FROM "RegEmp"
      WHERE numero = $1
      ORDER BY fecha DESC
      LIMIT 1;
    `;

    const resultadoVerificacion = await executeQuery(queryVerificar, [numeroEntero]);

    // Solo mostrar error si el último registro es igual al que se quiere registrar
    if (resultadoVerificacion.length > 0 && resultadoVerificacion[0].registro === registro) {
      return new Response(JSON.stringify({ 
        error: `Ya tienes registrada una ${registro === 'E' ? 'entrada' : 'salida'}`,
        ultimoRegistro: resultadoVerificacion[0]
      }), { status: 400 });
    }

    // Registrar la checada
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

    // Actualizar estado en Empleados
    const queryUpdate = `
      UPDATE public."Empleados" 
      SET registro = $1
      WHERE numero = $2
      RETURNING *;
    `;

    await executeQuery(queryUpdate, [registro, numeroEntero]);

    return new Response(JSON.stringify({
      success: true,
      registro: resultado[0],
      mensaje: `Registro de ${registro === 'E' ? 'entrada' : 'salida'} exitoso`
    }), { status: 200 });

  } catch (error) {
    console.error("Error completo en API:", error);
    return new Response(JSON.stringify({ 
      error: "Error interno al procesar la solicitud",
      detalles: error.message 
    }), { status: 500 });
  }
}