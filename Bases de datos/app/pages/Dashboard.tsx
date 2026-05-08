import { Trophy, Users, Building2, CalendarDays, Settings, TrendingUp, Award, Target } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      icon: Trophy,
      label: "Equipos",
      value: "32",
      change: "+0%",
      color: "from-world-cup-purple to-purple-700",
      bgColor: "bg-purple-50"
    },
    {
      icon: Users,
      label: "Jugadores",
      value: "736",
      change: "+23",
      color: "from-world-cup-blue to-blue-700",
      bgColor: "bg-blue-50"
    },
    {
      icon: Building2,
      label: "Estadios",
      value: "16",
      change: "+0%",
      color: "from-world-cup-turquoise to-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      icon: CalendarDays,
      label: "Partidos",
      value: "104",
      change: "+12",
      color: "from-world-cup-magenta to-pink-700",
      bgColor: "bg-pink-50"
    },
    {
      icon: Settings,
      label: "Usuarios",
      value: "15",
      change: "+2",
      color: "from-world-cup-red to-red-700",
      bgColor: "bg-red-50"
    },
    {
      icon: Target,
      label: "Grupos",
      value: "8",
      change: "+0%",
      color: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-50"
    },
  ];

  const recentMatches = [
    { team1: "México", team2: "Argentina", date: "2026-06-11", stadium: "Estadio Azteca", group: "Grupo A" },
    { team1: "Estados Unidos", team2: "Brasil", date: "2026-06-12", stadium: "MetLife Stadium", group: "Grupo B" },
    { team1: "Canadá", team2: "España", date: "2026-06-13", stadium: "BMO Field", group: "Grupo C" },
  ];

  const topPlayers = [
    { name: "Lionel Messi", team: "Argentina", value: "$50M", position: "Delantero" },
    { name: "Kylian Mbappé", team: "Francia", value: "$48M", position: "Delantero" },
    { name: "Erling Haaland", team: "Noruega", value: "$45M", position: "Delantero" },
    { name: "Vinicius Jr", team: "Brasil", value: "$42M", position: "Extremo" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vista general del sistema FIFA World Cup 2026</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`h-1 ${stat.bgColor}`}></div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-world-cup-purple/5 to-world-cup-blue/5">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-6 h-6 text-world-cup-purple" />
              <h2 className="text-xl font-semibold text-gray-900">Próximos Partidos</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 hover:border-world-cup-purple hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{match.team1}</span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-semibold text-gray-900">{match.team2}</span>
                    </div>
                    <span className="text-xs font-medium text-world-cup-purple bg-purple-50 px-2 py-1 rounded">
                      {match.group}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {match.stadium}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-world-cup-blue/5 to-world-cup-turquoise/5">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-world-cup-blue" />
              <h2 className="text-xl font-semibold text-gray-900">Jugadores Destacados</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPlayers.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-world-cup-blue hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-world-cup-blue to-world-cup-turquoise flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{player.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{player.team}</span>
                      <span>•</span>
                      <span>{player.position}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-world-cup-blue">{player.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-world-cup-purple via-world-cup-blue to-world-cup-turquoise rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left border border-white/20">
            <Trophy className="w-8 h-8 mb-2" />
            <p className="font-semibold">Nuevo Equipo</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left border border-white/20">
            <Users className="w-8 h-8 mb-2" />
            <p className="font-semibold">Nuevo Jugador</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left border border-white/20">
            <CalendarDays className="w-8 h-8 mb-2" />
            <p className="font-semibold">Nuevo Partido</p>
          </button>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg p-4 transition-all text-left border border-white/20">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="font-semibold">Ver Reportes</p>
          </button>
        </div>
      </div>
    </div>
  );
}
