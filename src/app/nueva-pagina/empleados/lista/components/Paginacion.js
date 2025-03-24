// src/app/nueva-pagina/empleados/lista/components/Paginacion.js
import React from 'react';

export default function Paginacion({ page, totalPages, setPage }) {
  // Función para manejar el cambio de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Generar los números de página a mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3; // Número máximo de páginas a mostrar
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Ajustar el rango si no hay suficientes páginas después
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Agregar la primera página y puntos suspensivos si es necesario
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Agregar las páginas en el rango actual
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Agregar puntos suspensivos y la última página si es necesario
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 flex justify-center items-center space-x-2">
      {/* Botón "Anterior" */}
      <button
        onClick={() => handlePageChange(page - 1)}
        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
          page === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 shadow-md cursor-pointer"
        }`}
        disabled={page === 1}
      >
        Anterior
      </button>

      {/* Números de página */}
      {getPageNumbers().map((pageNumber, index) =>
        pageNumber === '...' ? (
          <span
            key={index}
            className="px-4 py-2 text-gray-500 cursor-default"
          >
            {pageNumber}
          </span>
        ) : (
          <button
            key={index}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              page === pageNumber
                ? "bg-blue-500 text-white shadow-md cursor-pointer"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            }`}
          >
            {pageNumber}
          </button>
        )
      )}

      {/* Botón "Siguiente" */}
      <button
        onClick={() => handlePageChange(page + 1)}
        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
          page === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 shadow-md cursor-pointer"
        }`}
        disabled={page === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
}