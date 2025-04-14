import { useState } from 'react';

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    usuario: user.usuario,
    id_nivel: user.id_nivel
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.usuario.trim()) {
      setError('El nombre de usuario es requerido');
      return;
    }
    
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Editar Usuario</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.usuario}
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rol
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.id_nivel}
              onChange={(e) => setFormData({...formData, id_nivel: parseInt(e.target.value)})}
            >
              <option value="1">Administrador</option>
              <option value="2">Recursos Humanos</option>
              <option value="3">Seguridad</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;