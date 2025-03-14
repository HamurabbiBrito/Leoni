import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchEmpleado, registrarChecada } from '../../services/checadaService';

const ModalRegistrarChecada = ({ isOpen, onClose, onChecadaGuardada }) => {
  const [numero, setNumero] = useState("");
  const [empleado, setEmpleado] = useState({
    id: "",
    nombre: "",
    registro: "E",
    clasificacion: "",
    tipo: "",
  });
  const [fechaHora, setFechaHora] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGuardarDisabled, setIsGuardarDisabled] = useState(true);

  const handleFetchEmpleado = async () => {
    if (!numero) return;

    setLoading(true);
    setError("");
    setIsGuardarDisabled(true);

    try {
      const data = await fetchEmpleado(numero);

      if (!data.nombre) {
        setError("No existe un empleado con ese número.");
        setEmpleado({
          id: "",
          nombre: "",
          registro: "E",
          clasificacion: "",
          tipo: "",
        });
        setIsGuardarDisabled(true);
      } else {
        setEmpleado({
          id: data.id || "",
          nombre: data.nombre || "",
          registro: data.registro || "E",
          clasificacion: data.clasificacion || "",
          tipo: data.tipo || "",
        });
        setIsGuardarDisabled(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const obtenerFechaHora = () => {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();
    setFechaHora(`${fecha} ${hora}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleFetchEmpleado();
      obtenerFechaHora();
    }
  };

  const handleNumeroChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNumero(value);
    }
  };

  const handleGuardarChecada = async () => {
    if (!empleado.nombre) {
      setError("El empleado no se encuentra registrado.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ahora = new Date();
      const fechaHoraLocal = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}:${String(ahora.getSeconds()).padStart(2, '0')}`;

      const checadaData = {
        numero: parseInt(numero, 10),
        fechaHora: fechaHoraLocal,
        registro: empleado.registro,
        clasificacion: empleado.clasificacion,
        tipo: empleado.tipo,
      };

      const resultado = await registrarChecada(checadaData);

      // Cerrar el modal después de guardar
      onClose();

      // Llamar a la función para actualizar los registros
      if (onChecadaGuardada) {
        console.log("Llamando a onChecadaGuardada desde el modal"); // Depuración
        onChecadaGuardada();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setNumero("");
      setEmpleado({
        id: "",
        nombre: "",
        registro: "E",
        clasificacion: "",
        tipo: "",
      });
      setFechaHora("");
      setError("");
    }
  }, [isOpen]);

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
        className={`bg-white p-6 rounded-lg w-96 relative z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Registrar Checada</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleGuardarChecada(); }}>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Número</label>
              <input
                type="text"
                value={numero}
                onChange={handleNumeroChange}
                onKeyDown={handleKeyDown}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Número"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={empleado.nombre}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
            <input
              type="text"
              value={fechaHora}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              readOnly
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Registro</label>
              <select
                value={empleado.registro}
                onChange={(e) => setEmpleado({ ...empleado, registro: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                disabled={!empleado.nombre} // Se habilita solo si hay un empleado
              >
                <option value="E">Entrada (E)</option>
                <option value="S">Salida (S)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Clasificación</label>
              <input
                type="text"
                value={empleado.clasificacion}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                readOnly
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              value={empleado.tipo}
              onChange={(e) => setEmpleado({ ...empleado, tipo: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
              disabled={!empleado.nombre} // Se habilita solo si hay un empleado
            >
              <option value="Checada">Checada</option>
              <option value="Sistema">Sistema</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isGuardarDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isGuardarDisabled}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalRegistrarChecada.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChecadaGuardada: PropTypes.func,
};

export default ModalRegistrarChecada;