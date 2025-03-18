// src/app/api/nueva-pagina/empleados/consultas/modinfo/area/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db"; // Importa executeQuery en lugar de pool

export async function GET() {
  try {
    // Consulta las áreas desde la base de datos usando executeQuery
    const areas = await executeQuery(`SELECT id_area, area FROM "Areas"`);

    // Devuelve la lista de áreas
    return NextResponse.json({ areas }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las áreas:", error);
    return NextResponse.json(
      { error: "Error al obtener las áreas" },
      { status: 500 }
    );
  }
}