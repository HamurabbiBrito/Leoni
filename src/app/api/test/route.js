// app/api/nueva-pagina/empleados/fotos/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

console.log("✅ API Route cargada correctamente"); // Log para depuración

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const numeroEmpleado = searchParams.get('numeroEmpleado');

  console.log("Número de empleado recibido:", numeroEmpleado); // Log para depuración

  if (!numeroEmpleado) {
    return NextResponse.json(
      { error: 'El número de empleado es requerido' },
      { status: 400 }
    );
  }

  try {
    // Ruta de la carpeta donde se almacenan las fotos
    const FOTOS_DIR = path.join(process.cwd(), 'public', 'fotos');

    // Construir la ruta de la foto
    const rutaFoto = path.join(FOTOS_DIR, `${numeroEmpleado}.png`);

    console.log("Ruta de la foto:", rutaFoto); // Log para depuración

    // Verificar si la foto existe
    if (fs.existsSync(rutaFoto)) {
      // Devolver la ruta de la foto (relativa a la carpeta pública)
      return NextResponse.json({ foto: `/fotos/${numeroEmpleado}.png` });
    } else {
      // Si no existe la foto, devolver la foto por defecto
      return NextResponse.json({ foto: '/fotos/default.png' });
    }
  } catch (error) {
    console.error('❌ Error al obtener la foto del empleado:', error);
    return NextResponse.json(
      { error: 'Error al obtener la foto del empleado' },
      { status: 500 }
    );
  }
}