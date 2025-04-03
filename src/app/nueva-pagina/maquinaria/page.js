'use client';
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';
import { useState } from 'react';
// import EntradaModal from './components/modals/EntradaModal';
// import SalidaModal from './components/modals/SalidaModal';

export function Maquinaria() {
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showSalidaModal, setShowSalidaModal] = useState(false);
  const [activeTab, setActiveTab] = useState('salidas'); // 'entradas' o 'salidas'
  
  // Datos de ejemplo
  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      tipo: 'Salida',
      fecha: '2023-05-15',
      noSalida: 'MAQ-001',
      responsable: 'Juan Pérez',
      departamento: 'Mantenimiento',
      destino: 'Obra Norte',
      autoriza: 'Ing. Rodríguez',
      detalles: [
        {
          partida: '001',
          cantidad: 2,
          descripcion: 'Martillo neumático',
          modelo: 'MN-2000',
          serie: 'SN12345',
          motivo: 'Mantenimiento preventivo'
        }
      ]
    },
    {
      id: 2,
      tipo: 'Salida',
      fecha: '2023-05-18',
      noSalida: 'MAQ-002',
      responsable: 'Carlos López',
      departamento: 'Construcción',
      destino: 'Obra Sur',
      autoriza: 'Arq. Martínez',
      detalles: [
        {
          partida: '002',
          cantidad: 1,
          descripcion: 'Compactadora',
          modelo: 'CP-500',
          serie: 'SN67890',
          motivo: 'Uso en obra'
        }
      ]
    }
  ]);
  
  const [filters, setFilters] = useState({
    fecha: '',
    responsable: '',
    departamento: '',
    destino: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filtrar movimientos
  const filteredMovimientos = movimientos.filter(mov => {
    return (
      (filters.fecha === '' || mov.fecha.includes(filters.fecha)) &&
      (filters.responsable === '' || mov.responsable.toLowerCase().includes(filters.responsable.toLowerCase())) &&
      (filters.departamento === '' || mov.departamento.toLowerCase().includes(filters.departamento.toLowerCase())) &&
      (filters.destino === '' || mov.destino.toLowerCase().includes(filters.destino.toLowerCase()))
    );
  });

  const handleSaveSalida = (data) => {
    const nuevoMovimiento = {
      id: movimientos.length + 1,
      tipo: 'Salida',
      fecha: new Date().toISOString().split('T')[0],
      noSalida: `MAQ-${movimientos.length + 1}`,
      responsable: data.responsable,
      departamento: data.departamento,
      destino: data.destino,
      autoriza: data.autoriza,
      detalles: data.detalles,
      estatus: 'Activo'
    };
    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    setShowSalidaModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Encabezado y botones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Control de Maquinaria y Equipo</h2>
          <p className="text-gray-600">Registro y consulta de movimientos</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {activeTab === 'salidas' && (
            <button 
              onClick={() => setShowSalidaModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <span className="text-lg">+</span>
              <span className="ml-2">Nueva Salida</span>
            </button>
          )}
        </div>
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('entradas')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'entradas'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setActiveTab('salidas')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'salidas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Salidas
          </button>
        </nav>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <label className="block text-sm font-medium text-gray-600 mb-1">Responsable</label>
          <input
            type="text"
            name="responsable"
            value={filters.responsable}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Departamento</label>
          <input
            type="text"
            name="departamento"
            value={filters.departamento}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Destino</label>
          <input
            type="text"
            name="destino"
            value={filters.destino}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Contador de registros */}
      <div className="mb-4 text-sm text-gray-500">
        Mostrando {filteredMovimientos.length} {activeTab === 'entradas' ? 'entradas' : 'salidas'}
      </div>

      {/* Tabla de movimientos */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autoriza</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovimientos.length > 0 ? (
              filteredMovimientos.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mov.noSalida}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mov.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.responsable}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.departamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.destino}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.autoriza}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${mov.estatus === 'Activo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {mov.estatus || 'Activo'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay {activeTab === 'entradas' ? 'entradas' : 'salidas'} registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Salida */}
      {showSalidaModal && (
        <SalidaModal 
          isOpen={showSalidaModal}
          onClose={() => setShowSalidaModal(false)} 
          onSave={handleSaveSalida} 
        />
      )}
    </div>
  );
}

export default withAuth(Maquinaria, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD, APP_ROLES.RH]);