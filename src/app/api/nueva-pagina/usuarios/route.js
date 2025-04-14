// app/api/nueva-pagina/usuarios/route.js
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { registrarBitacora } from '@/lib/bitacora';

export async function GET() {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        u.id_usuario, 
        u.usuario, 
        n.nivel as rol,
        u.id_nivel
      FROM "Usuarios" u
      JOIN "Niveles" n ON u.id_nivel = n.id_nivel
      ORDER BY u.id_usuario asc
    `;
    
    const result = await client.query(query);
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error en GET /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al obtener usuarios", 
      details: error.message 
    }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name || 'Sistema';
    const { usuario: username, password, id_nivel } = await request.json();
    
    // Validaciones
    if (!username || !password || !id_nivel) {
      return new Response(JSON.stringify({ 
        error: "Faltan campos obligatorios" 
      }), { status: 400 });
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ 
        error: "La contraseña debe tener al menos 8 caracteres" 
      }), { status: 400 });
    }

    await client.query('BEGIN');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar usuario
    const insertResult = await client.query(
      `INSERT INTO "Usuarios" (usuario, password, id_nivel) 
       VALUES ($1, $2, $3) 
       RETURNING id_usuario`,
      [username, hashedPassword, id_nivel]
    );

    // Registrar en bitácora
    const id_usuario = insertResult.rows[0].id_usuario;
    await registrarBitacora(
      client,
      usuario,
      'USUARIOS',
      'CREAR',
      `Numero: ${id_usuario}, Nombre: ${username}`
    );

    await client.query('COMMIT');

    return new Response(JSON.stringify({ 
      success: true,
      id_usuario 
    }), { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error en POST /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al crear usuario", 
      details: error.message 
    }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name || 'Sistema';
    const { id_usuario, usuario: username, id_nivel } = await request.json();
    
    // Validación actualizada sin estado
    if (!id_usuario || !username || !id_nivel) {
      return new Response(JSON.stringify({ 
        error: "Datos incompletos para actualización" 
      }), { status: 400 });
    }

    await client.query('BEGIN');

    // Query actualizada sin campo estado
    const updateResult = await client.query(
      `UPDATE "Usuarios"
       SET usuario = $1, id_nivel = $2
       WHERE id_usuario = $3
       RETURNING *`,
      [username, id_nivel, id_usuario]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return new Response(JSON.stringify({ 
        error: "Usuario no encontrado" 
      }), { status: 404 });
    }

    // Bitácora actualizada
    await registrarBitacora(
      client,
      usuario,
      'USUARIOS',
      'ACTUALIZAR',
      `Numero: ${id_usuario}, Nombre: ${username}`
    );

    await client.query('COMMIT');

    return new Response(JSON.stringify(updateResult.rows[0]), { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error en PUT /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al actualizar usuario", 
      details: error.message 
    }), { status: 500 });
  } finally {
    client.release();
  }
}
export async function DELETE(request) {
  const client = await pool.connect();
  try {
    const session = await getServerSession(authOptions);
    const usuario = session?.user?.name || 'Sistema';
    const { id_usuario } = await request.json();
    
    if (!id_usuario) {
      return new Response(JSON.stringify({ 
        error: "Se requiere id_usuario" 
      }), { status: 400 });
    }

    await client.query('BEGIN');

    // Obtener datos antes de eliminar
    const userData = await client.query(
      `SELECT * FROM "Usuarios" WHERE id_usuario = $1`,
      [id_usuario]
    );

    if (userData.rowCount === 0) {
      await client.query('ROLLBACK');
      return new Response(JSON.stringify({ 
        error: "Usuario no encontrado" 
      }), { status: 404 });
    }

    // Eliminar usuario
    await client.query(
      `DELETE FROM "Usuarios" WHERE id_usuario = $1`,
      [id_usuario]
    );

    // Registrar en bitácora
    await registrarBitacora(
      client,
      usuario,
      'USUARIOS',
      'ELIMINAR',
      `ID: ${id_usuario}, Datos: ${JSON.stringify(userData.rows[0])}`
      // `Numero: ${id_usuario}, Nombre: ${username}`
    );

    await client.query('COMMIT');

    return new Response(JSON.stringify({ 
      message: "Usuario eliminado correctamente" 
    }), { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error en DELETE /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al eliminar usuario", 
      details: error.message 
    }), { status: 500 });
  } finally {
    client.release();
  }
}