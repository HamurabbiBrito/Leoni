"use client"; // Asegura que el código se ejecute del lado del cliente

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para redirigir después del login

export default function Home() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col w-full md:w-1/2 lg:w-2/5 xl:w-1/3 mx-auto p-8 md:p-10 lg:p-12 xl:p-14 bg-[#07063f] rounded-2xl shadow-xl">
        <div className="flex flex-row gap-3 pb-4">
          <div>
            <img src="/images/leoni-logo.png" alt="Logo" width="125" />
          </div>
          <h1 className="text-2xl font-bold text-[#fefefe] my-auto">Control Caseta</h1>
        </div>
        <div className="text-xs font-light text-[#f2f2f2] pb-8">
          El usuario y contraseña son sensibles a las mayúsculas
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="pb-2">
            <label htmlFor="email" className="block mb-2 text-base font-medium text-[#f0f0f0]">
              Email
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </span>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                placeholder="Nombre de usuario"
                autoComplete="off"
                required
              />
            </div>
          </div>
          <div className="pb-6">
            <label htmlFor="password" className="block mb-2 text-base font-medium text-[#f0f0f0]">
              Password
            </label>
            <div className="relative text-gray-400">
              <span className="absolute inset-y-0 left-0 flex items-center p-1 pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-square-asterisk"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                  <path d="M12 8v8"></path>
                  <path d="m8.5 14 7-4"></path>
                  <path d="m8.5 10 7 4"></path>
                </svg>
              </span>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 mb-2 bg-gray-50 text-gray-600 border focus:border-transparent border-gray-300 sm:text-sm rounded-lg ring-3 ring-transparent focus:ring-1 focus:outline-none focus:ring-gray-400 block w-full p-2.5 rounded-l-lg py-3 px-4"
                placeholder="••••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full text-[#FFFFFF] bg-[#3028bf] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}