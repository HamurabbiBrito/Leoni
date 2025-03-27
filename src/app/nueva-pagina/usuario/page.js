"use client";

import { useState, useEffect } from 'react';

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
  const handleAddUser = async () => {
    if (!newUser.usuario || !newUser.password || !newUser.id_nivel) {
      alert('Por favor complete todos los campos');
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

      if (!response.ok) throw new Error('Error al crear usuario');

      const createdUser = await response.json();
      setUsers([...users, { ...createdUser, showPassword: false }]);
      setNewUser({ usuario: '', password: '', id_nivel: 2 });
      setShowAddForm(false);
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
              <th className="py-2 px-4 border-b">Contraseña</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_usuario} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{user.id_usuario}</td>
                <td className="py-2 px-4 border-b text-center">{user.usuario}</td>
                <td className="py-2 px-4 border-b text-center">
                  <div className="flex items-center justify-center">
                    {user.showPassword ? user.password : '*'.repeat(user.password?.length || 0)}
                    <button
                      onClick={() => togglePasswordVisibility(user.id_usuario)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      {user.showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 border-b text-center capitalize">{user.rol}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleDeleteUser(user.id_usuario)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}