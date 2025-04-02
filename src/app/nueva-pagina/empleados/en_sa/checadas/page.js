"use client";
import React, { useState, useRef, useEffect } from 'react';
import { obtenerFechaHoraLocal } from '@services/dateTimeService';
import { normalizeEmployeeNumber } from '@utils/normalizeEmployeeNumber';

const RegistroChecadaPage = () => {
  // Estados
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [empleado, setEmpleado] = useState({
    foto: "/images/leoni-logo.png",
    nombre: "",
    clasificacion: "",
    puesto: "",
    ultimoRegistro: null,
    numero: ""
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  const [fechaHoraActual, setFechaHoraActual] = useState(obtenerFechaHoraLocal());
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Función para limpiar los datos
  const limpiarPantalla = () => {
    setEmpleado({
      foto: "/images/leoni-logo.png",
      nombre: "",
      clasificacion: "",
      puesto: "",
      ultimoRegistro: null,
      numero: ""
    });
    setNumeroEmpleado("");
    setMensaje({ texto: '', tipo: '' });
    seleccionarTexto();
  };

  // Función para reiniciar el temporizador de limpieza
  const reiniciarTemporizador = () => {
    // Limpiar el timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Establecer nuevo timeout para 2 minutos (120000 ms)
    timeoutRef.current = setTimeout(() => {
      limpiarPantalla();
    }, 30000); // 2 minutos = 120000 milisegundos
  };

  // Actualizar fecha y hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHoraActual(obtenerFechaHoraLocal());
    }, 1000);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Efecto para manejar la interacción del usuario
  useEffect(() => {
    // Iniciar el temporizador cuando el componente se monta
    reiniciarTemporizador();
    
    // Event listeners para detectar actividad del usuario
    const handleUserActivity = () => {
      reiniciarTemporizador();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, []);

  // Reiniciar temporizador cuando hay cambios en los datos del empleado
  useEffect(() => {
    if (empleado.nombre) {
      reiniciarTemporizador();
    }
  }, [empleado]);

  const seleccionarTexto = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.select();
        inputRef.current.focus();
      }
    }, 100);
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 5000);
  };

  const obtenerFotoEmpleado = async (numero) => {
    try {
      const response = await fetch(`/api/test?numeroEmpleado=${numero}`);
      if (!response.ok) {
        throw new Error("Error al obtener foto");
      }
      const data = await response.json();
      return data.foto || "/images/leoni-logo.png";
    } catch (error) {
      console.error("Error obteniendo foto:", error);
      return "/images/leoni-logo.png";
    }
  };

  const determinarTipoRegistro = (ultimoRegistro) => {
    if (!ultimoRegistro) return 'E';
    return ultimoRegistro === 'E' ? 'S' : 'E';
  };

  const buscarYRegistrar = async () => {
    if (!numeroEmpleado.trim()) {
      mostrarMensaje("Por favor, ingresa un número de empleado.", "error");
      return;
    }

    setLoading(true);
    mostrarMensaje('', '');

    try {
      const [empleadoResponse, registroResponse, foto] = await Promise.all([
        fetch(`/api/nueva-pagina/empleados/consultas/numero?numero=${numeroEmpleado.trim()}`),
        fetch(`/api/nueva-pagina/empleados/consultas/ultimo-registro?numero=${numeroEmpleado.trim()}`),
        obtenerFotoEmpleado(numeroEmpleado.trim())
      ]);

      if (!empleadoResponse.ok) throw new Error("Empleado no encontrado.");
      if (!registroResponse.ok) throw new Error("Error al consultar historial.");

      const [empleadoData, ultimoRegistroData] = await Promise.all([
        empleadoResponse.json(),
        registroResponse.json()
      ]);

      const nuevoTipoRegistro = determinarTipoRegistro(ultimoRegistroData?.registro);
      const { isoString, now } = obtenerFechaHoraLocal();

      const checadaResponse = await fetch('/api/nueva-pagina/empleados/consultas/checada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: numeroEmpleado,
          fechaHora: isoString,
          registro: nuevoTipoRegistro,
          tipo: "Checada",
          clasificacion: empleadoData.clasificacion || ""
        })
      });

      const checadaData = await checadaResponse.json();
      if (!checadaResponse.ok) throw new Error(checadaData.error || "Error al registrar la checada");

      setEmpleado({
        foto: foto,
        nombre: empleadoData.nombre,
        clasificacion: empleadoData.clasificacion || "",
        puesto: empleadoData.puesto || "",
        ultimoRegistro: nuevoTipoRegistro,
        numero: numeroEmpleado
      });

      mostrarMensaje(
        `Registro de ${nuevoTipoRegistro === 'E' ? 'entrada' : 'salida'} exitoso a las ${now.toLocaleTimeString('es-MX', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        })}`,
        "success"
      );
      
    } catch (error) {
      mostrarMensaje(error.message, "error");
      setEmpleado({
        foto: "/images/leoni-logo.png",
        nombre: "",
        clasificacion: "",
        puesto: "",
        ultimoRegistro: null,
        numero: ""
      });
    } finally {
      setLoading(false);
      seleccionarTexto();
    }
  };

  const handleNumeroChange = (e) => {
    const rawValue = e.target.value;
    const normalized = normalizeEmployeeNumber(rawValue);
    setNumeroEmpleado(normalized);
    reiniciarTemporizador(); // Reiniciar el temporizador cuando se escribe en el input
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      buscarYRegistrar();
    }
    reiniciarTemporizador(); // Reiniciar el temporizador con cualquier tecla presionada
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-[90vh] bg-gray-100 p-2 flex justify-center items-center">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-md p-8 h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Registro de Checadas</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={buscarYRegistrar}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {loading ? "Registrando..." : "Registrar Automático"}
            </button>
          </div>
          
        </div>
        <div className="text-xl font-medium text-gray-600 text-right">
              <div>
                {fechaHoraActual.now.toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-2xl">
                {fechaHoraActual.now.toLocaleTimeString('es-MX', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: true 
                })}
              </div>
            </div>

        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-4">
            Número de Empleado
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={numeroEmpleado}
              onChange={handleNumeroChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="w-1/3 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Ingresa el número y presiona Enter"
              disabled={loading}
            />
          </div>
        </div>

        {empleado.nombre && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Información del Empleado</h2>
            <div className="flex items-center space-x-6">
              <img
                src={empleado.foto}
                alt={`Foto de ${empleado.nombre}`}
                className="w-80 h-80 border-4 border-blue-200 object-cover"
                onError={(e) => {
                  e.target.src = "/images/leoni-logo.png";
                  e.target.className = "w-64 h-64 rounded-full border-4 border-blue-200";
                }}
              />
              <div>
                <p className="text-2xl font-medium">{empleado.nombre}</p>
                <p className="text-lg text-gray-600">Número: {empleado.numero}</p>
                <p className="text-lg text-gray-600">{empleado.clasificacion}</p>
                <p className="text-lg text-gray-600">{empleado.puesto}</p>
                {empleado.ultimoRegistro && (
                  <p className="text-lg mt-2">
                    Último registro: <span className="font-semibold">
                      {empleado.ultimoRegistro === 'E' ? 'Entrada' : 'Salida'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {mensaje.texto && (
          <div className={`p-4 rounded-md mb-6 text-lg ${
            mensaje.tipo === 'error' 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroChecadaPage;