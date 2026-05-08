import { useState } from "react";
import { Plus, Calendar, MapPin, Clock, Users } from "lucide-react";

export default function Matches() {
  const [showModal, setShowModal] = useState(false);

  const matches = [
    {
      id: 1,
      team1: "México",
      team2: "Argentina",
      date: "2026-06-11",
      time: "18:00",
      stadium: "Estadio Azteca",
      city: "Ciudad de México",
      group: "Grupo A",
      phase: "Fase de Grupos"
    },
    {
      id: 2,
      team1: "Estados Unidos",
      team2: "Brasil",
      date: "2026-06-12",
      time: "20:00",
      stadium: "MetLife Stadium",
      city: "Nueva Jersey",
      group: "Grupo B",
      phase: "Fase de Grupos"
    },
    {
      id: 3,
      team1: "Canadá",
      team2: "España",
      date: "2026-06-13",
      time: "15:00",
      stadium: "BMO Field",
      city: "Toronto",
      group: "Grupo C",
      phase: "Fase de Grupos"
    },
    {
      id: 4,
      team1: "Francia",
      team2: "Inglaterra",
      date: "2026-06-14",
      time: "19:00",
      stadium: "SoFi Stadium",
      city: "Los Ángeles",
      group: "Grupo D",
      phase: "Fase de Grupos"
    },
    {
      id: 5,
      team1: "Alemania",
      team2: "Portugal",
      date: "2026-06-15",
      time: "16:00",
      stadium: "Arrowhead Stadium",
      city: "Kansas City",
      group: "Grupo E",
      phase: "Fase de Grupos"
    },
    {
      id: 6,
      team1: "Argentina",
      team2: "Uruguay",
      date: "2026-06-16",
      time: "21:00",
      stadium: "Mercedes-Benz Stadium",
      city: "Atlanta",
      group: "Grupo F",
      phase: "Fase de Grupos"
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Partidos</h1>
          <p className="text-gray-600">Administra los encuentros del Mundial FIFA 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-world-cup-magenta to-world-cup-red text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Programar Partido
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
            <option value="">Todas las fases</option>
            <option value="Fase de Grupos">Fase de Grupos</option>
            <option value="Octavos">Octavos de Final</option>
            <option value="Cuartos">Cuartos de Final</option>
            <option value="Semifinal">Semifinal</option>
            <option value="Final">Final</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
            <option value="">Todos los grupos</option>
            <option value="A">Grupo A</option>
            <option value="B">Grupo B</option>
            <option value="C">Grupo C</option>
            <option value="D">Grupo D</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
            <option value="">Todas las ciudades</option>
            <option value="Ciudad de México">Ciudad de México</option>
            <option value="Los Ángeles">Los Ángeles</option>
            <option value="Toronto">Toronto</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent"
          />
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Match Header */}
            <div className="bg-gradient-to-r from-world-cup-magenta to-world-cup-red p-4">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {match.phase}
                </span>
                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {match.group}
                </span>
              </div>
            </div>

            {/* Teams Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                {/* Team 1 */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-world-cup-purple to-world-cup-blue flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {match.team1.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{match.team1}</h3>
                  </div>
                </div>

                {/* VS */}
                <div className="px-6">
                  <span className="text-2xl font-bold text-gray-400">VS</span>
                </div>

                {/* Team 2 */}
                <div className="flex items-center gap-3 flex-1 flex-row-reverse">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-world-cup-turquoise to-world-cup-blue flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {match.team2.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-gray-900">{match.team2}</h3>
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-5 h-5 text-world-cup-magenta" />
                  <span className="font-medium">{match.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-5 h-5 text-world-cup-magenta" />
                  <span className="font-medium">{match.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-5 h-5 text-world-cup-magenta" />
                  <span className="font-medium">{match.stadium}, {match.city}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  Editar
                </button>
                <button className="flex-1 py-2 bg-gradient-to-r from-world-cup-magenta to-world-cup-red text-white rounded-lg hover:shadow-md transition-all text-sm font-medium">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-magenta/5 to-world-cup-red/5">
              <h2 className="text-2xl font-bold text-gray-900">Programar Nuevo Partido</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipo Local</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Brasil">Brasil</option>
                      <option value="México">México</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipo Visitante</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Francia">Francia</option>
                      <option value="Alemania">Alemania</option>
                      <option value="España">España</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estadio</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Estadio Azteca">Estadio Azteca</option>
                      <option value="MetLife Stadium">MetLife Stadium</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Ciudad de México">Ciudad de México</option>
                      <option value="Nueva Jersey">Nueva Jersey</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fase</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
                      <option value="Fase de Grupos">Fase de Grupos</option>
                      <option value="Octavos">Octavos de Final</option>
                      <option value="Cuartos">Cuartos de Final</option>
                      <option value="Semifinal">Semifinal</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-magenta focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="Grupo A">Grupo A</option>
                      <option value="Grupo B">Grupo B</option>
                      <option value="Grupo C">Grupo C</option>
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
                className="px-6 py-2 bg-gradient-to-r from-world-cup-magenta to-world-cup-red text-white rounded-lg hover:shadow-lg transition-all"
              >
                Guardar Partido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
