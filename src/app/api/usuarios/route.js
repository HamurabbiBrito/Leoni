import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM usuarios");

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    // Aquí agregamos más detalles del error
    console.error("Error en la consulta a la base de datos:", error);  // Registra el error completo

    // Devolvemos más detalles en la respuesta para diagnóstico
    return NextResponse.json(
      { error: "Error en la consulta a la base de datos", details: error.message },
      { status: 500 }
    );
  }
}
