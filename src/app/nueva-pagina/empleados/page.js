// app/nueva-pagina/empleados/page.js
"use client";

import useEmpleados from "./hooks/useEmpleados";
import ContadorEmpleados from "./components/ContadorEmpleados";

export default function Empleados() {
  const { empleadosPlanta, brigada, totalEmpleados, loading } = useEmpleados();

  return (
    <div>
      <h1 className="text-3xl font-bold">Empleados</h1>
      <div className="flex justify-center items-start h-screen">
        <ContadorEmpleados
          empleadosPlanta={empleadosPlanta}
          brigada={brigada}
          totalEmpleados={totalEmpleados}
          loading={loading}
        />
      </div>
    </div>
  );
}