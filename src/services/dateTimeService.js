// src/services/dateTimeService.js
export const obtenerFechaHoraLocal = () => {
  const ahora = new Date();
  
  // Formato para la base de datos (usa hora local)
  const offset = ahora.getTimezoneOffset();
  const localDate = new Date(ahora.getTime() - (offset * 60 * 1000));
  
  return {
    isoString: localDate.toISOString().slice(0, 19).replace('T', ' '), // Formato compatible con SQL
    localString: ahora.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    now: ahora // Objeto Date original por si se necesita
  };
};