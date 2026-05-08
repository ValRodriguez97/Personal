import { useState } from "react";
import { ClipboardList, Calendar, Clock, User, Download, Filter } from "lucide-react";

export default function AuditLog() {
  const [dateFilter, setDateFilter] = useState("");

  const auditLogs = [
    { id: 1, user: "Carlos Martínez", email: "carlos@fifa2026.com", loginDate: "2026-05-08", loginTime: "14:30:15", logoutDate: "2026-05-08", logoutTime: "18:45:22" },
    { id: 2, user: "Ana García", email: "ana@fifa2026.com", loginDate: "2026-05-08", loginTime: "10:15:42", logoutDate: "2026-05-08", logoutTime: "17:30:10" },
    { id: 3, user: "Luis Hernández", email: "luis@fifa2026.com", loginDate: "2026-05-07", loginTime: "16:45:33", logoutDate: "2026-05-07", logoutTime: "20:15:48" },
    { id: 4, user: "María López", email: "maria@fifa2026.com", loginDate: "2026-05-05", loginTime: "09:20:18", logoutDate: "2026-05-05", logoutTime: "15:50:35" },
    { id: 5, user: "Patricia Ruiz", email: "patricia@fifa2026.com", loginDate: "2026-05-08", loginTime: "08:00:05", logoutDate: "2026-05-08", logoutTime: "16:25:40" },
    { id: 6, user: "Jorge Ramírez", email: "jorge@fifa2026.com", loginDate: "2026-04-28", loginTime: "11:30:25", logoutDate: "2026-04-28", logoutTime: "13:45:12" },
    { id: 7, user: "Carlos Martínez", email: "carlos@fifa2026.com", loginDate: "2026-05-07", loginTime: "09:15:30", logoutDate: "2026-05-07", logoutTime: "18:00:55" },
    { id: 8, user: "Ana García", email: "ana@fifa2026.com", loginDate: "2026-05-06", loginTime: "11:00:20", logoutDate: "2026-05-06", logoutTime: "16:45:33" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bitácora del Sistema</h1>
          <p className="text-gray-600">Registro de auditoría de accesos al sistema FIFA 2026</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
          <Download className="w-5 h-5" />
          Exportar Bitácora
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Accesos", value: "145", icon: ClipboardList, color: "from-world-cup-purple to-purple-700" },
          { label: "Accesos Hoy", value: "23", icon: Calendar, color: "from-world-cup-blue to-blue-700" },
          { label: "Usuarios Activos", value: "8", icon: User, color: "from-world-cup-turquoise to-teal-600" },
          { label: "Tiempo Promedio", value: "6.5h", icon: Clock, color: "from-world-cup-magenta to-pink-700" },
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
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-world-cup-purple" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
            <option value="">Todos los periodos</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white rounded-lg hover:shadow-lg transition-all">
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-purple/5 to-world-cup-blue/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Registro de Auditoría</h2>
            <span className="text-sm text-gray-600">
              Mostrando {auditLogs.length} registros
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha Ingreso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hora Ingreso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha Salida</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Hora Salida</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Duración</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLogs.map((log) => {
                const loginDateTime = new Date(`${log.loginDate}T${log.loginTime}`);
                const logoutDateTime = new Date(`${log.logoutDate}T${log.logoutTime}`);
                const duration = Math.round((logoutDateTime.getTime() - loginDateTime.getTime()) / (1000 * 60 * 60 * 10)) / 100;

                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-world-cup-purple to-world-cup-blue flex items-center justify-center text-white font-semibold text-sm">
                          {log.user.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                        <span className="font-semibold text-gray-900">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{log.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-world-cup-purple" />
                        {log.loginDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-world-cup-purple" />
                        {log.loginTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-world-cup-magenta" />
                        {log.logoutDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-world-cup-magenta" />
                        {log.logoutTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {duration}h
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Página 1 de 10
            </span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-all text-sm font-medium">
                Anterior
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white rounded-lg hover:shadow-md transition-all text-sm font-medium">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
