import { useState, useEffect } from 'react';

const EntradaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id_flete: '', // Mantener como string para el select
    operador: '',
    contenido: '',
    tractor: '',
    sello: ''
  });

  const [fletesOptions, setFletesOptions] = useState([]);

  // Obtener fletes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const fetchFletes = async () => {
        try {
          const response = await fetch('/api/nueva-pagina/transportes?fletes=true');
          const data = await response.json();
          setFletesOptions(data);
        } catch (error) {
          console.error('Error al obtener fletes:', error);
        }
      };
      fetchFletes();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que se haya seleccionado un flete
    if (!formData.id_flete) {
      alert('Por favor seleccione una fletera');
      return;
    }

    // Convertir id_flete a número
    const dataToSend = {
      ...formData,
      id_flete: parseInt(formData.id_flete, 10)
    };
    
    onSave(dataToSend);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      ></div>

      {/* Contenido del modal */}
      <div
        className={`bg-white p-6 rounded-lg w-full max-w-2xl relative z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Registro de Entrada de Transporte</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Selector de Fletera - Corregido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fletera/Origen</label>
                <select
                  name="id_flete"
                  value={formData.id_flete}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar fletera</option>
                  {fletesOptions.map(flete => (
                    <option 
                      key={flete.id_flete} 
                      value={flete.id_flete} // Valor numérico convertido a string
                    >
                      {flete.fletera} - {flete.origen}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Resto de campos... */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operador</label>
                <input
                  type="text"
                  name="operador"
                  value={formData.operador}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tractor</label>
                <input
                  type="text"
                  name="tractor"
                  value={formData.tractor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sello</label>
                <input
                  type="text"
                  name="sello"
                  value={formData.sello}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <input
                  type="text"
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Registrar Entrada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntradaModal;