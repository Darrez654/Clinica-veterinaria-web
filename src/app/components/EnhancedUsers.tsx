import { useState, useEffect, useCallback } from 'react';
import { UserPlus, Search, Mail, Phone, MapPin, Edit2, Trash2, Users as UsersIcon, Filter } from 'lucide-react';
import { usersService } from '../../api/services/users';
import { useApi } from '../../api/hooks/useApi';
import type { User, UserInput } from '../../api/types';

export function EnhancedUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [localUsers, setLocalUsers] = useState<User[]>([
    {
      id: 1, name: 'Carlos Pérez', email: 'carlos@email.com',
      phone: '+34 612 345 678', address: 'Calle Principal 123, Madrid',
      registrationDate: '2024-01-15', active: true,
    },
    {
      id: 2, name: 'Ana Martínez', email: 'ana@email.com',
      phone: '+34 623 456 789', address: 'Avenida Central 45, Barcelona',
      registrationDate: '2024-02-20', active: true,
    },
    {
      id: 3, name: 'Luis Ramírez', email: 'luis@email.com',
      phone: '+34 634 567 890', address: 'Plaza Mayor 7, Valencia',
      registrationDate: '2024-03-10', active: true,
    },
  ]);

  const [formData, setFormData] = useState<UserInput>({
    name: '', email: '', phone: '', address: '',
  });

  // Intentar cargar desde API
  const { data: apiUsers, loading } = useApi(
    () => usersService.getAll(),
    []
  );

  useEffect(() => {
    if (apiUsers && apiUsers.length > 0) {
      setLocalUsers(apiUsers);
    }
  }, [apiUsers]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setLocalUsers(prev => prev.map(u =>
        u.id === editingUser.id ? { ...u, ...formData } : u
      ));
    } else {
      const newUser: User = {
        id: localUsers.length + 1,
        ...formData,
        registrationDate: new Date().toISOString().split('T')[0],
        active: true,
      };
      setLocalUsers(prev => [...prev, newUser]);
    }
    setFormData({ name: '', email: '', phone: '', address: '' });
    setShowForm(false);
    setEditingUser(null);
  }, [formData, editingUser, localUsers]);

  const handleEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      setLocalUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const filteredUsers = localUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground mt-1">Registra y administra los propietarios de mascotas</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', email: '', phone: '', address: '' }); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-medium">Nuevo Usuario</span>
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">
              {editingUser ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditingUser(null); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nombre Completo</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="juan@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel" required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text" required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    placeholder="Calle Principal 123"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl transition-all font-medium"
              >
                {editingUser ? 'Actualizar Usuario' : 'Guardar Usuario'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingUser(null); }}
                className="bg-muted hover:bg-muted/80 text-muted-foreground px-6 py-2.5 rounded-xl transition-all font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>{filteredUsers.length} usuarios</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registro</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{user.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.registrationDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg text-muted-foreground mb-2">No se encontraron usuarios</h3>
            <p className="text-sm text-muted-foreground/70">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
