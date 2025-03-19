import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import InputField from './InputField';
import CheckboxField from './CheckboxField';
import MensajeCard from '@/components/MensajeCard'; // Importar el componente de mensaje

const ModalActualizarEmpleado = ({
  isOpen,
  onClose,
  empleado, // Empleado existente (para modo actualización)
  onUpdate, // Función para actualizar la lista de empleados
  setMensajeGlobal, // Función para mostrar mensajes globales
  modo = 'actualizar', // Modo del modal: 'actualizar' o 'registrar'
}) => {
  // Estados del formulario
  const [numero, setNumero] = useState(empleado ? empleado.numero : '');
  const [nombre, setNombre] = useState(empleado ? empleado.nombre : '');
  const [area, setArea] = useState(empleado ? empleado.id_area : '');
  const [clasificacion, setClasificacion] = useState(empleado ? empleado.clasificacion : '');
  const [puesto, setPuesto] = useState(empleado ? empleado.puesto : 'Operador'); // Valor por defecto: 'Operador'
  const [accesoRestringido, setAccesoRestringido] = useState(false);
  const [darDeBaja, setDarDeBaja] = useState(empleado ? empleado.estado === 'Baja' : false);
  const [areasOptions, setAreasOptions] = useState([]);

  // Obtener las áreas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchAreas();
    }
  }, [isOpen]);

  // Función para obtener todas las áreas y el área actual del empleado (si existe)
  const fetchAreas = async () => {
    try {
      const url = `/api/nueva-pagina/empleados/lista/areas${empleado ? `?numero=${empleado.numero}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.areas) {
        setAreasOptions(data.areas.map((area) => ({ value: area.id_area, label: area.area })));
      }

      if (data.areaEmpleado) {
        setArea(data.areaEmpleado.id_area); // Establecer el área actual del empleado
      }
    } catch (error) {
      console.error('Error al obtener las áreas:', error);
      setMensajeGlobal({ tipo: 'error', mensaje: 'Error al obtener las áreas' });
    }
  };

  // Función para manejar el guardado de los datos
  const handleGuardar = async () => {
    try {
      // Validar campos obligatorios
      console.log("Valores de los campos:", { nombre, area, clasificacion, puesto });
      if (!nombre || !area || !clasificacion || !puesto || puesto === '') {
        throw new Error('Todos los campos son obligatorios');
      }
  
      // Determinar el estado basado en el checkbox "Dar de baja"
      const estado = darDeBaja ? 'Baja' : 'Activo';
  
      // Datos a enviar
      const datosEmpleado = {
        // Solo incluir el número en modo actualización
        ...(modo === 'actualizar' && { numero: empleado.numero }), // Usar el número del empleado existente en modo actualización
        nombre,
        id_area: area,
        clasificacion,
        puesto,
        estado,
      };
  
      // URL y método HTTP según el modo
      const url =
        modo === 'registrar'
          ? '/api/nueva-pagina/empleados/lista/registrar'
          : '/api/nueva-pagina/empleados/lista/actualizar';
      const method = modo === 'registrar' ? 'POST' : 'PUT';
  
      // Enviar los datos al backend
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEmpleado),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error al ${modo === 'registrar' ? 'registrar' : 'actualizar'} el empleado`);
      }
  
      const resultado = await response.json();
      console.log('Empleado guardado:', resultado);
  
      // Mostrar mensaje de éxito global
      setMensajeGlobal({
        tipo: 'exito',
        mensaje: `Empleado ${modo === 'registrar' ? 'registrado' : 'actualizado'} correctamente`,
      });
  
      // Cerrar el modal después de guardar
      setTimeout(() => {
        onClose();
      }, 2000); // Cerrar el modal después de 2 segundos
  
      // Actualizar la lista de empleados
      if (onUpdate) {
        onUpdate(); // Llama a la función de actualización
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      setMensajeGlobal({ tipo: 'error', mensaje: error.message });
    }
  };

  // Actualizar el estado cuando el empleado cambie (solo en modo actualización)
  useEffect(() => {
    if (isOpen && empleado && modo === 'actualizar') {
      setNumero(empleado.numero);
      setNombre(empleado.nombre);
      setArea(empleado.id_area);
      setClasificacion(empleado.clasificacion);
      setPuesto(empleado.puesto || 'Operador'); // Asegúrate de que `puesto` tenga un valor por defecto
      setAccesoRestringido(false);
      setDarDeBaja(empleado.estado === 'Baja');
      console.log("Estados inicializados:", { numero, nombre, area, clasificacion, puesto });
    }
  }, [isOpen, empleado, modo]);

  if (!isOpen) {
    return null;
  }

  // Opciones para los campos de selección
  const clasificacionOptions = [
    { value: 'A', label: 'Seleccione una opcion' },
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Directo', label: 'Directo' },
    { value: 'Indirecto', label: 'Indirecto' },
  ];

  const puestoOptions = [
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Operador', label: 'Operador' },
    { value: 'Gerente', label: 'Gerente' },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2 className="text-xl font-bold mb-6">
          {modo === 'registrar' ? 'Registrar Nuevo Empleado' : 'Actualizar Información'}
        </h2>
        <div className="flex gap-8">
          {/* Columna izquierda: Imagen y campos de solo lectura */}
          <div className="w-1/2">
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.png"
                alt="Empleado"
                className="w-32 h-32 rounded-md"
              />
            </div>
            <InputField
              label="Número de empleado"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              disabled={modo === 'actualizar'} // Deshabilitar en modo actualización
            />
            <InputField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Columna derecha: Campos editables y botones */}
          <div className="w-1/2">
            <InputField
              label="Área"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              isSelect
              options={areasOptions}
            />
            <InputField
              label="Clasificación"
              value={clasificacion}
              onChange={(e) => setClasificacion(e.target.value)}
              isSelect
              options={clasificacionOptions}
            />
            <InputField
              label="Puesto"
              value={puesto}
              onChange={(e) => setPuesto(e.target.value)}
              isSelect
              options={puestoOptions}
            />
            <div className="mb-4 flex gap-4">
              <CheckboxField
                label="Acceso Restringido"
                checked={accesoRestringido}
                onChange={(e) => setAccesoRestringido(e.target.checked)}
              />
              <CheckboxField
                label="Dar de Baja"
                checked={darDeBaja}
                onChange={(e) => setDarDeBaja(e.target.checked)}
                disabled={modo === 'registrar'} // Deshabilitar en modo registro
              />
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end mt-6">
          <button
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleGuardar}
          >
            {modo === 'registrar' ? 'Registrar' : 'Guardar'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalActualizarEmpleado;