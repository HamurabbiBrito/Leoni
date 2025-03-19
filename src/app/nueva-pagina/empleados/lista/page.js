// src/app/nueva-pagina/empleados/lista/page.js
"use client";

import { useState } from "react";
import useEmpleados from "./hooks/useEmpleados";
import Filtros from "./components/Filtros";
import TablaEmpleados from "./components/TablaEmpleados";
import Paginacion from "./components/Paginacion";
import ModalModInfoEmpleado from "./components/modals/modal_mod_info_empleados";
import MensajeCard from "@/components/MensajeCard"; // Importar MensajeCard

export default function Empleados() {
  const {
    empleados,
    error,
    page,
    totalPages,
    searchTerm,
    setSearchTerm,
    registroStatus,
    setRegistroStatus,
    brigadaChecked,
    setBrigadaChecked,
    setPage,
    fetchEmpleados, // Usar fetchEmpleados del hook
  } = useEmpleados();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [mensajeGlobal, setMensajeGlobal] = useState(null); // Estado para el mensaje global
  const [modoModal, setModoModal] = useState("actualizar"); // Modo del modal: 'actualizar' o 'registrar'

  // Abrir el modal en modo "actualizar"
  const openModalActualizar = (empleado) => {
    setSelectedEmpleado(empleado);
    setModoModal("actualizar");
    setIsModalOpen(true);
  };

  // Abrir el modal en modo "registrar"
  const openModalRegistrar = () => {
    setSelectedEmpleado(null); // No hay empleado seleccionado
    setModoModal("registrar");
    setIsModalOpen(true);
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmpleado(null);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Empleados</h1>

      {/* Botón para abrir el modal en modo "registrar" */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={openModalRegistrar}
      >
        Registrar Nuevo Empleado
      </button>

      <Filtros
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        registroStatus={registroStatus}
        setRegistroStatus={setRegistroStatus}
        brigadaChecked={brigadaChecked}
        setBrigadaChecked={setBrigadaChecked}
      />

      <TablaEmpleados empleados={empleados} openModal={openModalActualizar} />

      <Paginacion page={page} totalPages={totalPages} setPage={setPage} />

      {/* Modal para actualizar o registrar empleados */}
      <ModalModInfoEmpleado
        isOpen={isModalOpen}
        onClose={closeModal}
        empleado={selectedEmpleado} // Pasar el empleado seleccionado (solo en modo actualizar)
        onUpdate={fetchEmpleados} // Función para actualizar la lista de empleados
        setMensajeGlobal={setMensajeGlobal} // Función para mostrar mensajes globales
        modo={modoModal} // Modo del modal: 'actualizar' o 'registrar'
      />

      {/* Mostrar MensajeCard como mensaje global */}
      {mensajeGlobal && (
        <MensajeCard
          tipo={mensajeGlobal.tipo}
          mensaje={mensajeGlobal.mensaje}
          onCerrar={() => setMensajeGlobal(null)}
          esGlobal={true}
        />
      )}
    </div>
  );
}