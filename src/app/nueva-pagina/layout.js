'use client';

import { SessionProvider } from 'next-auth/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function NuevaPaginaLayout({ children }) {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <SessionProvider>
      <div className="flex flex-col h-screen">
        {/* Barra superior */}
        

        <div className="flex flex-1 overflow-hidden">
          {/* Menú lateral */}
          <aside className={`bg-[#07063f] text-white p-4 flex flex-col transition-all duration-300 ${
            isMenuCollapsed ? 'w-20' : 'w-64'
          }`}>
            <div className="flex items-center justify-between mb-8">
              {!isMenuCollapsed && (
                <h2 className="text-2xl font-semibold">Menú</h2>
              )}
              <button 
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-700 rounded"
                title={isMenuCollapsed ? "Expandir" : "Colapsar"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1">
              <ul className="space-y-2">
                {/* Ítem Empleados */}
                <li className="relative"
                  onMouseEnter={() => setIsSubMenuOpen(true)}
                  onMouseLeave={() => setIsSubMenuOpen(false)}>
                  <Link 
                    href="/nueva-pagina/empleados" 
                    className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                      isMenuCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {!isMenuCollapsed && <span className="ml-3">Empleados</span>}
                  </Link>
                  
                  {isSubMenuOpen && (
                    <ul className="absolute left-full top-0 ml-1 bg-[#07063f] rounded-md shadow-lg py-1 z-10 min-w-[200px]">
                      <li>
                        <Link 
                          href="/nueva-pagina/empleados/lista" 
                          className="block px-4 py-2 hover:bg-gray-700"
                        >
                          Lista de empleados
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/nueva-pagina/empleados/en_sa" 
                          className="block px-4 py-2 hover:bg-gray-700"
                        >
                          Consulta E/S
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Ítem Transportes */}
                <li>
                  <Link 
                    href="/nueva-pagina/transportes" 
                    className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                      isMenuCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
                    </svg>
                    {!isMenuCollapsed && <span className="ml-3">Transportes</span>}
                  </Link>
                </li>

                {/* Ítem Maquinaria */}
                <li>
                  <Link 
                    href="/nueva-pagina/maquinaria" 
                    className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                      isMenuCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.17 3a1 1 0 01.98.8l1.5 8A1 1 0 0112.66 13H9v2h2a1 1 0 110 2H7a1 1 0 110-2h2v-2H7a1 1 0 01-1-1V4a1 1 0 011-1h4.17zM7 5v6h5V5H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {!isMenuCollapsed && <span className="ml-3">Maquinaria y Equipo</span>}
                  </Link>
                </li>

                {/* Ítems solo para admin */}
                {session?.user.role === 'admin' && (
                  <>
                    <li>
                      <Link 
                        href="/nueva-pagina/registrar" 
                        className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                          isMenuCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {!isMenuCollapsed && <span className="ml-3">Registrar</span>}
                      </Link>
                    </li>

                    <li>
                      <Link 
                        href="/nueva-pagina/usuario" 
                        className={`flex items-center p-2 hover:bg-gray-700 rounded ${
                          isMenuCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {!isMenuCollapsed && <span className="ml-3">Usuarios</span>}
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>

            {/* Sección de usuario */}
            {session && (
              <div className={`mt-auto pb-4 ${isMenuCollapsed ? 'text-center' : ''}`}>
                <div className={`flex ${isMenuCollapsed ? 'flex-col items-center' : 'items-center justify-between'}`}>
                  {!isMenuCollapsed && (
                    <div>
                      <p className="font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-300">{session.user.role.toUpperCase()}</p>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`p-2 hover:bg-gray-700 rounded ${
                      isMenuCollapsed ? 'mt-2' : ''
                    }`}
                    title="Cerrar sesión"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                    >
                      <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
                    </svg>
                    {!isMenuCollapsed && (
                      <span className="ml-2 text-sm">Cerrar sesión</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 overflow-y-auto bg-white p-6">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}