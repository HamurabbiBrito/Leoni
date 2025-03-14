// src/app/nueva-pagina/empleados/lista/components/Paginacion.js
export default function Paginacion({ page, totalPages, setPage }) {
    return (
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 shadow-md cursor-pointer"
          }`}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
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