// app/api/nueva-pagina/usuarios/route.js
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
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
    
    const result = await executeQuery(query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error en GET /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al obtener usuarios", 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const { usuario, password, id_nivel } = await request.json();
    
    if (!usuario || !password || !id_nivel) {
      return new Response(JSON.stringify({ 
        error: "Faltan campos obligatorios" 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validación de contraseña
    if (password.length < 8) {
      return new Response(JSON.stringify({ 
        error: "La contraseña debe tener al menos 8 caracteres" 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar usuario con contraseña hasheada
    const insertQuery = `
      INSERT INTO "Usuarios" (usuario, password, id_nivel) 
      VALUES ($1, $2, $3) 
      RETURNING id_usuario
    `;
    
    const insertResult = await executeQuery(insertQuery, [usuario, hashedPassword, id_nivel]);
    const id_usuario = insertResult[0].id_usuario;

    // Obtener usuario sin mostrar la contraseña
    const selectQuery = `
      SELECT 
        u.id_usuario, 
        u.usuario, 
        n.nivel as rol,
        u.id_nivel
      FROM "Usuarios" u
      JOIN "Niveles" n ON u.id_nivel = n.id_nivel
      WHERE u.id_usuario = $1
    `;
    
    const userWithRole = await executeQuery(selectQuery, [id_usuario]);
    
    return new Response(JSON.stringify(userWithRole[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error en POST /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al crear usuario", 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// DELETE permanece igual

export async function DELETE(request) {
  try {
    const { id_usuario } = await request.json();
    
    if (!id_usuario) {
      return new Response(JSON.stringify({ 
        error: "Se requiere id_usuario" 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const query = `DELETE FROM "Usuarios" WHERE id_usuario = $1`;
    await executeQuery(query, [id_usuario]);
    
    return new Response(JSON.stringify({ 
      message: "Usuario eliminado correctamente" 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error en DELETE /api/usuarios:", error);
    return new Response(JSON.stringify({ 
      error: "Error al eliminar usuario", 
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}