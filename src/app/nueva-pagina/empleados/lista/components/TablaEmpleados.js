// src/app/nueva-pagina/empleados/lista/components/TablaEmpleados.js
export default function TablaEmpleados({ empleados, openModal }) {
    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto even">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-black">Numero</th>
              <th className="px-4 py-2 text-left text-black">Nombre</th>
              <th className="px-4 py-2 text-left text-black">Estado</th>
              {/* <th className="px-4 py-2 text-left text-black">Brigada</th> */}
              <th className="px-4 py-2 text-left text-black">Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr
                key={empleado.numero}
                className="border-b odd:bg-white even:bg-gray-300 hover:bg-gray-500 cursor-pointer"
                onClick={() => openModal(empleado)}
              >
                <td className="px-4 py-2 text-black">{empleado.numero}</td>
                <td className="px-4 py-2 text-black">{empleado.nombre}</td>
                <td className="px-4 py-2 text-black">{empleado.estado}</td>
                {/* <td className="px-4 py-2 text-black">{empleado.brigada}</td> */}
                <td className="px-4 py-2 text-black">{empleado.clasificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }