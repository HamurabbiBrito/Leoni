// src/app/nueva-pagina/empleados/lista/components/Filtros.js
export default function Filtros({
    searchTerm,
    setSearchTerm,
    registroStatus,
    setRegistroStatus,
    brigadaChecked,
    setBrigadaChecked,
  }) {
    return (
      <div className="mb-4 flex justify-between items-center">
        {/* Barra de búsqueda */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por número o nombre"
          className="w-48 px-4 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
  
        {/* Filtros */}
        <div className="flex space-x-4">
          {/* Filtro de estado del registro */}
          <select
            value={registroStatus}
            onChange={(e) => setRegistroStatus(e.target.value)}
            className="w-30 px-4 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Registro</option>
            <option value="E">Entrada</option>
            <option value="S">Salida</option>
          </select>
  
          {/* Filtro de brigada */}
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={brigadaChecked}
                onChange={(e) => setBrigadaChecked(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600 border-2 border-blue-500 rounded focus:ring-blue-400"
              />
              <span className="text-gray-800">Brigada</span>
            </label>
          </div>
        </div>
      </div>
    );
  }