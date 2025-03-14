// app/nueva-pagina/empleados/en-sa/hooks/useRegistros.js
import { useEffect, useState } from "react";

export default function useRegistros() {
  const [empleadoNumero, setEmpleadoNumero] = useState("");
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [habilitarFechas, setHabilitarFechas] = useState(false);

  const fetchRegistros = async () => {
    try {
      let url = `/api/nueva-pagina/empleados/consultas?numero=${empleadoNumero}`;
      if (habilitarFechas && fechaInicio && fechaFin) {
        url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los registros");
      const data = await response.json();
      setRegistros(data.registros);
      if (empleadoNumero && data.registros.length > 0) {
        setNombreEmpleado(data.registros[0].nombre);
      } else if (!empleadoNumero) {
        setNombreEmpleado("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUltimosRegistros = async () => {
    try {
      const url = `/api/nueva-pagina/empleados/consultas?limit=50`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener los registros");
      const data = await response.json();
      setRegistros(data.registros);
      setNombreEmpleado("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUltimosRegistros();
  }, []);

  useEffect(() => {
    if (empleadoNumero || (habilitarFechas && fechaInicio && fechaFin)) {
      fetchRegistros();
    } else {
      fetchUltimosRegistros();
    }
  }, [empleadoNumero, fechaInicio, fechaFin, habilitarFechas]);

  return {
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
  };
}