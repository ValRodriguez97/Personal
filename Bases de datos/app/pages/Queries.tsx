import { useState } from "react";
import { Search, Database, Filter, Download } from "lucide-react";

export default function Queries() {
  const [selectedQuery, setSelectedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const queries = [
    {
      id: "1",
      name: "Jugador más costoso por confederación",
      description: "Muestra el jugador con mayor valor de mercado de cada confederación"
    },
    {
      id: "2",
      name: "Partidos por estadio",
      description: "Lista todos los partidos programados en cada estadio"
    },
    {
      id: "3",
      name: "Equipo más costoso por país anfitrión",
      description: "Muestra el equipo con mayor valor total por cada país sede"
    },
    {
      id: "4",
      name: "Jugadores menores de 21 años",
      description: "Lista todos los jugadores jóvenes participantes"
    },
    {
      id: "5",
      name: "Directores técnicos por confederación",
      description: "Agrupa los DT según su confederación"
    },
    {
      id: "6",
      name: "Estadios con mayor capacidad",
      description: "Ordena los estadios por capacidad de mayor a menor"
    },
  ];

  const sampleResults = [
    { confederation: "CONMEBOL", player: "Lionel Messi", value: "$50M", team: "Argentina" },
    { confederation: "UEFA", player: "Kylian Mbappé", value: "$48M", team: "Francia" },
    { confederation: "CONCACAF", player: "Christian Pulisic", value: "$22M", team: "Estados Unidos" },
    { confederation: "AFC", player: "Son Heung-min", value: "$35M", team: "Corea del Sur" },
  ];

  const handleExecuteQuery = () => {
    setResults(sampleResults);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultas del Sistema</h1>
        <p className="text-gray-600">Ejecuta consultas avanzadas sobre los datos del Mundial FIFA 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-world-cup-purple" />
              <h2 className="text-xl font-semibold text-gray-900">Consultas Disponibles</h2>
            </div>

            <div className="space-y-3">
              {queries.map((query) => (
                <button
                  key={query.id}
                  onClick={() => setSelectedQuery(query.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedQuery === query.id
                      ? "border-world-cup-purple bg-purple-50"
                      : "border-gray-200 hover:border-world-cup-purple/50 hover:bg-gray-50"
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{query.name}</h3>
                  <p className="text-sm text-gray-600">{query.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Query Execution and Results */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-world-cup-purple" />
              Filtros Avanzados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
                <option value="">Confederación</option>
                <option value="CONMEBOL">CONMEBOL</option>
                <option value="UEFA">UEFA</option>
                <option value="CONCACAF">CONCACAF</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-purple focus:border-transparent">
                <option value="">País</option>
                <option value="México">México</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Canadá">Canadá</option>
              </select>
            </div>
            <button
              onClick={handleExecuteQuery}
              disabled={!selectedQuery}
              className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                selectedQuery
                  ? "bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white hover:shadow-lg"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Search className="w-5 h-5" />
              Ejecutar Consulta
            </button>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-purple/5 to-world-cup-blue/5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Resultados</h2>
                {results.length > 0 && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Selecciona y ejecuta una consulta para ver los resultados</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Confederación</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Jugador</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Equipo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {result.confederation}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900">{result.player}</td>
                          <td className="px-4 py-3 text-gray-600">{result.team}</td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-world-cup-purple">{result.value}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <span>Mostrando {results.length} resultado(s)</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Anterior</button>
                      <span className="px-3 py-1">Página 1 de 1</span>
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Siguiente</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
