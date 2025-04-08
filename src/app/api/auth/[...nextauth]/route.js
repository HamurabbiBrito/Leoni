// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { executeQuery } from "@/lib/db";
import { compare } from 'bcryptjs';
import { APP_ROLES, NIVEL_A_ROL } from "@/constants/roles"; // Importación corregida

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username?.trim() || !credentials?.password) {
            console.error("[AUTH] Credenciales incompletas");
            return null;
          }

          const query = `SELECT u.id_usuario, u.usuario, u.password, u.id_nivel, n.nivel as nombre_nivel 
                         FROM "Usuarios" u JOIN "Niveles" n ON u.id_nivel = n.id_nivel 
                         WHERE u.usuario = $1 LIMIT 1`;
          
          const result = await executeQuery(query, [credentials.username.trim()]);
          
          if (result.length === 0) {
            console.error("[AUTH] Usuario no encontrado");
            return null;
          }

          const user = result[0];
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            console.error("[AUTH] Contraseña incorrecta");
            return null;
          }

          const userRole = NIVEL_A_ROL[user.id_nivel] || APP_ROLES.USER;
          
          return {
            id: user.id_usuario.toString(),
            name: user.usuario,
            role: userRole,
            nivel: user.nombre_nivel,
            id_nivel: user.id_nivel
          };
        } catch (error) {
          console.error("[AUTH] Error en autorización:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persistir datos en el token JWT
      if (user) {
        token.role = user.role;
        token.id_nivel = user.id_nivel;
        token.nivel = user.nivel;
      }
      return token;
    },
    async session({ session, token }) {
      // Hacer los datos disponibles en la sesión del cliente
      session.user.role = token.role;
      session.user.id_nivel = token.id_nivel;
      session.user.nivel = token.nivel;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
    unauthorized: "/unauthorized"
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas de sesión
    updateAge: 2 * 60 * 60 // Actualizar cada 2 horas
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.log(code, metadata);
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };