import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { executeQuery } from "@/lib/db";
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          // Validación básica
          if (!credentials?.username || !credentials?.password) {
            console.log("Faltan credenciales");
            return null;
          }

          // Consulta a la base de datos
          const query = `
            SELECT u.id_usuario, u.usuario as username, u.password, n.nivel as role
            FROM "Usuarios" u
            JOIN "Niveles" n ON u.id_nivel = n.id_nivel
            WHERE u.usuario = $1
          `;
          
          const users = await executeQuery(query, [credentials.username.trim()]);
          
          if (users.length === 0) {
            console.log("Usuario no encontrado en DB");
            return null;
          }

          const user = users[0];
          
          // Verificación de contraseña
          console.log("Comparando contraseña...");
          const isValid = await compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log("Contraseña no coincide");
            return null;
          }

          console.log("Autenticación exitosa para:", user.username);
          return {
            id: user.id_usuario.toString(),
            name: user.username,
            email: `${user.username}@tudominio.com`,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error("Error completo en autorización:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 1 día
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };