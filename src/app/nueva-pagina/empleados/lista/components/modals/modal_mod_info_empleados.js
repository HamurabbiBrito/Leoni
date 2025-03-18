import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import InputField from './InputField';
import CheckboxField from './CheckboxField';
import MensajeCard from '@/components/MensajeCard'; // Importar el componente de mensaje

const ModalActualizarEmpleado = ({ isOpen, onClose, empleado, onUpdate, setMensajeGlobal }) => {
  // Estados del formulario
  const [area, setArea] = useState(empleado ? empleado.area : '');
  const [clasificacion, setClasificacion] = useState(empleado ? empleado.clasificacion : '');
  const [puesto, setPuesto] = useState(empleado ? empleado.puesto : '');
  const [accesoRestringido, setAccesoRestringido] = useState(false);
  const [darDeBaja, setDarDeBaja] = useState(empleado ? empleado.estado === 'Baja' : false); // Inicializar según el estado del empleado
  const [areasOptions, setAreasOptions] = useState([]);

  // Obtener las áreas y el área del empleado al abrir el modal
  useEffect(() => {
    if (isOpen && empleado) {
      fetchAreasAndEmpleadoArea();
    }
  }, [isOpen, empleado]);

  // Función para obtener todas las áreas y el área del empleado
  const fetchAreasAndEmpleadoArea = async () => {
    try {
      const response = await fetch(`/api/nueva-pagina/empleados/lista/areas?numero=${empleado.numero}`);
      const data = await response.json();

      if (data.areas && data.areaEmpleado) {
        setAreasOptions(data.areas.map((area) => ({ value: area.id_area, label: area.area })));
        setArea(data.areaEmpleado.id_area);
      }
    } catch (error) {
      console.error('Error al obtener las áreas y el área del empleado:', error);
    }
  };

  // Función para manejar el guardado de los datos
  const handleGuardar = async () => {
    try {
      // Determinar el estado basado en el checkbox "Dar de baja"
      const estado = darDeBaja ? 'Baja' : 'Activo';

      // Datos a enviar
      const datosActualizados = {
        numero: empleado.numero,
        id_area: area,
        clasificacion: clasificacion,
        estado: estado,
      };

      // Enviar los datos al backend
      const response = await fetch('/api/nueva-pagina/empleados/lista/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el empleado');
      }

      const resultado = await response.json();
      console.log('Empleado actualizado:', resultado);

      // Mostrar mensaje de éxito global
      setMensajeGlobal({ tipo: 'exito', mensaje: 'Empleado actualizado correctamente' });

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

  // Actualizar el estado cuando el empleado cambie
  useEffect(() => {
    if (isOpen && empleado) {
      setClasificacion(empleado.clasificacion);
      setPuesto(empleado.puesto);
      setAccesoRestringido(false);
      setDarDeBaja(empleado.estado === 'Baja'); // Establecer el checkbox según el estado del empleado
    }
  }, [isOpen, empleado]);

  if (!empleado) {
    return null;
  }

  // Opciones para los campos de selección
  const clasificacionOptions = [
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
        <h2 className="text-xl font-bold mb-6">Actualizar Información</h2>
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
              value={empleado.numero}
              disabled
            />
            <InputField
              label="Nombre"
              value={empleado.nombre}
              disabled
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
                checked={darDeBaja} // El checkbox se marca automáticamente si el empleado está de baja
                onChange={(e) => setDarDeBaja(e.target.checked)}
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
            Guardar
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalActualizarEmpleado;