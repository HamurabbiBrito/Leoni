// app/api/nueva-pagina/transportes/route.js
import { pool } from '@/lib/db';

export async function GET(request) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const obtenerFletes = searchParams.get('fletes');

    // Endpoint para obtener fletes
    if (obtenerFletes === 'true') {
      const result = await client.query(`
        SELECT 
          f.id_flete,
          cf.cia AS fletera,
          cdf.nombre_cd AS origen
        FROM "Fletes" f
        INNER JOIN "Cia_flete" cf ON f.id_ciaflt = cf.id_ciaflt
        INNER JOIN "Cdflete" cdf ON f.id_ciudadfl = cdf.id_ciudadfl
        ORDER BY cf.cia ASC
      `);
      
      return new Response(JSON.stringify(result.rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar tipo de consulta
    if (!tipo || !['entradas', 'salidas'].includes(tipo)) {
      return new Response(JSON.stringify({ 
        error: 'Parámetro "tipo" inválido o faltante' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Consulta principal
    const query = `
      SELECT 
        t.id_transporte AS folio,
        cf.cia AS fletera,
        cdf.nombre_cd AS origen,
        t.operador,
        t.tractor,
        t.estatus,
        ${tipo === 'entradas' ? 't.horaentrada' : 't.horasalida'} AS fecha,
        t.contenido,
        t.factura,
        t.sello
      FROM "Transportes" t
      INNER JOIN "Fletes" f ON t.id_flete = f.id_flete
      INNER JOIN "Cia_flete" cf ON f.id_ciaflt = cf.id_ciaflt
      INNER JOIN "Cdflete" cdf ON f.id_ciudadfl = cdf.id_ciudadfl
      WHERE t.estatus = $1
      ORDER BY ${tipo === 'entradas' ? 't.horaentrada' : 't.horasalida'} DESC
    `;

    const estatus = tipo === 'entradas' ? 'Activo' : 'Completado';
    const result = await client.query(query, [estatus]);
    
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en GET:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener datos',
      detalle: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  } finally {
    client.release();
  }
}

export async function POST(request) {
  const client = await pool.connect();
  try {
    const data = await request.json();
    
    // Validación de campos requeridos
    const camposRequeridos = ['id_flete', 'operador', 'tractor'];
    const faltantes = camposRequeridos.filter(campo => !data[campo]);
    
    if (faltantes.length > 0) {
      return new Response(JSON.stringify({ 
        error: 'Campos requeridos faltantes',
        campos: faltantes 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Validar formato numérico del flete
    if (isNaN(data.id_flete)) {
      return new Response(JSON.stringify({ 
        error: 'ID de flete debe ser numérico' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Verificar existencia del flete
    const fleteCheck = await client.query(
      'SELECT id_flete FROM "Fletes" WHERE id_flete = $1',
      [data.id_flete]
    );
    
    if (fleteCheck.rowCount === 0) {
      return new Response(JSON.stringify({ 
        error: 'Flete no encontrado',
        id_flete: data.id_flete 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Insertar nuevo registro
    const result = await client.query(`
      INSERT INTO "Transportes" (
        id_flete, operador, contenido, horaentrada, tractor, sello, estatus
      ) VALUES ($1, $2, $3, NOW(), $4, $5, 'Activo')
      RETURNING *
    `, [
      data.id_flete,
      data.operador,
      data.contenido || null,
      data.tractor,
      data.sello || null
    ]);

    return new Response(JSON.stringify(result.rows[0]), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Error en POST:', error);
    return new Response(JSON.stringify({ 
      error: 'Error interno del servidor',
      detalle: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const { id } = await request.json();
    
    if (!id || isNaN(id)) {
      return new Response(JSON.stringify({ 
        error: 'ID de transporte inválido o faltante' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const result = await client.query(`
      UPDATE "Transportes"
      SET 
        estatus = 'Completado',
        horasalida = NOW()
      WHERE id_transporte = $1
      RETURNING *
    `, [id]);
    
    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ 
        error: 'Registro no encontrado' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error en PUT:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al actualizar',
      detalle: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  } finally {
    client.release();
  }
}