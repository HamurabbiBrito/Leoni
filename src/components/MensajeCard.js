// src/components/MensajeCard.js
import React, { useEffect } from 'react';

const MensajeCard = ({ tipo, mensaje, onCerrar, esGlobal = false }) => {
  const estilos = {
    exito: {
      bg: 'bg-green-100 dark:bg-green-900',
      border: 'border-l-4 border-green-500 dark:border-green-700',
      text: 'text-green-900 dark:text-green-100',
      icon: 'text-green-600',
    },
    error: {
      bg: 'bg-red-100 dark:bg-red-900',
      border: 'border-l-4 border-red-500 dark:border-red-700',
      text: 'text-red-900 dark:text-red-100',
      icon: 'text-red-600',
    },
    advertencia: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      border: 'border-l-4 border-yellow-500 dark:border-yellow-700',
      text: 'text-yellow-900 dark:text-yellow-100',
      icon: 'text-yellow-600',
    },
    informacion: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      border: 'border-l-4 border-blue-500 dark:border-blue-700',
      text: 'text-blue-900 dark:text-blue-100',
      icon: 'text-blue-600',
    },
  };

  const iconos = {
    exito: 'M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    advertencia: 'M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    informacion: 'M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };

  // Cerrar automáticamente si es un mensaje global
  useEffect(() => {
    if (esGlobal && onCerrar) {
      const timer = setTimeout(() => {
        onCerrar();
      }, 3000); // Cerrar después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [esGlobal, onCerrar]);

  return (
    <div
      role="alert"
      className={`${estilos[tipo].bg} ${estilos[tipo].border} ${estilos[tipo].text} p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-opacity-80 transform hover:scale-105 ${
        esGlobal ? 'fixed top-4 right-4 z-50' : ''
      }`}
    >
      <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className={`h-5 w-5 flex-shrink-0 mr-2 ${estilos[tipo].icon}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={iconos[tipo]}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xs font-semibold">{mensaje}</p>
      {onCerrar && (
        <button
          className="ml-auto text-gray-500 hover:text-gray-700"
          onClick={onCerrar}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default MensajeCard;