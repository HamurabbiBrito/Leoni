'use client';
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

export function Bitacora() {
  const { data: session } = useSession();
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [filters, setFilters] = useState({
    fecha: '',
    accion: '',
    usuario: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const fetchRegistros = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/bitacora/get?page=${page}&pageSize=${pageSize}&modulo=${activeTab}&fecha=${filters.fecha}&accion=${filters.accion}&usuario=${filters.usuario}`);
      
      if (!res.ok) throw new Error('Error al obtener registros');
      
      const data = await res.json();
      setRegistros(data.registros);
      setTotalRegistros(data.total);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, [page, activeTab, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const formatFecha = (fecha) => {
    return format(new Date(fecha), "dd 'de' MMMM yyyy HH:mm", { locale: es });
  };

  const countByModule = {
    todos: totalRegistros,
    transportes: registros.filter(r => r.modulo === 'TRANSPORTES').length,
    maquinaria: registros.filter(r => r.modulo === 'MAQUINARIA').length,
    empleados: registros.filter(r => r.modulo === 'EMPLEADOS').length,
    usuarios: registros.filter(r => r.modulo === 'USUARIOS').length
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
    {['todos', 'transportes', 'maquinaria', 'empleados', 'usuarios'].map((tab) => {
      const isActive = activeTab === tab;
      
      // Clases base comunes
      let borderColor = 'border-transparent';
      let textColor = 'text-gray-500';
      let badgeBg = 'bg-gray-100';
      let badgeText = 'text-gray-600';
      
      // Clases cuando está activo
      if (isActive) {
        switch(tab) {
          case 'todos':
            borderColor = 'border-blue-500';
            textColor = 'text-blue-600';
            badgeBg = 'bg-blue-100';
            badgeText = 'text-blue-600';
            break;
          case 'transportes':
            borderColor = 'border-green-500';
            textColor = 'text-green-600';
            badgeBg = 'bg-green-100';
            badgeText = 'text-green-600';
            break;
          case 'maquinaria':
            borderColor = 'border-yellow-500';
            textColor = 'text-yellow-600';
            badgeBg = 'bg-yellow-100';
            badgeText = 'text-yellow-600';
            break;
          case 'empleados':
            borderColor = 'border-purple-500';
            textColor = 'text-purple-600';
            badgeBg = 'bg-purple-100';
            badgeText = 'text-purple-600';
            break;
          case 'usuarios':
            borderColor = 'border-red-500';
            textColor = 'text-red-600';
            badgeBg = 'bg-red-100';
            badgeText = 'text-red-600';
            break;
        }
      }

      return (
        <button
          key={tab}
          onClick={() => {
            setActiveTab(tab);
            setPage(1);
          }}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${borderColor} ${textColor} ${
            !isActive && 'hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      );
    })}
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

      {/* Contador y paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="text-sm text-gray-500">
          Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalRegistros)} de {totalRegistros} registros
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">Página {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * pageSize >= totalRegistros}
            className="px-3 py-1 border bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
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
                <td colSpan={session?.user?.role === 'admin' ? 5 : 4} className="px-6 py-4 text-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={session?.user?.role === 'admin' ? 5 : 4} className="px-6 py-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : registros.length > 0 ? (
              registros.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFecha(registro.fecha_hora)}
                  </td>
                  {session?.user?.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{registro.usuario_app}</div>
                    </td>
                  )}
                  {activeTab === 'todos' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        registro.modulo === 'EMPLEADOS' ? 'bg-purple-100 text-purple-800' :
                        registro.modulo === 'USUARIOS' ? 'bg-red-100 text-red-800' :
                        registro.modulo === 'TRANSPORTES' ? 'bg-green-100 text-green-800' :
                        registro.modulo === 'MAQUINARIA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {registro.modulo}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {registro.accion}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="truncate" title={JSON.stringify(registro.detalles)}>
                      {typeof registro.detalles === 'object' 
                        ? JSON.stringify(registro.detalles)
                        : registro.detalles}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={session?.user?.role === 'admin' ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron registros
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