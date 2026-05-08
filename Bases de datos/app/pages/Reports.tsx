import { FileText, Download, Eye, Calendar, BarChart } from "lucide-react";

export default function Reports() {
  const reports = [
    {
      id: 1,
      name: "Reporte General de Equipos",
      description: "Información completa de todos los equipos participantes",
      date: "2026-05-08",
      type: "PDF",
      pages: 45
    },
    {
      id: 2,
      name: "Estadísticas de Jugadores",
      description: "Análisis detallado de jugadores por confederación",
      date: "2026-05-08",
      type: "PDF",
      pages: 128
    },
    {
      id: 3,
      name: "Calendario de Partidos",
      description: "Programación completa del torneo",
      date: "2026-05-08",
      type: "PDF",
      pages: 32
    },
    {
      id: 4,
      name: "Análisis de Estadios",
      description: "Detalles de capacidad y ubicación de estadios",
      date: "2026-05-08",
      type: "PDF",
      pages: 18
    },
    {
      id: 5,
      name: "Reporte de Usuarios del Sistema",
      description: "Actividad y permisos de usuarios",
      date: "2026-05-08",
      type: "PDF",
      pages: 12
    },
    {
      id: 6,
      name: "Bitácora de Auditoría",
      description: "Registro completo de accesos al sistema",
      date: "2026-05-08",
      type: "PDF",
      pages: 56
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes del Sistema</h1>
        <p className="text-gray-600">Genera y descarga reportes en formato PDF</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Reportes", value: "6", icon: FileText, color: "from-world-cup-purple to-purple-700" },
          { label: "Generados Hoy", value: "3", icon: Calendar, color: "from-world-cup-blue to-blue-700" },
          { label: "Páginas Totales", value: "291", icon: BarChart, color: "from-world-cup-turquoise to-teal-600" },
          { label: "Descargas", value: "45", icon: Download, color: "from-world-cup-magenta to-pink-700" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all"
            >
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

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Report Header */}
            <div className="bg-gradient-to-r from-world-cup-purple via-world-cup-blue to-world-cup-turquoise p-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                {report.type}
              </span>
            </div>

            {/* Report Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium text-gray-900">{report.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Páginas:</span>
                  <span className="font-medium text-gray-900">{report.pages}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  Vista Previa
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white rounded-lg hover:shadow-md transition-all text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-purple/5 to-world-cup-blue/5">
          <h2 className="text-xl font-semibold text-gray-900">Vista Previa de Reporte</h2>
        </div>
        <div className="p-12 bg-gray-50">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* PDF Preview Mock */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-world-cup-purple via-world-cup-blue to-world-cup-turquoise p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <FileText className="w-12 h-12" />
                <div>
                  <h1 className="text-3xl font-bold">FIFA World Cup 2026</h1>
                  <p className="text-white/90">Reporte General de Equipos</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  El presente reporte contiene información detallada sobre los 32 equipos participantes
                  en el Mundial FIFA 2026, organizado conjuntamente por México, Estados Unidos y Canadá.
                </p>
                <div className="grid grid-cols-3 gap-4 my-6">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-world-cup-purple">32</p>
                    <p className="text-sm text-gray-600">Equipos</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-world-cup-blue">736</p>
                    <p className="text-sm text-gray-600">Jugadores</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-world-cup-turquoise">6</p>
                    <p className="text-sm text-gray-600">Confederaciones</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 italic">
                  Fecha de generación: {new Date().toLocaleDateString()} | Sistema de Gestión FIFA 2026
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-world-cup-purple to-world-cup-magenta text-white rounded-lg hover:shadow-lg transition-all font-medium">
              <Download className="w-5 h-5" />
              Descargar Reporte Completo (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
