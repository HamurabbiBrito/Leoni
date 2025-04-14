'use client';

import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { APP_ROLES } from '@/constants/roles';
import EditUserModal from './components/modal';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    usuario: '',
    password: '',
    id_nivel: 2
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Función reutilizable para obtener usuarios
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

  // Verificar autenticación y rol
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== APP_ROLES.ADMIN) {
      router.push('/unauthorized');
    }
  }, [status, session, router]);

  // Obtener usuarios al cargar el componente
  useEffect(() => {
    if (status !== 'authenticated' || session?.user?.role !== APP_ROLES.ADMIN) return;
    fetchUsers();
  }, [status, session]);

  // Agregar nuevo usuario
  const handleAddUser = async () => {
    if (!newUser.usuario || !newUser.password || !newUser.id_nivel) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (newUser.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const response = await fetch('/api/nueva-pagina/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      // Actualizar lista completa de usuarios
      await fetchUsers();
      
      setNewUser({ usuario: '', password: '', id_nivel: 2 });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id_usuario) => {
    if (!confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch('/api/nueva-pagina/usuarios', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ id_usuario }),
      });

      if (!response.ok) throw new Error('Error al eliminar usuario');

      setUsers(users.filter(user => user.id_usuario !== id_usuario));
    } catch (err) {
      setError(err.message);
    }
  };

  // Editar usuario
  const handleEditUser = async (formData) => {
    try {
      const response = await fetch('/api/nueva-pagina/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ 
          id_usuario: editingUser.id_usuario,
          usuario: formData.usuario,
          id_nivel: formData.id_nivel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }

      await fetchUsers();
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  if (status !== 'authenticated' || session?.user?.role !== APP_ROLES.ADMIN) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                required
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
                required
                minLength="8"
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
                required
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
                <td className="py-2 px-4 border-b text-center capitalize">
                  {user.id_nivel === 1 ? 'Administrador' : 
                   user.id_nivel === 2 ? 'Recursos Humanos' : 'Seguridad'}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="flex justify-center space-x-2">
                    <EditButton 
                      onClick={() => setEditingUser(user)}
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

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditUser}
        />
      )}
    </div>
  );
}