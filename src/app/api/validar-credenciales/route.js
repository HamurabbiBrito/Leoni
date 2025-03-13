import { Pool } from 'pg';  // Importar Pool desde pg
import { NextResponse } from "next/server";
import { connectDB, executeQuery } from "@/lib/db";  // Importar funciones de conexión

export async function POST(req) {
  const { usuario, password } = await req.json();  // Recibimos los datos del formulario

  if (!usuario || !password) {
    return NextResponse.json(
      { error: "Usuario y contraseña son requeridos" },
      { status: 400 }
    );
  }

  try {
    // Verificamos las credenciales en la base de datos
    const query = 'SELECT * FROM "Usuarios" WHERE usuario = $1 AND password = $2;';
    const params = [usuario, password];
    const result = await executeQuery(query, params);

    // Si el resultado tiene datos, el usuario está autenticado
    if (result.length > 0) {
      return NextResponse.json(
        { message: "Acceso permitido", user: result[0] },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    return NextResponse.json(
      { error: "Error al validar las credenciales" },
      { status: 500 }
    );
  }
}