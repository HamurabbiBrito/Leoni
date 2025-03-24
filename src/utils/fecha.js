// src/utils/utils.js

/**
 * Obtiene la fecha y hora actual en formato ISO 8601 (compatible con PostgreSQL).
 * @returns {string} Fecha y hora en formato ISO 8601.
 */
export const obtenerFechaHoraISO = () => {
    const ahora = new Date();
    return ahora.toISOString(); // Formato: "YYYY-MM-DDTHH:mm:ss.sssZ"
  };
  
  /**
   * Obtiene la fecha y hora actual en formato local legible.
   * @returns {string} Fecha y hora en formato local.
   */
  export const obtenerFechaHoraLocal = () => {
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString();
    const hora = ahora.toLocaleTimeString();
    return `${fecha} ${hora}`; // Formato: "DD/MM/YYYY HH:MM:SS"
  };