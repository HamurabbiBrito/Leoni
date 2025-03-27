export const normalizeEmployeeNumber = (input) => {
  if (!input) return '';

  // Caso 1: Si el input es solo números, eliminar el 1 inicial si existe
  if (/^\d+$/.test(input)) {
    return input.replace(/^1/, '').replace(/^0+/, '');
  }

  // Caso 2: Para formatos como 104671A, 100578A, etc.
  const match = input.match(/^1?(\d+)(\D?)$/); // <-- Modificado para ignorar el 1 inicial
  if (match) {
    const numbers = match[1]; // <- Ya no incluye el 1 inicial
    const letter = match[2] || '';
    
    // Eliminar ceros iniciales (opcional, si los quieres quitar)
    const relevantDigits = numbers.replace(/^0+/, '');
    
    return relevantDigits + letter;
  }

  // Caso 3: Cualquier otro formato - tomar solo los dígitos y eliminar 1 inicial
  return input.replace(/\D/g, '').replace(/^1/, '').replace(/^0+/, '');
};