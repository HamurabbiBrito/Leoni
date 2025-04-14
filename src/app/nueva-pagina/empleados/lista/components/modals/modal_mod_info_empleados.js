import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import InputField from './InputField';
import CheckboxField from './CheckboxField';

const ModalActualizarEmpleado = ({
  isOpen,
  onClose,
  empleado,
  onUpdate,
  setMensajeGlobal,
  modo = 'actualizar',
}) => {
  // Estados iniciales
  const [numero, setNumero] = useState('');
  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [puesto, setPuesto] = useState('Operador');
  const [accesoRestringido, setAccesoRestringido] = useState(false);
  const [darDeBaja, setDarDeBaja] = useState(false);
  const [areasOptions, setAreasOptions] = useState([]);
  const [foto, setFoto] = useState('/images/logo.png');

  // Función para resetear todos los estados
  const resetEstados = () => {
    setNumero('');
    setNombre('');
    setArea('');
    setClasificacion('');
    setPuesto('');
    setAccesoRestringido(false);
    setDarDeBaja(false);
    setFoto('/images/logo.png');
  };

  // Efecto principal al abrir el modal o cambiar modo
  useEffect(() => {
    if (isOpen) {
      if (modo === 'actualizar' && empleado) {
        cargarDatosExistente();
      } else {
        resetEstados();
      }
      fetchAreas();
    }
  }, [isOpen, empleado, modo]);

  // Cargar datos del empleado existente
  const cargarDatosExistente = async () => {
    setNumero(empleado.numero);
    setNombre(empleado.nombre);
    setArea(empleado.id_area);
    setClasificacion(empleado.clasificacion);
    setPuesto(empleado.puesto || 'Operador');
    setDarDeBaja(empleado.estado === 'Baja');
    await obtenerFoto(empleado.numero);
  };

  // Obtener áreas disponibles
  const fetchAreas = async () => {
    try {
      const url = `/api/nueva-pagina/empleados/lista/areas${
        modo === 'actualizar' && empleado ? `?numero=${empleado.numero}` : ''
      }`;
      const response = await fetch(url);
      const data = await response.json();
  
      // Agregar opción predeterminada al principio del array
      const areasConDefault = [
        { id_area: '', area: 'Selecciona una opción' }, // Opción predeterminada
        ...(data.areas || []) // Resto de áreas de la base de datos
      ];
  
      setAreasOptions(
        areasConDefault.map((area) => ({
          value: area.id_area,
          label: area.area,
          // Deshabilitar solo la opción predeterminada
          disabled: area.id_area === ''
        }))
      );
  
      // Establecer valor inicial según el modo
      if (modo === 'actualizar' && data.areaEmpleado) {
        setArea(data.areaEmpleado.id_area); // Valor actual en actualización
      } else {
        setArea(''); // Valor inicial vacío para registro
      }
    } catch (error) {
      console.error('Error al obtener áreas:', error);
      setMensajeGlobal({ tipo: 'error', mensaje: 'Error al cargar las áreas' });
    }
  };

  // Obtener foto del empleado
  const obtenerFoto = async (numeroEmpleado) => {
    try {
      const response = await fetch(`/api/test?numeroEmpleado=${numeroEmpleado}`);
      if (response.ok) {
        const data = await response.json();
        data.foto && setFoto(data.foto);
      }
    } catch (error) {
      console.error('Error al obtener foto:', error);
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    onClose();
    resetEstados();
  };

  // Enviar formulario
  const handleGuardar = async () => {
    try {
      if (!nombre || !area || !clasificacion || !puesto) {
        throw new Error('Todos los campos marcados con * son obligatorios');
      }

      const datos = {
        ...(modo === 'actualizar' && { numero: empleado.numero }),
        nombre,
        id_area: area,
        clasificacion,
        puesto,
        estado: darDeBaja ? 'Baja' : 'Activo',
      };

      const url = modo === 'registrar' 
        ? '/api/nueva-pagina/empleados/lista/registrar' 
        : '/api/nueva-pagina/empleados/lista/actualizar';

      const response = await fetch(url, {
        method: modo === 'registrar' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la operación');
      }

      setMensajeGlobal({
        tipo: 'exito',
        mensaje: `Empleado ${modo === 'registrar' ? 'registrado' : 'actualizado'} correctamente`
      });

      setTimeout(() => {
        handleClose();
        onUpdate?.();
      }, 1500);

    } catch (error) {
      setMensajeGlobal({ tipo: 'error', mensaje: error.message });
    }
  };

  // Opciones para selects
  const clasificacionOptions = [
    { value: '', label: 'Seleccione una opción' },
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Directo', label: 'Directo' },
    { value: 'Indirecto', label: 'Indirecto' },
  ];

  const puestoOptions = [
    { value: '', label: 'Seleccione una opción' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Operador', label: 'Operador' },
    { value: 'Gerente', label: 'Gerente' },
  ];

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-bold mb-6">
        {modo === 'registrar' ? 'Registro de Nuevo Empleado' : 'Editar Empleado'}
      </h2>

      <div className="flex gap-8">
        {/* Columna Izquierda - Foto y campos fijos */}
        <div className="w-1/2">
          <div className="mb-6 flex justify-center">
            <img
              src={foto}
              alt="Foto empleado"
              className="w-50 h-50 rounded-md object-cover border-4 border-white shadow-lg"
            />
          </div>
          
          <InputField
            label="Nombre completo *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={modo === 'actualizar'}
            className={modo === 'actualizar' ? 'bg-gray-50 cursor-not-allowed' : ''}
          />
        </div>

        {/* Columna Derecha - Campos editables */}
        <div className="w-1/2 space-y-4">
          <InputField
            label="Área *"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            isSelect
            options={areasOptions}
          />

          <InputField
            label="Clasificación *"
            value={clasificacion}
            onChange={(e) => setClasificacion(e.target.value)}
            isSelect
            options={clasificacionOptions}
          />

          <InputField
            label="Puesto *"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            isSelect
            options={puestoOptions}
          />

{modo === 'actualizar' && (
  <div className="flex gap-4 mt-4">
    <CheckboxField
      label="Acceso restringido"
      checked={accesoRestringido}
      onChange={(e) => setAccesoRestringido(e.target.checked)}
    />

    <CheckboxField
      label="Dar de baja"
      checked={darDeBaja}
      onChange={(e) => setDarDeBaja(e.target.checked)}
    />
  </div>
)}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={handleClose}
          className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {modo === 'registrar' ? 'Registrar' : 'Guardar cambios'}
        </button>
      </div>
    </Modal>
  );
};

export default ModalActualizarEmpleado;