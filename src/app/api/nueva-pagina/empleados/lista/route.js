import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    // Obtener parámetros de búsqueda y filtro
    const search = url.searchParams.get("search") || "";
    const registroStatus = url.searchParams.get("registroStatus") || "";
    const brigadaChecked = url.searchParams.get("brigadaChecked") === "true";
    const estadoChecked = url.searchParams.get("estadoChecked") === "true"; // Nuevo filtro de estado

    // Construir la consulta SQL con filtros
    let query = `
      SELECT "numero", "nombre", "brigada", "estado", "clasificacion", "puesto"
      FROM "Empleados"
      WHERE 1=1
    `;

    const params = [];

    // Filtro de búsqueda por número o nombre
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

    // Filtro de estado: mostrar solo empleados activos si estadoChecked es true
    if (estadoChecked) {
      query += ` AND "estado" = $${params.length + 1}`;
      params.push("Activo");
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