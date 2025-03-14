// app/nueva-pagina/empleados/components/TarjetaEmpleados.js
export default function TarjetaEmpleados({ valor, texto, color }) {
    return (
      <div className={`w-[200px] h-[150px] ${color} flex flex-col justify-center items-center rounded-lg shadow-lg`}>
        <div className="text-4xl font-bold">{valor}</div>
        <p className="text-xl mt-2 text-center">{texto}</p>
      </div>
    );
  }