import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Shield, User, UserCheck } from "lucide-react";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const users = [
    { id: 1, name: "Carlos Martínez", email: "carlos@fifa2026.com", role: "Administrador", status: "Activo", lastLogin: "2026-05-08 14:30" },
    { id: 2, name: "Ana García", email: "ana@fifa2026.com", role: "Tradicional", status: "Activo", lastLogin: "2026-05-08 10:15" },
    { id: 3, name: "Luis Hernández", email: "luis@fifa2026.com", role: "Tradicional", status: "Activo", lastLogin: "2026-05-07 16:45" },
    { id: 4, name: "María López", email: "maria@fifa2026.com", role: "Esporádico", status: "Activo", lastLogin: "2026-05-05 09:20" },
    { id: 5, name: "Jorge Ramírez", email: "jorge@fifa2026.com", role: "Esporádico", status: "Inactivo", lastLogin: "2026-04-28 11:30" },
    { id: 6, name: "Patricia Ruiz", email: "patricia@fifa2026.com", role: "Tradicional", status: "Activo", lastLogin: "2026-05-08 08:00" },
  ];

  const roleColors: Record<string, { bg: string; text: string; icon: any }> = {
    "Administrador": { bg: "bg-purple-100", text: "text-purple-700", icon: Shield },
    "Tradicional": { bg: "bg-blue-100", text: "text-blue-700", icon: UserCheck },
    "Esporádico": { bg: "bg-orange-100", text: "text-orange-700", icon: User },
  };

  const statusColors: Record<string, string> = {
    "Activo": "bg-green-100 text-green-700",
    "Inactivo": "bg-red-100 text-red-700",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios del sistema FIFA 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Crear Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Usuarios", value: "15", icon: User, color: "from-world-cup-purple to-purple-700" },
          { label: "Usuarios Activos", value: "12", icon: UserCheck, color: "from-world-cup-blue to-blue-700" },
          { label: "Administradores", value: "3", icon: Shield, color: "from-world-cup-turquoise to-teal-600" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
            <option value="">Todos los roles</option>
            <option value="Administrador">Administrador</option>
            <option value="Tradicional">Tradicional</option>
            <option value="Esporádico">Esporádico</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-world-cup-purple/10 to-world-cup-blue/10 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Último Acceso</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => {
                const roleConfig = roleColors[user.role];
                const RoleIcon = roleConfig.icon;

                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-world-cup-purple to-world-cup-blue flex items-center justify-center text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className="font-semibold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.text}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-world-cup-blue hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-world-cup-red hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-purple/5 to-world-cup-magenta/5">
              <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="Ej: Carlos Martínez"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="ejemplo@fifa2026.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Tradicional">Tradicional</option>
                      <option value="Esporádico">Esporádico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white rounded-lg hover:shadow-lg transition-all"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
