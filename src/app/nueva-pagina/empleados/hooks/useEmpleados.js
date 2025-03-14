// app/nueva-pagina/empleados/hooks/useEmpleados.js
import { useEffect, useState } from "react";

export default function useEmpleados() {
  const [empleadosPlanta, setEmpleadosPlanta] = useState(0);
  const [brigada, setBrigada] = useState(0);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/nueva-pagina/empleados");
      if (!response.ok) throw new Error("Error al obtener los datos");
      const data = await response.json();
      setEmpleadosPlanta(data.empleadosPlanta);
      setBrigada(data.brigada);
      setTotalEmpleados(data.totalEmpleados);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    empleadosPlanta,
    brigada,
    totalEmpleados,
    loading,
  };
}