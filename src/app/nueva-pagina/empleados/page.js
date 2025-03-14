"use client"; // Asegura que el código se ejecute del lado del cliente

import { useEffect, useState } from "react";

export default function Empleados() {
  const [empleadosPlanta, setEmpleadosPlanta] = useState(0);
  const [brigada, setBrigada] = useState(0);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/nueva-pagina/empleados");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const data = await response.json();
      setEmpleadosPlanta(data.empleadosPlanta);
      setBrigada(data.brigada);
      setTotalEmpleados(data.totalEmpleados);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  // Ejecutar la función al cargar el componente
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Empleados</h1>
      <div className="flex justify-center items-start h-screen">
        <div className="flex gap-5 flex-row">
          {/* Tarjeta para empleados en planta */}
          <div className="w-[200px] h-[150px] bg-blue-400 flex flex-col justify-center items-center rounded-lg shadow-lg">
            {/* Número de empleados en planta */}
              <div className="text-4xl font-bold">
                {loading ? "..." : empleadosPlanta}
              </div>
                {/* Texto descriptivo */}
                <p className="text-xl mt-2 text-center">Empleados en planta</p>
              </div>

          {/* Tarjeta para brigada */}
          <div className="w-[200px] h-[150px] bg-amber-400 flex flex-col justify-center items-center rounded-lg shadow-lg ">
            <div className="text-4xl font-bold">
            {loading ? "..." : brigada}
            </div>
            <p className="text-xl mt-2 text-center">Brigada en planta</p>
          </div>

          {/* Tarjeta para total de empleados */}
          <div className="w-[200px] h-[150px] bg-red-400 flex flex-col justify-center items-center rounded-lg shadow-lg ">
            <div className="text-4xl font-bold">
            {loading ? "..." : totalEmpleados}
            </div>
            <p className="text-sm mt-2">Total de empleados</p>
          </div>
        </div>
      </div>
    </div>
  );
}