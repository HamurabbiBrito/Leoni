// app/nueva-pagina/empleados/components/ContadorEmpleados.js
import TarjetaEmpleados from "./TarjetaEmpleados";

export default function ContadorEmpleados({ empleadosPlanta, brigada, totalEmpleados, loading }) {
  return (
    <div className="flex gap-5 flex-row">
      <TarjetaEmpleados
        valor={loading ? "..." : empleadosPlanta}
        texto="Empleados en planta"
        color="bg-blue-400"
      />
      <TarjetaEmpleados
        valor={loading ? "..." : brigada}
        texto="Brigada en planta"
        color="bg-amber-400"
      />
      <TarjetaEmpleados
        valor={loading ? "..." : totalEmpleados}
        texto="Total de empleados"
        color="bg-red-400"
      />
    </div>
  );
}