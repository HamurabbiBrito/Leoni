// app/api/nueva-pagina/empleados/lista/registrar/route.js
import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name || 'Sistema';
    const body = await request.json();
    
    // Validación de campos
    const { nombre, id_area, clasificacion, puesto, estado } = body;
    if (!nombre || !id_area || !clasificacion || !puesto || !estado) {
      return new Response(JSON.stringify({ 
        error: 'Todos los campos son requeridos' 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    await client.query('BEGIN');

    // 1. Insertar empleado
    const empleadoResult = await client.query(
      `INSERT INTO "Empleados" 
      (nombre, id_area, clasificacion, puesto, estado) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING numero`,
      [nombre, id_area, clasificacion, puesto, estado]
    );
    
    // 2. Registrar en bitácora
    const numeroEmpleado = empleadoResult.rows[0].numero;
    await client.query(
      `INSERT INTO "Bitacora" 
      (usuario_app, modulo, accion, detalles, fecha_hora)
      VALUES ($1, $2, $3, $4, NOW())`,
      [
        usuario,
        'EMPLEADOS',
        'CREAR',
        `Numero: ${numeroEmpleado}, Nombre: ${nombre}` 
      ]
    );

    await client.query('COMMIT');

    return new Response(JSON.stringify({ 
      success: true,
      numero: numeroEmpleado 
    }), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en transacción:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Error en el registro',
      detalle: error.message 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } finally {
    client.release();
  }
}