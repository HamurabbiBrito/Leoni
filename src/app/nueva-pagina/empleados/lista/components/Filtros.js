import React from 'react';

export default function Filtros({
  searchTerm,
  setSearchTerm,
  registroStatus,
  setRegistroStatus,
  brigadaChecked,
  setBrigadaChecked,
  estadoChecked,
  setEstadoChecked, // Asegúrate de recibir setEstadoChecked como prop
  setPage,
}) {
  // Función para manejar cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    // Resetear la página a 1 cuando se aplica un filtro
    setPage(1);

    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'registroStatus':
        setRegistroStatus(value);
        break;
      case 'brigadaChecked':
        setBrigadaChecked(value);
        break;
      case 'estadoChecked':
        setEstadoChecked(value); // Usar setEstadoChecked aquí
        break;
      default:
        break;
    }
  };

  return (
    <div className="mb-4 flex justify-between items-center">
      {/* Barra de búsqueda por número o nombre (a la izquierda) */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        placeholder="Buscar por número o nombre"
        className="w-64 px-4 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Contenedor para los filtros a la derecha */}
      <div className="flex items-center space-x-4">
        {/* Filtro de estado de registro */}
        <select
          value={registroStatus}
          onChange={(e) => handleFilterChange('registroStatus', e.target.value)}
          className="px-4 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              onChange={(e) => handleFilterChange('brigadaChecked', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 border-2 border-blue-500 rounded focus:ring-blue-400"
            />
            <span className="text-gray-800">Brigada</span>
          </label>
        </div>

        {/* Filtro de estado (Activo o Baja) */}
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={estadoChecked}
              onChange={(e) => handleFilterChange('estadoChecked', e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 border-2 border-blue-500 rounded focus:ring-blue-400"
            />
            <span className="text-gray-800">Activo</span>
          </label>
        </div>
      </div>
    </div>
  );
}