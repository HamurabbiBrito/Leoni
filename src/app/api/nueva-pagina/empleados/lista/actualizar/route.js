// app/api/nueva-pagina/empleados/lista/actualizar/route.js
import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { registrarBitacora } from '@/lib/bitacora';

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name || 'Sistema';
    const { numero, nombre, id_area, clasificacion, puesto, estado } = await request.json();

    // Validación de campos requeridos
    if (!numero || !id_area || !clasificacion || !puesto || !estado) {
      return new Response(JSON.stringify({
        error: 'Campos requeridos faltantes: numero, id_area, clasificacion, puesto'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await client.query('BEGIN');

    // 0. Obtener datos originales ANTES de la actualización
    const originalQuery = 'SELECT * FROM "Empleados" WHERE numero = $1';
    const originalResult = await client.query(originalQuery, [numero]);
    
    if (originalResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return new Response(JSON.stringify({ error: 'Empleado no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const empleadoOriginal = originalResult.rows[0];

    // 1. Actualizar empleado
    const updateQuery = `
      UPDATE "Empleados"
      SET 
        id_area = $1, 
        clasificacion = $2, 
        puesto = $3,
        estado = $4
      WHERE numero = $5
      RETURNING *`;
    
    const updateResult = await client.query(updateQuery, [
      id_area,
      clasificacion,
      puesto,
      estado,
      numero,
    ]);

    // 2. Determinar cambios
    const empleadoActual = updateResult.rows[0];
    const cambios = {};

    // Comparar cada campo
    if (empleadoOriginal.id_area !== empleadoActual.id_area) {
      cambios.id_area = empleadoActual.id_area;
    }
    if (empleadoOriginal.clasificacion !== empleadoActual.clasificacion) {
      cambios.clasificacion = empleadoActual.clasificacion;
    }
    if (empleadoOriginal.puesto !== empleadoActual.puesto) {
      cambios.puesto = empleadoActual.puesto;
    }
    if (empleadoOriginal.estado !== empleadoActual.estado) { 
      cambios.estado = empleadoActual.estado; 
    }

    // 3. Registrar en bitácora solo si hay cambios
    if (Object.keys(cambios).length > 0) {
      await registrarBitacora(
        client,
        usuario,
        'EMPLEADOS',
        'ACTUALIZAR',
        `Número: ${numero}, Cambios: ${JSON.stringify(cambios)}`
      );
    }

    await client.query('COMMIT');

    return new Response(JSON.stringify(empleadoActual), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en actualización:', error);
    return new Response(JSON.stringify({
      error: 'Error en la actualización',
      detalle: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    client.release();
  }
}