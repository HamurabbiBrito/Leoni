// src/app/nueva-pagina/empleados/lista/page.js
"use client";

import { useState } from "react";
import useEmpleados from "./hooks/useEmpleados";
import Filtros from "./components/Filtros";
import TablaEmpleados from "./components/TablaEmpleados";
import Paginacion from "./components/Paginacion";
import ModalModInfoEmpleado from "./components/modals/modal_mod_info_empleados";

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
  } = useEmpleados();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  const openModal = (empleado) => {
    setSelectedEmpleado(empleado);
    setIsModalOpen(true);
  };

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

      <Filtros
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        registroStatus={registroStatus}
        setRegistroStatus={setRegistroStatus}
        brigadaChecked={brigadaChecked}
        setBrigadaChecked={setBrigadaChecked}
      />

      <TablaEmpleados empleados={empleados} openModal={openModal} />

      <Paginacion page={page} totalPages={totalPages} setPage={setPage} />

      {selectedEmpleado && (
        <ModalModInfoEmpleado
          isOpen={isModalOpen}
          onClose={closeModal}
          empleado={selectedEmpleado}
        />
      )}
    </div>
  );
}