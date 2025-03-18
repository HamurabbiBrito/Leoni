import React from 'react';

const Mensaje = ({ tipo, mensaje, onCerrar }) => {
  const estilos = {
    exito: 'bg-green-100 border border-green-400 text-green-700',
    error: 'bg-red-100 border border-red-400 text-red-700',
    advertencia: 'bg-yellow-100 border border-yellow-400 text-yellow-700',
    informacion: 'bg-blue-100 border border-blue-400 text-blue-700',
  };

  return (
    <div className={`${estilos[tipo]} px-4 py-3 rounded relative mb-4`} role="alert">
      <span className="block sm:inline">{mensaje}</span>
      {onCerrar && (
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={onCerrar}
        >
          <svg
            className="fill-current h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 01-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 011.414-1.414l2.93 2.93 2.93-2.93a1 1 0 011.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Mensaje;