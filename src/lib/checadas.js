// @/lib/consultas.js
import db from '@/lib/db'; // Importa la conexión desde db.js

// Función para obtener los datos del empleado
export const obtenerDatosEmpleado = async (numero) => {
  try {
    // Consulta SQL para obtener los datos
    const query = `
      SELECT 
        e.Nombre, 
        r.Registro, 
        r.Clasificacion 
      FROM 
        RegEmp r
      INNER JOIN 
        empleados e 
      ON 
        e.numero = r.numero
      WHERE 
        r.numero = ?
      ORDER BY 
        r.Registro DESC
      LIMIT 1;
    `;

    // Ejecutar la consulta
    const [rows] = await db.query(query, [numero]);

    if (rows.length > 0) {
      return rows[0]; // Devuelve la primera fila (último registro)
    } else {
      throw new Error("No se encontraron datos para el número proporcionado");
    }
  } catch (error) {
    console.error("Error en la consulta:", error);
    throw error;
  }
};