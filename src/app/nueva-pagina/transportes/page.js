'use client';
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';
import { useState } from 'react';
import EntradaModal from './components/modals/EntradaModal';
import SalidaModal from './components/modals/SalidaModal';

export function Transportes() {
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [showSalidaModal, setShowSalidaModal] = useState(false);
  const [activeTab, setActiveTab] = useState('entradas'); // 'entradas' o 'salidas'
  
  const [movimientos, setMovimientos] = useState([
    {
      id: 1,
      tipo: 'Entrada',
      fecha: '2023-05-15 08:30',
      folio: 'TR-001',
      fletera: 'Transportes MX',
      operador: 'Juan Pérez',
      origen: 'Monterrey',
      tractor: 'ABC123',
      estatus: 'Activo'
    },
    {
      id: 2,
      tipo: 'Salida',
      fecha: '2023-05-16 14:15',
      folio: 'TR-002',
      fletera: 'Envíos Rápidos',
      operador: 'Carlos López',
      origen: 'Guadalajara',
      tractor: 'XYZ789',
      estatus: 'Completado'
    },
    // Más datos de ejemplo...
  ]);
  
  const [filters, setFilters] = useState({
    fecha: '',
    fletera: '',
    operador: '',
    origen: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Filtrar movimientos según la pestaña activa y los filtros
  const filteredMovimientos = movimientos.filter(mov => {
    // Primero filtramos por tipo (entrada/salida)
    const matchesTab = activeTab === 'entradas' 
      ? mov.tipo === 'Entrada' 
      : mov.tipo === 'Salida';
    
    // Luego aplicamos los demás filtros
    return (
      matchesTab &&
      (filters.fecha === '' || mov.fecha.includes(filters.fecha)) &&
      (filters.fletera === '' || mov.fletera.toLowerCase().includes(filters.fletera.toLowerCase())) &&
      (filters.operador === '' || mov.operador.toLowerCase().includes(filters.operador.toLowerCase())) &&
      (filters.origen === '' || mov.origen.toLowerCase().includes(filters.origen.toLowerCase()))
    );
  });

  const handleSaveEntrada = (data) => {
    const nuevoMovimiento = {
      id: movimientos.length + 1,
      tipo: 'Entrada',
      fecha: new Date().toISOString(),
      folio: data.folio,
      fletera: data.fletera,
      operador: data.operador,
      origen: data.origen,
      tractor: data.tractor,
      estatus: 'Activo'
    };
    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    setShowEntradaModal(false);
  };

  const handleSaveSalida = (data) => {
    const nuevoMovimiento = {
      id: movimientos.length + 1,
      tipo: 'Salida',
      fecha: new Date().toISOString(),
      folio: `SAL-${movimientos.length + 1}`,
      fletera: data.fletera || 'No especificado',
      operador: data.operador || 'No especificado',
      origen: data.origen || 'No especificado',
      tractor: data.tractor || 'No especificado',
      estatus: 'Completado'
    };
    setMovimientos(prev => [nuevoMovimiento, ...prev]);
    setShowSalidaModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Encabezado y botones */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Control de Transportes</h2>
          <p className="text-gray-600">Registro y consulta de movimientos</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {activeTab === 'entradas' && (
            <button 
              onClick={() => setShowEntradaModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <span className="text-lg">+</span>
              <span className="ml-2">Nueva Entrada</span>
            </button>
          )}
          {/* {activeTab === 'salidas' && (
            <button 
              onClick={() => setShowSalidaModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <span className="text-lg">+</span>
              <span className="ml-2">Nueva Salida</span>
            </button>
          )} */}
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
          <label className="block text-sm font-medium text-gray-600 mb-1">Fletera</label>
          <input
            type="text"
            name="fletera"
            value={filters.fletera}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Operador</label>
          <input
            type="text"
            name="operador"
            value={filters.operador}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Origen</label>
          <input
            type="text"
            name="origen"
            value={filters.origen}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fletera</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tractor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovimientos.length > 0 ? (
              filteredMovimientos.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mov.fecha}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mov.folio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.fletera}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.operador}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.origen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mov.tractor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${mov.estatus === 'Activo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {mov.estatus}
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

      {/* Modales */}
      {showEntradaModal && (
        <EntradaModal 
          isOpen={showEntradaModal} 
          onClose={() => setShowEntradaModal(false)}
          onSave={handleSaveEntrada}
        />
      )}
      
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

export default withAuth(Transportes, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD]);