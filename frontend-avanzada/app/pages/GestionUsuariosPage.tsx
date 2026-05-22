import { useState } from 'react';
import { useRole } from '@/app/context/RoleContext';
import { MOCK_ALL_USERS } from '@/app/data/mockStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Users, ShieldOff, Search } from 'lucide-react';

const ROLE_BADGE: Record<string, { bg: string; text: string }> = {
  ESTUDIANTE: { bg: '#E3F2FD', text: '#1565C0' },
  DOCENTE: { bg: '#F3E5F5', text: '#6A1B9A' },
  ADMINISTRATIVO: { bg: '#FFF8E1', text: '#E65100' },
};

export function GestionUsuariosPage() {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [filterRol, setFilterRol] = useState('TODOS');

  if (role !== 'ADMINISTRATIVO') {
    return (
      <Card className="border-destructive/30 max-w-lg mx-auto">
        <CardHeader className="flex flex-row items-center gap-2">
          <ShieldOff className="w-5 h-5 text-destructive" />
          <CardTitle className="text-destructive">Acceso No Autorizado</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-muted-foreground text-sm">Esta sección es exclusiva del rol Administrativo.</p>
        </CardContent>
      </Card>
    );
  }

  const filtered = MOCK_ALL_USERS.filter((u) => {
    const matchRol = filterRol === 'TODOS' || u.rol === filterRol;
    const matchSearch =
      !search ||
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRol && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-[#2E7D32]" />
        <h1 className="text-xl font-bold text-[#212121]">Gestión de Usuarios</h1>
        <span className="ml-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-2 py-0.5 rounded-full">{filtered.length}</span>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o correo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Select value={filterRol} onValueChange={setFilterRol}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODOS">Todos los roles</SelectItem>
                <SelectItem value="ESTUDIANTE">Estudiante</SelectItem>
                <SelectItem value="DOCENTE">Docente</SelectItem>
                <SelectItem value="ADMINISTRATIVO">Administrativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#E8F5E9] border-b border-[#A5D6A7]">
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Correo</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Rol</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No se encontraron usuarios</td></tr>
              )}
              {filtered.map((u, i) => {
                const rb = ROLE_BADGE[u.rol] || { bg: '#eee', text: '#333' };
                return (
                  <tr key={u.userId} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'} hover:bg-[#E8F5E9] transition-colors`}>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.userId}</td>
                    <td className="px-4 py-3 font-medium text-[#212121]">{u.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ backgroundColor: rb.bg, color: rb.text }}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${u.activo ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-gray-100 text-gray-500'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
