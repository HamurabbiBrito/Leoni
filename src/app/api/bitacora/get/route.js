// app/api/bitacora/get/route.js
import { executeQuery } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de consulta
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;
    const modulo = searchParams.get('modulo');
    const fecha = searchParams.get('fecha');
    const accion = searchParams.get('accion');
    const usuario = searchParams.get('usuario');

    // Construir consulta SQL
    let whereClauses = [];
    let params = [];
    let paramIndex = 1;

    if (modulo && modulo !== 'todos') {
      whereClauses.push(`modulo = $${paramIndex}`);
      params.push(modulo.toUpperCase());
      paramIndex++;
    }

    if (fecha) {
      whereClauses.push(`DATE(fecha_hora) = $${paramIndex}`);
      params.push(fecha);
      paramIndex++;
    }

    if (accion) {
      whereClauses.push(`accion ILIKE $${paramIndex}`);
      params.push(`%${accion}%`);
      paramIndex++;
    }

    if (usuario) {
      whereClauses.push(`usuario_app ILIKE $${paramIndex}`);
      params.push(`%${usuario}%`);
      paramIndex++;
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // Consulta para los registros
    const query = `
      SELECT * FROM "Bitacora"
      ${where}
      ORDER BY fecha_hora DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    // Consulta para el total
    const countQuery = `
      SELECT COUNT(*) as total FROM "Bitacora"
      ${where}
    `;

    params.push(pageSize);
    params.push((page - 1) * pageSize);

    const [registros, total] = await Promise.all([
      executeQuery(query, params),
      executeQuery(countQuery, params.slice(0, -2)) // Excluir parámetros de paginación
    ]);

    return new Response(JSON.stringify({
      registros,
      total: total[0]?.total || 0
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error en API Bitácora:', error);
    return new Response(JSON.stringify({
      error: 'Error al obtener registros de bitácora',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}