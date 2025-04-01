export function normalizeEmployeeNumber(rawNumber) {
    // Eliminar cualquier letra al final
    const cleaned = rawNumber.replace(/[^0-9]/g, '');
  
    // Casos especiales para números que comienzan con 1 seguido de ceros
    if (/^10+/.test(cleaned)) {
      // Extraer los dígitos después de los ceros
      const match = cleaned.match(/^10*([1-9][0-9]*)$/);
      if (match && match[1]) {
        return match[1];
      }
    }
  
    // Para otros casos, devolver los últimos 4 dígitos
    // (asumiendo que el número normalizado tiene 4 dígitos)
    return cleaned.slice(-4);
  }