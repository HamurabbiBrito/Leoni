import { useEffect, useState } from "react";

export default function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [registroStatus, setRegistroStatus] = useState("");
  const [brigadaChecked, setBrigadaChecked] = useState(false);
  const [estadoChecked, setEstadoChecked] = useState(false); // Nuevo estado para el filtro de estado
  const pageSize = 20;

  // Función para obtener la lista de empleados
  const fetchEmpleados = async () => {
    try {
      const url = new URL("/api/nueva-pagina/empleados/lista", window.location.origin);
      url.searchParams.set("page", page);
      url.searchParams.set("pageSize", pageSize);
      url.searchParams.set("search", searchTerm);
      url.searchParams.set("registroStatus", registroStatus);
      url.searchParams.set("brigadaChecked", brigadaChecked);
      url.searchParams.set("estadoChecked", estadoChecked); // Incluir estadoChecked en la URL

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Error al obtener los empleados");

      const data = await response.json();
      setEmpleados(data.empleados);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  // Llamar a fetchEmpleados cuando cambien los filtros o la página
  useEffect(() => {
    fetchEmpleados();
  }, [page, searchTerm, registroStatus, brigadaChecked, estadoChecked]); // Añadir estadoChecked como dependencia

  return {
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
    estadoChecked,
    setEstadoChecked, // Exportar setEstadoChecked
    setPage,
    fetchEmpleados, // Exportar fetchEmpleados para usarla manualmente
  };
}