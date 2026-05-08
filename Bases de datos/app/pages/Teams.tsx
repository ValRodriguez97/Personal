import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";

export default function Teams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const teams = [
    { id: 1, name: "Argentina", confederation: "CONMEBOL", country: "Argentina", coach: "Lionel Scaloni", value: "$850M" },
    { id: 2, name: "Brasil", confederation: "CONMEBOL", country: "Brasil", coach: "Fernando Diniz", value: "$920M" },
    { id: 3, name: "México", confederation: "CONCACAF", country: "México", coach: "Jaime Lozano", value: "$280M" },
    { id: 4, name: "Estados Unidos", confederation: "CONCACAF", country: "Estados Unidos", coach: "Gregg Berhalter", value: "$310M" },
    { id: 5, name: "España", confederation: "UEFA", country: "España", coach: "Luis de la Fuente", value: "$780M" },
    { id: 6, name: "Francia", confederation: "UEFA", country: "Francia", coach: "Didier Deschamps", value: "$890M" },
    { id: 7, name: "Alemania", confederation: "UEFA", country: "Alemania", coach: "Julian Nagelsmann", value: "$740M" },
    { id: 8, name: "Inglaterra", confederation: "UEFA", country: "Inglaterra", coach: "Gareth Southgate", value: "$810M" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Equipos</h1>
          <p className="text-gray-600">Administra los equipos participantes del Mundial FIFA 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Crear Equipo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
            <option value="">Todas las confederaciones</option>
            <option value="CONMEBOL">CONMEBOL</option>
            <option value="UEFA">UEFA</option>
            <option value="CONCACAF">CONCACAF</option>
            <option value="AFC">AFC</option>
            <option value="CAF">CAF</option>
            <option value="OFC">OFC</option>
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
            <Filter className="w-5 h-5" />
            Más filtros
          </button>
        </div>
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-world-cup-purple/10 to-world-cup-blue/10 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Equipo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Confederación</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">País</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Director Técnico</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Valor Total</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-world-cup-purple to-world-cup-blue flex items-center justify-center text-white font-bold">
                        {team.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      {team.confederation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{team.country}</td>
                  <td className="px-6 py-4 text-gray-700">{team.coach}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-world-cup-purple">{team.value}</span>
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Equipo</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Equipo</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="Ej: Argentina"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confederación</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="CONMEBOL">CONMEBOL</option>
                      <option value="UEFA">UEFA</option>
                      <option value="CONCACAF">CONCACAF</option>
                      <option value="AFC">AFC</option>
                      <option value="CAF">CAF</option>
                      <option value="OFC">OFC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="Ej: Argentina"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Director Técnico</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="Ej: Lionel Scaloni"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor Total</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent"
                      placeholder="Ej: $850M"
                    />
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
                Guardar Equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
