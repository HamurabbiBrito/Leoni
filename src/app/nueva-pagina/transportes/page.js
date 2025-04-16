'use client';
import { withAuth } from '@/components/auth/withAuth';
import { APP_ROLES } from '@/constants/roles';
import { useState, useEffect } from 'react';
import EntradaModal from './components/modals/EntradaModal';

 function TransportesPage() {
  const [showEntradaModal, setShowEntradaModal] = useState(false);
  const [activeTab, setActiveTab] = useState('entradas');
  const [movimientos, setMovimientos] = useState([]);
  const [filters, setFilters] = useState({
    fecha: '',
    fletera: '',
    operador: '',
    origen: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fletesOptions, setFletesOptions] = useState([]);

  // Fetch inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener transportes
        const transportesRes = await fetch(`/api/nueva-pagina/transportes?tipo=${activeTab}`);
        if (!transportesRes.ok) throw new Error('Error cargando transportes');
        const transportesData = await transportesRes.json();
        
        // Obtener fletes para selects
        const fletesRes = await fetch('/api/nueva-pagina/transportes?fletes=true');
        if (!fletesRes.ok) throw new Error('Error cargando fletes');
        const fletesData = await fletesRes.json();

        setMovimientos(transportesData);
        setFletesOptions(fletesData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredMovimientos = movimientos.filter(mov => {
    const fechaMov = new Date(mov.fecha).toISOString().split('T')[0];
    const fechaFilter = filters.fecha ? new Date(filters.fecha).toISOString().split('T')[0] : '';
    
    return (
      (!filters.fecha || fechaMov === fechaFilter) &&
      mov.fletera.toLowerCase().includes(filters.fletera.toLowerCase()) &&
      mov.operador.toLowerCase().includes(filters.operador.toLowerCase()) &&
      mov.origen.toLowerCase().includes(filters.origen.toLowerCase())
    );
  });

  const handleSaveEntrada = async (formData) => {
    try {
      console.log('Datos enviados desde el formulario:', formData);
  
      const response = await fetch('/api/nueva-pagina/transportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_flete: formData.id_flete,
          operador: formData.operador,
          contenido: formData.contenido,
          tractor: formData.tractor,
          sello: formData.sello
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error guardando entrada');
      }
  
      // Refrescar datos
      const updatedRes = await fetch(`/api/nueva-pagina/transportes?tipo=${activeTab}`);
      const updatedData = await updatedRes.json();
      setMovimientos(updatedData);
      
      setShowEntradaModal(false);
    } catch (err) {
      setError(err.message);
    }
  }; 

  const handleDarSalida = async (folio) => {
    try {
      const response = await fetch('/api/nueva-pagina/transportes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: folio })
      });

      if (!response.ok) throw new Error('Error registrando salida');
      
      // Actualizar lista
      const updatedData = movimientos.map(mov => 
        mov.folio === folio ? { ...mov, estatus: 'Completado' } : mov
      );
      setMovimientos(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Transportes</h2>
          <p className="text-gray-600">{activeTab === 'entradas' ? 'Entradas registradas' : 'Salidas registradas'}</p>
        </div>
        {activeTab === 'entradas' && (
          <button 
            onClick={() => setShowEntradaModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span className="text-xl mr-2">+</span> Nueva Entrada
          </button>
        )}
      </div>

      {/* Pestañas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('entradas')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'entradas' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setActiveTab('salidas')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'salidas' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Salidas
          </button>
        </nav>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={filters.fecha}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fletera</label>
          <input
            type="text"
            name="fletera"
            value={filters.fletera}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operador</label>
          <input
            type="text"
            name="operador"
            value={filters.operador}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
          <input
            type="text"
            name="origen"
            value={filters.origen}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Contenido principal */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Folio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fletera</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tractor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {activeTab === 'entradas' ? 'Sello' : 'Factura'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estatus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovimientos.map((mov) => (
                <tr key={mov.folio} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(mov.fecha).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{mov.folio}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mov.fletera}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mov.origen}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mov.operador}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{mov.tractor}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {activeTab === 'entradas' ? mov.sello : mov.factura}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mov.estatus === 'Activo' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {mov.estatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <div className="flex items-center gap-3">
    {/* Botón Dar Salida - Solo en Entradas cuando está Activo */}
    {activeTab === 'entradas' && mov.estatus === 'Activo' && (
      <button 
        onClick={() => handleDarSalida(mov.folio)}
        className="text-red-600 hover:text-red-900 transition-colors"
        aria-label="Registrar salida"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 640 512"
        >
          <path 
            d="M0 48C0 21.5 21.5 0 48 0L368 0c26.5 0 48 21.5 48 48l0 48 50.7 0c17 0 33.3 6.7 45.3 18.7L589.3 192c12 12 18.7 28.3 18.7 45.3l0 18.7 0 32 0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c0 53-43 96-96 96s-96-43-96-96l-128 0c0 53-43 96-96 96s-96-43-96-96l-16 0c-26.5 0-48-21.5-48-48L0 48zM416 256l128 0 0-18.7L466.7 160 416 160l0 96zM160 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm368-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM257 95c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39L96 168c-13.3 0-24 10.7-24 24s10.7 24 24 24l166.1 0-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9L257 95z"
          />
        </svg>
      </button>
    )}

    {/* Botón Detalles - Solo en Salidas */}
    {activeTab === 'salidas' && (
      <button 
        onClick={() => handleDetalles(mov.folio)}
        className="text-blue-600 hover:text-blue-900 transition-colors"
        aria-label="Ver detalles"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 512 512"
        >
          <path d="M128 0C92.7 0 64 28.7 64 64l0 96 64 0 0-96 226.7 0L384 93.3l0 66.7 64 0 0-66.7c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0L128 0zM384 352l0 32 0 64-256 0 0-64 0-16 0-16 256 0zm64 32l32 0c17.7 0 32-14.3 32-32l0-96c0-35.3-28.7-64-64-64L64 192c-35.3 0-64 28.7-64 64l0 96c0 17.7 14.3 32 32 32l32 0 0 64c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-64zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
        </svg>
      </button>
    )}
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMovimientos.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No se encontraron {activeTab === 'entradas' ? 'entradas' : 'salidas'}
            </div>
          )}
        </div>
      )}

      {/* Modal de Entrada */}
      <EntradaModal
        isOpen={showEntradaModal}
        onClose={() => setShowEntradaModal(false)}
        onSave={handleSaveEntrada}
        fletesOptions={fletesOptions}
      />
    </div>
  );
}

export default withAuth(TransportesPage, [APP_ROLES.ADMIN, APP_ROLES.SEGURIDAD]);