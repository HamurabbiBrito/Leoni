"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Cambiado a next/navigation
import useRegistros from "./hooks/useRegistros";
import Filtros from "./components/Filtros";
import InfoEmpleado from "./components/InfoEmpleado";
import TablaRegistros from "./components/TablaRegistros";
import ModalRegistrarChecada from "./components/modals/modal_reg_checada";
import { AuthControl } from '@/components/auth/AuthControl';
import { APP_ROLES } from '@/constants/roles';

export default function RegistroEntradasSalidas() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const {
    empleadoNumero,
    setEmpleadoNumero,
    nombreEmpleado,
    registros,
    error,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    habilitarFechas,
    setHabilitarFechas,
    fetchUltimosRegistros,
  } = useRegistros();

  const [isModalRegChecadaOpen, setIsModalRegChecadaOpen] = useState(false);
  const [fotoEmpleado, setFotoEmpleado] = useState("/images/leoni-logo.png");

  // Efecto para marcar cuando el componente está montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Función para obtener la foto del empleado
  const obtenerFotoEmpleado = async (numeroEmpleado) => {
    try {
      const response = await fetch(`/api/test?numeroEmpleado=${numeroEmpleado}`);
      if (!response.ok) {
        throw new Error('Error al obtener la foto');
      }
      const data = await response.json();
      if (data.foto) {
        setFotoEmpleado(data.foto);
      }
    } catch (error) {
      console.error('Error al obtener la foto:', error);
      setFotoEmpleado("/images/leoni-logo.png");
    }
  };

  // Efecto para obtener la foto cuando cambia el número de empleado
  useEffect(() => {
    if (empleadoNumero) {
      obtenerFotoEmpleado(empleadoNumero);
    } else {
      setFotoEmpleado("/images/leoni-logo.png");
    }
  }, [empleadoNumero]);

  const handleFechaChange = (rango) => {
    const startDate = rango.startDate.toISOString().split("T")[0];
    const endDate = rango.endDate.toISOString().split("T")[0];
    setFechaInicio(startDate);
    setFechaFin(endDate);
  };

  const openModalRegChecada = () => setIsModalRegChecadaOpen(true);
  const closeModalRegChecada = () => setIsModalRegChecadaOpen(false);
  const handleChecadaGuardada = () => fetchUltimosRegistros();

  const redirectToRegistrar = () => {
    if (mounted) {
      router.push('./en_sa/checadas');
    }
  };

  // Evitar renderizado hasta que el componente esté montado
  if (!mounted) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Consulta Entradas y Salidas</h1>
        <div className="flex space-x-2">
        <AuthControl allowedRoles={[APP_ROLES.ADMIN,APP_ROLES.SEGURIDAD]}>
        <button
            onClick={openModalRegChecada}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Registrar Checada
          </button>
        
          <button
            onClick={redirectToRegistrar}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Registrar 
          </button>
          </AuthControl>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-6 bg-blue-50 p-6 rounded-lg shadow-md">
          <img
            src={fotoEmpleado}
            alt="Empleado"
            className="w-24 h-24 rounded-lg border-2 border-blue-200 mb-4 md:mb-0"
          />
          <div className="w-full space-y-4">
            <Filtros
              empleadoNumero={empleadoNumero}
              setEmpleadoNumero={setEmpleadoNumero}
              habilitarFechas={habilitarFechas}
              setHabilitarFechas={setHabilitarFechas}
              handleFechaChange={handleFechaChange}
            />
            <InfoEmpleado nombreEmpleado={nombreEmpleado} />
          </div>
        </div>
        <TablaRegistros registros={registros} />
      </div>
      
      <ModalRegistrarChecada
        isOpen={isModalRegChecadaOpen}
        onClose={closeModalRegChecada}
        onChecadaGuardada={handleChecadaGuardada}
      />
    </div>
  );
}