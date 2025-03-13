import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // Importar executeQuery

export async function GET(request) {
  try {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const numeroEmpleado = searchParams.get('numero');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const limit = searchParams.get('limit'); // Nuevo parámetro para limitar los resultados

    console.log("Parámetros recibidos en la API:", { numeroEmpleado, fechaInicio, fechaFin, limit }); // Verificar los parámetros

    // Construir la consulta SQL base
    let query = `
      SELECT e.nombre, r.registro, r.fecha, r.clasificacion, r.tipo 
      FROM "RegEmp" r 
      INNER JOIN "Empleados" e ON e.numero = r.numero
    `;
    const params = [];

    // Filtrar por número de empleado si está presente y no está vacío
    if (numeroEmpleado && numeroEmpleado.trim() !== "") {
      query += ' WHERE r.numero = $1';
      params.push(numeroEmpleado);
    }

    // Filtrar por rango de fechas si están presentes
    if (fechaInicio && fechaFin) {
      // Si ya hay un filtro (por ejemplo, número de empleado), usar 'AND'. De lo contrario, usar 'WHERE'.
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ' fecha >= $' + (params.length + 1) + ' AND fecha < $' + (params.length + 2) + '::timestamp + interval \'1 day\''; // Incluir el día final
      params.push(fechaInicio, fechaFin);
    }

    // Ordenar por fecha descendente para obtener los registros más recientes
    query += ' ORDER BY r.fecha DESC';

    // Limitar los resultados si se proporciona el parámetro `limit`
    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }
    // Ejecutar la consulta en la base de datos
    const registros = await executeQuery(query, params);

    // Devolver los registros encontrados
    return NextResponse.json({ registros });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}