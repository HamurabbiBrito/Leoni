import React, { useState, useEffect } from 'react';

const ModalActualizarEmpleado = ({ isOpen, onClose, empleado }) => {
  // Verifica si el empleado es null antes de acceder a sus propiedades
  const [area, setArea] = useState(empleado ? empleado.area : '');
  const [clasificacion, setClasificacion] = useState(empleado ? empleado.clasificacion : '');
  const [puesto, setPuesto] = useState(empleado ? empleado.puesto : '');
  const [accesoRestringido, setAccesoRestringido] = useState(false);
  const [darDeBaja, setDarDeBaja] = useState(false);

  useEffect(() => {
    if (isOpen && empleado) {
      setArea(empleado.area);
      setClasificacion(empleado.clasificacion);
      setPuesto(empleado.puesto);
      setAccesoRestringido(false);
      setDarDeBaja(false);
    }
  }, [isOpen, empleado]);

  // Si no hay empleado seleccionado, no renderices el modal
  if (!empleado) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      ></div>
      <div
        className={`bg-white p-6 rounded-lg w-[800px] relative z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-6">Actualizar Información</h2>
        <div className="flex gap-8">
          {/* Columna izquierda: Imagen y campos de solo lectura */}
          <div className="w-1/2">
            <div className="mb-6 flex justify-center">
              {/* <img src={empleado.imagen} alt="Empleado" className="w-24 h-24 rounded-md" /> */}
              <img
                src="/images/logo.png"
                alt="Empleado"
                className="w-32 h-32 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Número de empleado</label>
              <input
                type="text"
                value={empleado.numero}
                disabled
                className="w-full p-2 border rounded bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={empleado.nombre}
                disabled
                className="w-full p-3 border rounded bg-gray-200" // Más alto el input
              />
            </div>
          </div>

          {/* Columna derecha: Campos editables y botones */}
          <div className="w-1/2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Área</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Administración">Administración</option>
                <option value="Producción">Producción</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Clasificación</label>
              <select
                value={clasificacion}
                onChange={(e) => setClasificacion(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Puesto</label>
              <select
                value={puesto}
                onChange={(e) => setPuesto(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Supervisor">Supervisor</option>
                <option value="Operador">Operador</option>
                <option value="Gerente">Gerente</option>
              </select>
            </div>
            <div className="mb-4 flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accesoRestringido}
                  onChange={(e) => setAccesoRestringido(e.target.checked)}
                  className="mr-2"
                />
                Acceso Restringido
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={darDeBaja}
                  onChange={(e) => setDarDeBaja(e.target.checked)}
                  className="mr-2"
                />
                Dar de Baja
              </label>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end mt-6">
          <button
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalActualizarEmpleado;