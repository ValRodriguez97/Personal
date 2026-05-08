import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Filter, User } from "lucide-react";

export default function Players() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const players = [
    { id: 1, name: "Lionel Messi", age: 38, position: "Delantero", team: "Argentina", value: "$50M", height: "1.70m", weight: "72kg" },
    { id: 2, name: "Kylian Mbappé", age: 27, position: "Delantero", team: "Francia", value: "$48M", height: "1.78m", weight: "73kg" },
    { id: 3, name: "Erling Haaland", age: 25, position: "Delantero", team: "Noruega", value: "$45M", height: "1.95m", weight: "88kg" },
    { id: 4, name: "Vinicius Jr", age: 25, position: "Extremo", team: "Brasil", value: "$42M", height: "1.76m", weight: "73kg" },
    { id: 5, name: "Jude Bellingham", age: 22, position: "Centrocampista", team: "Inglaterra", value: "$40M", height: "1.86m", weight: "75kg" },
    { id: 6, name: "Pedri González", age: 23, position: "Centrocampista", team: "España", value: "$38M", height: "1.74m", weight: "60kg" },
    { id: 7, name: "Hirving Lozano", age: 30, position: "Extremo", team: "México", value: "$18M", height: "1.75m", weight: "70kg" },
    { id: 8, name: "Christian Pulisic", age: 27, position: "Extremo", team: "Estados Unidos", value: "$22M", height: "1.77m", weight: "69kg" },
  ];

  const positionColors: Record<string, string> = {
    "Delantero": "bg-red-100 text-red-700",
    "Extremo": "bg-orange-100 text-orange-700",
    "Centrocampista": "bg-blue-100 text-blue-700",
    "Defensa": "bg-green-100 text-green-700",
    "Portero": "bg-purple-100 text-purple-700",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Jugadores</h1>
          <p className="text-gray-600">Administra los jugadores del Mundial FIFA 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-world-cup-blue to-world-cup-turquoise text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Agregar Jugador
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent">
            <option value="">Todas las posiciones</option>
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Centrocampista">Centrocampista</option>
            <option value="Extremo">Extremo</option>
            <option value="Delantero">Delantero</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent">
            <option value="">Todos los equipos</option>
            <option value="Argentina">Argentina</option>
            <option value="Brasil">Brasil</option>
            <option value="México">México</option>
            <option value="Francia">Francia</option>
          </select>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Player Header with Photo */}
            <div className="bg-gradient-to-br from-world-cup-blue to-world-cup-turquoise p-6 pb-16 relative">
              <div className="flex justify-end gap-2 mb-2">
                <button className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all">
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Player Photo Circle */}
            <div className="relative -mt-12 mb-4">
              <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            </div>

            {/* Player Info */}
            <div className="px-6 pb-6">
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">{player.name}</h3>
              <p className="text-sm text-gray-600 text-center mb-4">{player.team}</p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${positionColors[player.position] || "bg-gray-100 text-gray-700"}`}>
                  {player.position}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {player.age} años
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-semibold text-world-cup-blue">{player.value}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estatura:</span>
                  <span className="font-medium text-gray-900">{player.height}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-medium text-gray-900">{player.weight}</span>
                </div>
              </div>

              <button className="w-full py-2 bg-gradient-to-r from-world-cup-blue to-world-cup-turquoise text-white rounded-lg hover:shadow-md transition-all text-sm font-medium">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-blue/5 to-world-cup-turquoise/5">
              <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Jugador</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent"
                      placeholder="Ej: Lionel Messi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent"
                      placeholder="Ej: 27"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Posición</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Portero">Portero</option>
                      <option value="Defensa">Defensa</option>
                      <option value="Centrocampista">Centrocampista</option>
                      <option value="Extremo">Extremo</option>
                      <option value="Delantero">Delantero</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipo</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Brasil">Brasil</option>
                      <option value="México">México</option>
                      <option value="Francia">Francia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent"
                      placeholder="Ej: $50M"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estatura</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent"
                      placeholder="Ej: 1.70m"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-blue focus:border-transparent"
                      placeholder="Ej: 72kg"
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
                className="px-6 py-2 bg-gradient-to-r from-world-cup-blue to-world-cup-turquoise text-white rounded-lg hover:shadow-lg transition-all"
              >
                Guardar Jugador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
