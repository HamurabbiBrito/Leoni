"use client";

import { useEffect, useState } from "react";
import Component from "@/components/comp-42"; // Datepicker
import Checkbox from "@/components/cons_emp/Checkbox"; // Usa mayúscula
import ModalRegistrarChecada from "@/components/modals/modal_reg_checada";

export default function RegistroEntradasSalidas() {
  const [empleadoNumero, setEmpleadoNumero] = useState(""); // Estado para el número de empleado
  const [nombreEmpleado, setNombreEmpleado] = useState(""); // Estado para el nombre del empleado
  const [registros, setRegistros] = useState([]); // Estado para los registros de la tabla RegEmp
  const [error, setError] = useState(""); // Estado para manejar errores
  const [fechaInicio, setFechaInicio] = useState(null); // Estado para la fecha de inicio
  const [fechaFin, setFechaFin] = useState(null); // Estado para la fecha de fin
  const [habilitarFechas, setHabilitarFechas] = useState(false); // Estado para habilitar/deshabilitar el rango de fechas
  const [isModalRegChecadaOpen, setIsModalRegChecadaOpen] = useState(false);

  // Función para realizar la consulta a la base de datos
  const fetchRegistros = async () => {
    try {
      // Construir la URL de la API con los parámetros de consulta
      let url = `/api/checadas?numero=${empleadoNumero}`;

      // Si el rango de fechas está habilitado y se proporcionan fechas, agregarlas a la URL
      if (habilitarFechas && fechaInicio && fechaFin) {
        url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }
      console.log("URL de la API:", url); // Verificar la URL construida

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al obtener los registros");
      }

      const data = await response.json();
      setRegistros(data.registros); // Actualizar el estado con los registros obtenidos

      // Actualizar el nombre del empleado solo si se consulta por número de empleado
      if (empleadoNumero && data.registros.length > 0) {
        setNombreEmpleado(data.registros[0].nombre);
      } else if (!empleadoNumero) {
        setNombreEmpleado(""); // Limpiar el nombre si no se consulta por número de empleado
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Efecto para cargar los últimos 50 registros al inicio
  useEffect(() => {
    fetchUltimosRegistros();
  }, []);

  // Función para obtener los últimos 50 registros
  const fetchUltimosRegistros = async () => {
    try {
      const url = `/api/checadas?limit=50`; // Nueva ruta para obtener los últimos 50 registros
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al obtener los registros");
      }

      const data = await response.json();
      console.log("Datos obtenidos:", data.registros); // Depuración
      setRegistros(data.registros); // Actualizar el estado con los registros obtenidos
      setNombreEmpleado(""); // Limpiar el nombre del empleado
    } catch (err) {
      setError(err.message);
    }
  };

  // Efecto para realizar la consulta cuando cambia el número de empleado o las fechas
  useEffect(() => {
    console.log("Ejecutando consulta con:", { empleadoNumero, fechaInicio, fechaFin, habilitarFechas }); // Verificar los valores actuales
    if (empleadoNumero || (habilitarFechas && fechaInicio && fechaFin)) {
      fetchRegistros();
    } else {
      fetchUltimosRegistros(); // Si no hay número de empleado ni fechas, mostrar los últimos 50 registros
    }
  }, [empleadoNumero, fechaInicio, fechaFin, habilitarFechas]);

  // Función para manejar cambios en el número de empleado
  const handleEmpleadoNumeroChange = (event) => {
    setEmpleadoNumero(event.target.value);
  };

  // Función para manejar cambios en el rango de fechas
  const handleFechaChange = (rango) => {
    // Convertir las fechas a formato YYYY-MM-DD
    const startDate = rango.startDate.toISOString().split("T")[0];
    const endDate = rango.endDate.toISOString().split("T")[0];

    console.log("Fechas formateadas:", { startDate, endDate }); // Verificar las fechas formateadas

    // Actualizar el estado con las fechas formateadas
    setFechaInicio(startDate);
    setFechaFin(endDate);
  };

  // Función para manejar cambios en el checkbox de habilitar fechas
  const handleHabilitarFechasChange = (event) => {
    setHabilitarFechas(event.target.checked);
    // Si se deshabilita el rango de fechas, limpiar las fechas
    if (!event.target.checked) {
      setFechaInicio(null);
      setFechaFin(null);
    }
  };

  // Función para abrir el modal
  const openModalRegChecada = () => {
    setIsModalRegChecadaOpen(true);
  };

  // Función para cerrar el modal
  const closeModalRegChecada = () => {
    setIsModalRegChecadaOpen(false);
  };

  // Función para actualizar los registros después de guardar una checada
  const handleChecadaGuardada = () => {
    console.log("Actualizando registros después de guardar checada"); // Depuración
    fetchUltimosRegistros(); // Actualizar la lista de registros
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Tabs */}
      <div className="flex justify-between items-center border-b pb-4">
        {/* Título alineado a la izquierda */}
        <h1 className="text-2xl font-bold">Consulta Entradas y Salidas</h1>

        {/* Botón alineado a la derecha y más pequeño */}
        <button
          onClick={openModalRegChecada}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Registrar Checada
        </button>
      </div>

      {/* Contenedor Principal */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        {/* Datos del empleado */}
        <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-6 bg-blue-50 p-6 rounded-lg shadow-md">
          {/* Imagen del empleado */}
          <img
            src="/images/leoni-logo.png"
            alt="Empleado"
            className="w-24 h-24 rounded-lg border-2 border-blue-200 mb-4 md:mb-0"
          />

          {/* Información del empleado */}
          <div className="w-full space-y-4">
            {/* Fila 1: Número de empleado y Datepicker */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              {/* Número de empleado */}
              <div className="flex items-center w-full md:w-auto">
                <label className="font-semibold text-gray-700 w-40">N° de Empleado:</label>
                <div className="flex items-center flex-1">
                  <input
                    type="text"
                    value={empleadoNumero}
                    onChange={handleEmpleadoNumeroChange}
                    className="border border-gray-300 p-2 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="ml-2 p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                    🔍
                  </button>
                </div>
              </div>

              {/* Checkbox para habilitar/deshabilitar el rango de fechas */}
              <div className="flex items-center">
                <label className="font-semibold text-gray-700">Habilitar Rango de Fechas:</label>
                <Checkbox
                  checked={habilitarFechas}
                  onChange={handleHabilitarFechasChange}
                />
              </div>
            </div>

            {/* Fila 2: Datepicker (solo se muestra si el rango de fechas está habilitado) */}
            {habilitarFechas && (
              <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
                <label className="font-semibold text-gray-700 w-40 md:w-auto">Período de Búsqueda</label>
                <div className="w-full md:w-auto md:ml-2">
                  <Component onDateChange={handleFechaChange} /> {/* Datepicker con manejo de fechas */}
                </div>
              </div>
            )}

            {/* Fila 3: Nombre del empleado */}
            <div className="flex items-center">
              <label className="font-semibold text-gray-700 w-40">Nombre:</label>
              <input
                type="text"
                value={nombreEmpleado} // Usar el estado nombreEmpleado
                readOnly
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-6">
          <table className="min-w-full table-auto even">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Registro</th>
                <th className="border p-2">Clasificación</th>
                <th className="border p-2">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {registros.length > 0 ? (
                registros.map((registro, index) => (
                  <tr key={index} className="bg-white text-center">
                    <td className="border p-2">{registro.nombre}</td>
                    <td className="border p-2">{new Date(registro.fecha).toLocaleString()}</td>
                    <td className="border p-2">{registro.registro}</td>
                    <td className="border p-2">{registro.clasificacion}</td>
                    <td className="border p-2">{registro.tipo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal de Registrar Checada */}
      <ModalRegistrarChecada
        isOpen={isModalRegChecadaOpen}
        onClose={closeModalRegChecada}
        onChecadaGuardada={handleChecadaGuardada}
      />
    </div>
  );
}