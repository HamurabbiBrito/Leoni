// src/app/nueva-pagina/empleados/lista/hooks/useEmpleados.js
import { useEffect, useState } from "react";

export default function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [registroStatus, setRegistroStatus] = useState("");
  const [brigadaChecked, setBrigadaChecked] = useState(false);
  const pageSize = 20;

  // Función para obtener la lista de empleados
  const fetchEmpleados = async () => {
    try {
      const response = await fetch(
        `/api/nueva-pagina/empleados/lista?page=${page}&pageSize=${pageSize}&search=${searchTerm}&registroStatus=${registroStatus}&brigadaChecked=${brigadaChecked}`
      );
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
  }, [page, searchTerm, registroStatus, brigadaChecked, pageSize]);

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
    setPage,
    fetchEmpleados, // Exportar fetchEmpleados para usarla manualmente
  };
}