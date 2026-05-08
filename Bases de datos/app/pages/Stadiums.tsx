import { useState } from "react";
import { Plus, MapPin, Users as UsersIcon, Building2 } from "lucide-react";

export default function Stadiums() {
  const [showModal, setShowModal] = useState(false);

  const stadiums = [
    {
      id: 1,
      name: "Estadio Azteca",
      city: "Ciudad de México",
      country: "México",
      capacity: "87,523",
      image: "stadium1"
    },
    {
      id: 2,
      name: "MetLife Stadium",
      city: "Nueva Jersey",
      country: "Estados Unidos",
      capacity: "82,500",
      image: "stadium2"
    },
    {
      id: 3,
      name: "SoFi Stadium",
      city: "Los Ángeles",
      country: "Estados Unidos",
      capacity: "70,240",
      image: "stadium3"
    },
    {
      id: 4,
      name: "BMO Field",
      city: "Toronto",
      country: "Canadá",
      capacity: "45,500",
      image: "stadium4"
    },
    {
      id: 5,
      name: "AT&T Stadium",
      city: "Dallas",
      country: "Estados Unidos",
      capacity: "80,000",
      image: "stadium5"
    },
    {
      id: 6,
      name: "Mercedes-Benz Stadium",
      city: "Atlanta",
      country: "Estados Unidos",
      capacity: "71,000",
      image: "stadium6"
    },
  ];

  const cities = [
    { name: "Ciudad de México", country: "México", stadiums: 1 },
    { name: "Los Ángeles", country: "Estados Unidos", stadiums: 1 },
    { name: "Toronto", country: "Canadá", stadiums: 1 },
    { name: "Nueva Jersey", country: "Estados Unidos", stadiums: 1 },
    { name: "Dallas", country: "Estados Unidos", stadiums: 1 },
    { name: "Atlanta", country: "Estados Unidos", stadiums: 1 },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadios y Ciudades</h1>
          <p className="text-gray-600">Administra las sedes del Mundial FIFA 2026</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-world-cup-turquoise to-world-cup-blue text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Agregar Estadio
        </button>
      </div>

      {/* Cities Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ciudades Sede</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-gray-200 hover:border-world-cup-turquoise hover:shadow-md transition-all text-center"
            >
              <MapPin className="w-8 h-8 text-world-cup-turquoise mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{city.name}</h3>
              <p className="text-xs text-gray-600">{city.country}</p>
              <p className="text-xs text-world-cup-turquoise mt-2 font-medium">
                {city.stadiums} estadio(s)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stadiums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stadiums.map((stadium) => (
          <div
            key={stadium.id}
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Stadium Image */}
            <div className="h-48 bg-gradient-to-br from-world-cup-turquoise via-world-cup-blue to-world-cup-purple relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-white/30" />
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-900">
                  {stadium.country}
                </span>
              </div>
            </div>

            {/* Stadium Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{stadium.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-world-cup-turquoise" />
                  <span className="text-sm">{stadium.city}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <UsersIcon className="w-5 h-5 text-world-cup-turquoise" />
                  <span className="text-sm">Capacidad: {stadium.capacity}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  Editar
                </button>
                <button className="flex-1 py-2 bg-gradient-to-r from-world-cup-turquoise to-world-cup-blue text-white rounded-lg hover:shadow-md transition-all text-sm font-medium">
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-world-cup-turquoise/5 to-world-cup-blue/5">
              <h2 className="text-2xl font-bold text-gray-900">Agregar Nuevo Estadio</h2>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Estadio</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-turquoise focus:border-transparent"
                      placeholder="Ej: Estadio Azteca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-turquoise focus:border-transparent"
                      placeholder="Ej: Ciudad de México"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-turquoise focus:border-transparent">
                      <option value="">Seleccionar...</option>
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Canadá">Canadá</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-world-cup-turquoise focus:border-transparent"
                      placeholder="Ej: 87,523"
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
                className="px-6 py-2 bg-gradient-to-r from-world-cup-turquoise to-world-cup-blue text-white rounded-lg hover:shadow-lg transition-all"
              >
                Guardar Estadio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
