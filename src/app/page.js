"use client"; // Asegura que el código se ejecute del lado del cliente

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir después del login
import Image from "next/image";
import Leoni from 'public/Images/leoni-logo.png'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para manejar el mensaje de error
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const router = useRouter(); // Hook de Next.js para manejar la navegación

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    // Validación básica en el cliente
    if (!username || !password) {
      setError("Usuario y contraseña son requeridos");
      return;
    }

    setIsLoading(true); // Activar el estado de carga
    setError(""); // Limpiar errores anteriores

    try {
      // Enviar las credenciales al backend
      const response = await fetch("/api/validar-credenciales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: username, password: password }),
      });

      // Verifica si la respuesta tiene contenido antes de intentar convertirla
      const text = await response.text(); // Obtener la respuesta como texto
      console.log("Respuesta de la API:", text); // Verifica lo que devuelve la API

      // Solo convertir a JSON si la respuesta no está vacía
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text); // Intentamos parsear el texto a JSON
        } catch (error) {
          console.error("Error al parsear JSON:", error);
        }
      }

      // Verifica si la respuesta fue exitosa
      if (response.ok) {
        console.log("Redirigiendo a /nueva-pagina");
        // Si las credenciales son correctas, redirigir al usuario
        router.push("/nueva-pagina"); // Cambia a la URL de la nueva página
      } else {
        console.log("Error en la autenticación");
        // Si las credenciales no son correctas, mostrar el error
        setError(data.error || "Hubo un error al intentar iniciar sesión.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError("Hubo un error al conectar con el servidor.");
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="h-screen place-content-center">  
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="Leoni"
            src={Leoni}
            className="mx-auto h-10 w-auto"
            loading="eager" 
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Caseta
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <div className="text-s font-light text-[#00158a] pb-8">
         
        </div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre de Usuario
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Nombre de usuario"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Iniciar Sesión"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}