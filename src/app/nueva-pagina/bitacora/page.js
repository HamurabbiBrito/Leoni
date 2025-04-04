'use client';
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function Bitacora() {
  const { data: session } = useSession();
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos'); // 'todos', 'transportes', 'maquinaria', 'empleados', 'usuarios'
  const [filters, setFilters] = useState({
    fecha: '',
    accion: '',
    usuario: ''
  });

  // Datos de ejemplo
  useEffect(() => {
    const datosEjemplo = [
      {
        id: 1,
        fecha: '2023-06-15 14:30:45',
       // usuario: 'admin@empresa.com',
        nombre: 'Administrador',
        modulo: 'Transportes',
        accion: 'Registró nueva entrada',
        detalles: 'Folio: TR-001, Fletera: Transportes MX'
      },
      {
        id: 2,
        fecha: '2023-06-15 10:15:22',
        // usuario: session?.user?.email,
        nombre: session?.user?.name,
        modulo: 'Maquinaria',
        accion: 'Creó orden de salida',
        detalles: 'No. Salida: MAQ-002, Responsable: Carlos López'
      },
      {
        id: 3,
        fecha: '2023-06-14 16:45:10',
        //usuario: 'rh@empresa.com',
        nombre: 'Recursos Humanos',
        modulo: 'Empleados',
        accion: 'Actualizó información',
        detalles: 'Empleado: Juan Pérez, Campo: Dirección'
      },
      {
        id: 4,
        fecha: '2023-06-14 09:20:33',
       // usuario: session?.user?.email,
        nombre: session?.user?.name,
        modulo: 'Transportes',
        accion: 'Registró salida',
        detalles: 'Folio: TR-005, Operador: María García'
      },
      {
        id: 5,
        fecha: '2023-06-13 11:05:17',
        //usuario: session?.user?.email,
        nombre: session?.user?.name,
        modulo: 'Usuarios',
        accion: 'Cambió permisos',
        detalles: 'Usuario: supervisor@empresa.com, Rol: Supervisor'
      }
    ];
    
    const datosFiltrados = session?.user?.role === 'admin' 
      ? datosEjemplo 
      : datosEjemplo.filter(reg => reg.usuario === session?.user?.email);
    
    setRegistros(datosFiltrados);
    setIsLoading(false);
  }, [session]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filtrar por pestaña activa y otros filtros
  const filteredRegistros = registros.filter(reg => {
    const matchesTab = 
      activeTab === 'todos' || 
      reg.modulo.toLowerCase() === activeTab.toLowerCase();
    
    return (
      matchesTab &&
      (filters.fecha === '' || reg.fecha.includes(filters.fecha)) &&
      (filters.accion === '' || reg.accion.toLowerCase().includes(filters.accion.toLowerCase())) &&
      (filters.usuario === '' || reg.nombre.toLowerCase().includes(filters.usuario.toLowerCase()) || 
                               reg.usuario.toLowerCase().includes(filters.usuario.toLowerCase()))
    );
  });

  // Contar registros por módulo
  const countByModule = {
    todos: registros.length,
    transportes: registros.filter(r => r.modulo === 'Transportes').length,
    maquinaria: registros.filter(r => r.modulo === 'Maquinaria').length,
    empleados: registros.filter(r => r.modulo === 'Empleados').length,
    usuarios: registros.filter(r => r.modulo === 'Usuarios').length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bitácora de Actividades</h2>
          <p className="text-gray-600">
            {session?.user?.role === 'admin' 
              ? 'Registro completo de actividades del sistema' 
              : 'Tus últimos movimientos en el sistema'}
          </p>
        </div>
      </div>

      {/* Pestañas de módulos */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('todos')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'todos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Todos
          </button>
          
          <button
            onClick={() => setActiveTab('transportes')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'transportes'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transportes          
          </button>
          
          <button
            onClick={() => setActiveTab('maquinaria')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'maquinaria'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Maquinaria
          </button>
          
          <button
            onClick={() => setActiveTab('empleados')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'empleados'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Empleados
          </button>
          
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'usuarios'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usuarios
          </button>
        </nav>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={filters.fecha}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Acción</label>
          <input
            type="text"
            name="accion"
            value={filters.accion}
            onChange={handleFilterChange}
            placeholder="Buscar acción..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        {session?.user?.role === 'admin' && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={filters.usuario}
              onChange={handleFilterChange}
              placeholder="Filtrar por usuario..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>

      {/* Contador de registros */}
      <div className="mb-4 text-sm text-gray-500">
        Mostrando {filteredRegistros.length} registros de {activeTab === 'todos' ? 'todos los módulos' : activeTab}
      </div>

      {/* Tabla de registros */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
              {session?.user?.role === 'admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              )}
              {activeTab === 'todos' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Módulo</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={session?.user?.role === 'admin' ? (activeTab === 'todos' ? 5 : 4) : (activeTab === 'todos' ? 4 : 3)} className="px-6 py-4 text-center">
                  Cargando registros...
                </td>
              </tr>
            ) : filteredRegistros.length > 0 ? (
              filteredRegistros.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registro.fecha}
                  </td>
                  {session?.user?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{registro.nombre}</div>
                      <div className="text-gray-500 text-xs">{registro.usuario}</div>
                    </td>
                  )}
                  {activeTab === 'todos' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {registro.modulo}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registro.accion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate" title={registro.detalles}>
                      {registro.detalles}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={session?.user?.role === 'admin' ? (activeTab === 'todos' ? 5 : 4) : (activeTab === 'todos' ? 4 : 3)} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron registros {activeTab === 'todos' ? '' : `en ${activeTab}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(Bitacora, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD]);