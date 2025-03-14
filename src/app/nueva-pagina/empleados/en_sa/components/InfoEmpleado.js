// app/nueva-pagina/empleados/en-sa/components/InfoEmpleado.js
export default function InfoEmpleado({ nombreEmpleado }) {
    return (
      <div className="flex items-center">
        <label className="font-semibold text-gray-700 w-40">Nombre:</label>
        <input
          type="text"
          value={nombreEmpleado}
          readOnly
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }