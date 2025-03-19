import { executeQuery } from "@/lib/db"; // Importar executeQuery desde db.js
import { NextResponse } from "next/server";

// Endpoint para obtener la lista de empleados con paginación y filtros
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    // Obtener parámetros de búsqueda y filtro
    const search = url.searchParams.get("search") || "";
    const registroStatus = url.searchParams.get("registroStatus") || "";
    const brigadaChecked = url.searchParams.get("brigadaChecked") === "true"; // Convertir a booleano

    // Construir la consulta SQL con filtros
    let query = `
      SELECT "numero", "nombre","brigada" ,"estado","clasificacion","puesto"
      FROM "Empleados"
      WHERE 1=1
    `;

    const params = [];

    // Filtro de búsqueda
    if (search) {
      query += ` AND ("numero"::text ILIKE $${params.length + 1} OR "nombre" ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    // Filtro de estado de registro
    if (registroStatus) {
      query += ` AND "registro" = $${params.length + 1}`;
      params.push(registroStatus);
    }

    // Filtro de brigada: solo mostrar empleados que contienen "S" si brigadaChecked es true
    if (brigadaChecked) {
      query += ` AND "brigada" ILIKE $${params.length + 1}`;
      params.push(`%S%`);
    }

    // Obtener el total de empleados después de aplicar los filtros
    const totalQuery = await executeQuery(query, params);
    const totalRecords = totalQuery.length;

    // Calcular el total de páginas
    const totalPages = Math.ceil(totalRecords / pageSize);

    if (totalRecords === 0) {
      return NextResponse.json({ empleados: [], totalPages: 0 });
    }

    // Agregar paginación a la consulta
    query += `
      ORDER BY "numero"
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;
    params.push(pageSize, (page - 1) * pageSize);

    // Realizar la consulta paginada
    const empleadosQuery = await executeQuery(query, params);

    return NextResponse.json({
      empleados: empleadosQuery,
      totalPages,
      totalRecords,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error("❌ Error al obtener empleados:", error);
    return NextResponse.json(
      { error: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Obtener el número del empleado desde el cuerpo de la solicitud
    const { numero } = await req.json();

    console.log("Número recibido:", numero); // Depuración

    if (!numero) {
      return NextResponse.json(
        { error: "El parámetro 'numero' es requerido" },
        { status: 400 }
      );
    }

    // Convertir `numero` a entero si es un número válido
    const numeroEmpleado = Number(numero);
    if (isNaN(numeroEmpleado)) {
      return NextResponse.json(
        { error: "El parámetro 'numero' debe ser un número válido" },
        { status: 400 }
      );
    }

    // Consulta SQL para obtener los datos del empleado
    const query = `
      SELECT
        e.nombre, 
        r.registro, 
        r.clasificacion, 
        r.tipo
      FROM 
        "RegEmp" r
      INNER JOIN 
        "Empleados" e 
      ON 
        e.numero = r.numero
      WHERE 
        r.numero = $1
      ORDER BY 
        r.fecha DESC
      LIMIT 1;
    `;

    // Ejecutar la consulta con el número convertido
    const result = await executeQuery(query, [numeroEmpleado]);

    console.log("Resultado de la consulta:", result); // Depuración

    if (result.length > 0) {
      return NextResponse.json(result[0]); // Devuelve la primera fila (último registro)
    } else {
      return NextResponse.json(
        { error: "No se encontraron datos para el número proporcionado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ Error al obtener los datos del empleado:", error);
    return NextResponse.json(
      { error: `Error interno del servidor: ${error.message}` },
      { status: 500 }
    );
  }
}