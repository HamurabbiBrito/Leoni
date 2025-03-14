"use client";
import { useEffect, useState } from "react";
import ModalActualizarEmpleado from "./components/modals/modal_mod_info_empleados";

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [registroStatus, setRegistroStatus] = useState("");
  const [brigadaChecked, setBrigadaChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const pageSize = 20; // Define el tamaño de la página

  // Función para abrir el modal con el empleado seleccionado
  const openModal = (empleado) => {
    setSelectedEmpleado(empleado); // Almacena el empleado seleccionado
    setIsModalOpen(true); // Abre el modal
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmpleado(null); // Limpia el empleado seleccionado
  };

  // Obtener los empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await fetch(
          `/api/nueva-pagina/empleados/lista?page=${page}&pageSize=${pageSize}&search=${searchTerm}&registroStatus=${registroStatus}&brigadaChecked=${brigadaChecked}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los empleados");
        }
        const data = await response.json();
        setEmpleados(data.empleados);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEmpleados();
  }, [page, searchTerm, registroStatus, brigadaChecked, pageSize]); // Añade pageSize como dependencia

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>

  {/* Barra de búsqueda y filtros */}
<div className="mb-4 flex justify-between items-center">
  {/* Barra de búsqueda (alineada a la izquierda) */}
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Buscar por número o nombre"
    className="w-48 px-4 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  {/* Filtros (alineados a la derecha) */}
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

    {/* Filtro de brigada como checkbox */}
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

      {/* Tabla de empleados */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto even">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-black">Numero</th>
              <th className="px-4 py-2 text-left text-black">Nombre</th>
              <th className="px-4 py-2 text-left text-black">Estado</th>
              <th className="px-4 py-2 text-left text-black">Brigada</th>
              <th className="px-4 py-2 text-left text-black">Clasificacion</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr
                key={empleado.numero}
                className="border-b odd:bg-white even:bg-gray-300 hover:bg-gray-500 cursor-pointer"
                onClick={() => openModal(empleado)} // Abrir el modal al hacer clic en la fila
              >
                <td className="px-4 py-2 text-black">{empleado.numero}</td>
                <td className="px-4 py-2 text-black">{empleado.nombre}</td>
                <td className="px-4 py-2 text-black">{empleado.estado}</td>
                <td className="px-4 py-2 text-black">{empleado.brigada}</td>
                <td className="px-4 py-2 text-black">{empleado.clasificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 shadow-md cursor-pointer"
          }`}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            page === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 shadow-md cursor-pointer"
          }`}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Actualizar Empleado */}
      {selectedEmpleado && (
        <ModalActualizarEmpleado
          isOpen={isModalOpen}
          onClose={closeModal}
          empleado={selectedEmpleado} // Pasa el empleado seleccionado al modal
        />
      )}
    </div>
  );
}