// app/nueva-pagina/empleados/en-sa/components/Filtros.js
import Checkbox from "./cons_emp/Checkbox";
import Component from "./comp-42"; // Datepicker

export default function Filtros({
  empleadoNumero,
  setEmpleadoNumero,
  habilitarFechas,
  setHabilitarFechas,
  handleFechaChange,
}) {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex items-center w-full md:w-auto">
          <label className="font-semibold text-gray-700 w-40">N° de Empleado:</label>
          <div className="flex items-center flex-1">
            <input
              type="text"
              value={empleadoNumero}
              onChange={(e) => setEmpleadoNumero(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="ml-2 p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
              🔍
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <label className="font-semibold text-gray-700">Habilitar Rango de Fechas:</label>
          <Checkbox checked={habilitarFechas} onChange={(e) => setHabilitarFechas(e.target.checked)} />
        </div>
      </div>
      {habilitarFechas && (
        <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto">
          <label className="font-semibold text-gray-700 w-40 md:w-auto">Período de Búsqueda</label>
          <div className="w-full md:w-auto md:ml-2">
            <Component onDateChange={handleFechaChange} />
          </div>
        </div>
      )}
    </div>
  );
}