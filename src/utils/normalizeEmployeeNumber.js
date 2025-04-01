export function normalizeEmployeeNumber(rawNumber) {
  // 1. Limpiar el input (solo números)
  const cleaned = rawNumber.toString().replace(/[^0-9]/g, '');

  // 2. Aplicar las reglas específicas
  if (/^100\d{3}$/.test(cleaned)) { // Caso 100 + 3 dígitos
    return cleaned.slice(3); // Devuelve los últimos 3 dígitos
  }
  if (/^10\d{4}$/.test(cleaned)) { // Cualquier otro caso que empiece con 1 y ceros
    return cleaned.slice(2);; // Elimina el 1 y los ceros
  }
  if (/^0+/.test(cleaned)) { // Caso que empiece con ceros
    return cleaned.replace(/^0+/, ''); // Elimina los ceros iniciales
  }

  // 3. Para cualquier otro caso, devolver el número completo
  return cleaned;
}