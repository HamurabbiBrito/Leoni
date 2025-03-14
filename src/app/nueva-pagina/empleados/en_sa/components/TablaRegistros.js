// app/nueva-pagina/empleados/en-sa/components/TablaRegistros.js
export default function TablaRegistros({ registros }) {
    return (
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
    );
  }