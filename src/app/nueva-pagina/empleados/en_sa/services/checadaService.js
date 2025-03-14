// Función para buscar un empleado por número
export const fetchEmpleado = async (numero) => {
  try {
    const response = await fetch(`/api/nueva-pagina/empleados/consultas/numero?numero=${numero}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener los datos del empleado");
    }
    return await response.json();
  } catch (error) {
    console.error("❌ Error al buscar el empleado:", error);
    throw error;
  }
};

// Función para registrar una checada
export const registrarChecada = async (checadaData) => {
  try {
    console.log("Datos enviados:", checadaData); // Depuración

    const response = await fetch('/api/nueva-pagina/empleados/consultas/checada', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checadaData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al registrar la checada");
    }

    const resultado = await response.json();
    return resultado; // Devuelve el registro insertado
  } catch (error) {
    console.error("❌ Error al registrar la checada:", error);
    throw error;
  }
};