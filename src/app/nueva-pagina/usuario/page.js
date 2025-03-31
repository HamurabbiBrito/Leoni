"use client";

import { useState, useEffect } from 'react';
import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el nuevo usuario
  const [newUser, setNewUser] = useState({
    usuario: '',
    password: '',
    id_nivel: 2 // Valor por defecto para RH
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/nueva-pagina/usuarios');
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        setUsers(data.map(user => ({ ...user, showPassword: false })));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = (id_usuario) => {
    setUsers(users.map(user => 
      user.id_usuario === id_usuario ? { ...user, showPassword: !user.showPassword } : user
    ));
  };

  // Agregar nuevo usuario
 // ... (código anterior permanece igual)

// Modificar handleAddUser para validar contraseña
const handleAddUser = async () => {
  if (!newUser.usuario || !newUser.password || !newUser.id_nivel) {
    alert('Por favor complete todos los campos');
    return;
  }

  // Validación básica de contraseña en el frontend
  if (newUser.password.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres');
    return;
  }

  try {
    const response = await fetch('/api/nueva-pagina/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear usuario');
    }

    const createdUser = await response.json();
    setUsers([...users, { ...createdUser, showPassword: false }]);
    setNewUser({ usuario: '', password: '', id_nivel: 2 });
    setShowAddForm(false);
    setError(null);
  } catch (err) {
    setError(err.message);
  }
};

// ... (resto del código permanece igual)
  // Eliminar usuario
  const handleDeleteUser = async (id_usuario) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch('/api/nueva-pagina/usuarios', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_usuario }),
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');

      setUsers(users.filter(user => user.id_usuario !== id_usuario));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando usuarios...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showAddForm ? 'Cancelar' : 'Agregar Nuevo Usuario'}
      </button>

      {showAddForm && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-4">Nuevo Usuario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-usuario">
                Nombre de Usuario
              </label>
              <input
                id="new-usuario"
                type="text"
                value={newUser.usuario}
                onChange={(e) => setNewUser({ ...newUser, usuario: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                Contraseña
              </label>
              <input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-role">
                Rol
              </label>
              <select
                id="new-role"
                value={newUser.id_nivel}
                onChange={(e) => setNewUser({ ...newUser, id_nivel: parseInt(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="1">Administrador</option>
                <option value="2">Recursos Humanos</option>
                <option value="3">Seguridad</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Guardar Usuario
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Usuario</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_usuario} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{user.id_usuario}</td>
                <td className="py-2 px-4 border-b text-center">{user.usuario}</td>
                <td className="py-2 px-4 border-b text-center capitalize">{user.rol}</td>
                <td className="py-2 px-4 border-b text-center">
                <div className="flex justify-center space-x-2">
    <EditButton 
      onClick={() => handleEditUser(user.id_usuario)}
      size="sm"
    />
    <DeleteButton 
      onClick={() => handleDeleteUser(user.id_usuario)}
      size="sm"
    />
  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}