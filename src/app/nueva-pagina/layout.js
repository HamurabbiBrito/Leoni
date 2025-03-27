"use client"; // Asegúrate de que este archivo se trate como un componente cliente.

import Link from "next/link";
import { useState } from "react";

export default function Layout({ children }) {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false); // Estado para controlar si el menú está colapsado
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // Estado para controlar si el submenú está abierto

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed); // Cambia el estado del menú (colapsado o expandido)
  };

  return (
    <div className="flex h-screen">
      {/* Menú lateral (solo visible en PC) */}
      <div
        className={`lg:block bg-[#07063f] text-white p-4 flex flex-col transition-all duration-300 ease-in-out ${
          isMenuCollapsed ? "w-20" : "w-64" // Ancho reducido cuando está colapsado
        }`}
      >
        {/* Contenedor flexible para el ícono y el texto "Menú" */}
        <div className="flex items-center justify-between mb-8">
          {/* Título del menú (oculto cuando está colapsado) */}
          <h2 className={`text-2xl font-semibold ${isMenuCollapsed ? "hidden" : "block"}`}>
            Menú
          </h2>

          {/* Botón para colapsar/expandir el menú */}
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-gray-700 rounded"
            title={isMenuCollapsed ? "Expandir" : "Colapsar"}
          >
            <svg
              className="swap-off fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 512 512"
            >
              <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
            </svg>
          </button>
        </div>

        {/* Enlaces del menú */}
        <ul className="space-y-4">
          {/* Enlace de Empleados con submenú desplegable al hover */}
          <li
            className="relative"
            onMouseEnter={() => setIsSubMenuOpen(true)} // Abre el submenú al hacer hover
            onMouseLeave={() => setIsSubMenuOpen(false)} // Cierra el submenú al salir del área
          >
            <Link
              href="/nueva-pagina/empleados"
              className={`w-full text-left p-2 hover:bg-gray-600 rounded flex items-center ${
                isMenuCollapsed ? "justify-center" : "justify-start"
              }`}
              title="Empleados"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="w-6 h-6 fill-current text-white"
              >
                <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
              </svg>
              {!isMenuCollapsed && (
                <span className="ml-2">Empleados</span>
              )}
            </Link>

            {/* Submenú desplegable */}
            {isSubMenuOpen && (
              <ul
                className="absolute left-full top-0 ml-2 bg-[#07063f] rounded-lg shadow-lg"
                onMouseEnter={() => setIsSubMenuOpen(true)} // Mantiene el submenú abierto al interactuar con él
                onMouseLeave={() => setIsSubMenuOpen(false)} // Cierra el submenú al salir del área
              >
                <li>
                  <Link
                    href="/nueva-pagina/empleados/lista"
                    className="w-full text-left p-2 hover:bg-gray-600 rounded flex items-center whitespace-nowrap"
                  >
                    Lista de empleados
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nueva-pagina/empleados/en_sa"
                    className="w-full text-left p-2 hover:bg-gray-600 rounded flex items-center whitespace-nowrap"
                  >
                    Consulta E/S
                  </Link>
                </li>

              </ul>
            )}
          </li>

          {/* Otros enlaces del menú */}
          <li>
            <Link
              href="/nueva-pagina/transportes"
              className={`w-full text-left p-2 hover:bg-gray-600 rounded flex items-center ${
                isMenuCollapsed ? "justify-center" : "justify-start"
              }`}
              title="Transportes"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                className="w-6 h-6 fill-current text-white"
              >
                <path d="M48 0C21.5 0 0 21.5 0 48L0 368c0 26.5 21.5 48 48 48l16 0c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L48 0zM416 160l50.7 0L544 237.3l0 18.7-128 0 0-96zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
              {!isMenuCollapsed && (
                <span className="ml-2">Transportes</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/nueva-pagina/maquinaria"
              className={`w-full text-left p-2 hover:bg-gray-600 rounded flex items-center ${
                isMenuCollapsed ? "justify-center" : "justify-start"
              }`}
              title="Máquinaria y equipo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-6 h-6 fill-current text-white"
              >
                <path d="M501.1 395.7L384 278.6c-23.1-23.1-57.6-27.6-85.4-13.9L192 158.1V96L64 0 0 64l96 128h62.1l106.6 106.6c-13.6 27.8-9.2 62.3 13.9 85.4l117.1 117.1c14.6 14.6 38.2 14.6 52.7 0l52.7-52.7c14.5-14.6 14.5-38.2 0-52.7zM331.7 225c28.3 0 54.9 11 74.9 31l19.4 19.4c15.8-6.9 30.8-16.5 43.8-29.5 37.1-37.1 49.7-89.3 37.9-136.7-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3L334 98.9l74.4-74.4c6.6-6.6 3.4-17.9-5.5-20.1-47.4-11.7-99.6.9-136.6 37.9-28.5 28.5-41.9 66.1-41.9 103.7 0 38 14.5 75.9 41.9 103.7 20 20 46.6 31 74.9 31zM64 128c-35.3 0-64-28.7-64-64S28.7 0 64 0s64 28.7 64 64-28.7 64-64 64z" />
              </svg>
              {!isMenuCollapsed && (
                <span className="ml-2">Máquinaria y equipo</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/nueva-pagina/registrar"
              className={`w-full text-left p-2 hover:bg-gray-600 rounded flex items-center ${
                isMenuCollapsed ? "justify-center" : "justify-start"
              }`}
              title="Registrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-6 h-6 fill-current text-white"
              >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              {!isMenuCollapsed && (
                <span className="ml-2">Registrar</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/nueva-pagina/usuario"
              className={`w-full text-left p-2 hover:bg-gray-600 rounded flex items-center ${
                isMenuCollapsed ? "justify-center" : "justify-start"
              }`}
              title="Usuarios"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-6 h-6 fill-current text-white"
              >
                <path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z" />
              </svg>
              {!isMenuCollapsed && (
                <span className="ml-2">Usuarios</span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-8 overflow-y-auto">
        {children} {/* Este es el contenido dinámico que cambiará según la opción seleccionada */}
      </div>
    </div>
  );
}