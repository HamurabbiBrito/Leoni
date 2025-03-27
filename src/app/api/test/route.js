// app/api/nueva-pagina/empleados/fotos/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const numeroEmpleado = searchParams.get('numeroEmpleado');

  if (!numeroEmpleado) {
    return NextResponse.json(
      { foto: '/images/leoni-logo.png' },
      { status: 200 }
    );
  }

  try {
    const FOTOS_DIR = path.join(process.cwd(), 'public', 'fotos');
    const rutaFoto = path.join(FOTOS_DIR, `${numeroEmpleado}.png`);
    const rutaDefault = path.join(FOTOS_DIR, 'default.png');

    // Verificar si existe la foto específica
    if (fs.existsSync(rutaFoto)) {
      return NextResponse.json({ foto: `/fotos/${numeroEmpleado}.png` });
    }
    
    // Verificar si existe la foto por defecto
    if (fs.existsSync(rutaDefault)) {
      return NextResponse.json({ foto: '/fotos/default.png' });
    }

    // Si no existe ninguna, devolver el logo
    return NextResponse.json({ foto: '/images/leoni-logo.png' });

  } catch (error) {
    console.error('Error en endpoint de fotos:', error);
    return NextResponse.json(
      { foto: '/images/leoni-logo.png' },
      { status: 200 }
    );
  }
}