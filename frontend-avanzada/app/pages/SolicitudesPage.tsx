import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRole } from '@/app/context/RoleContext';
import { useMockStore, updateSolicitud, Estado, TipoSolicitud, Prioridad } from '@/app/data/mockStore';
import { StatusBadge } from '@/app/components/StatusBadge';
import { PriorityBadge } from '@/app/components/PriorityBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Eye, XCircle, PlusCircle, Filter } from 'lucide-react';

const ESTADOS: Estado[] = ['REGISTRADA', 'CLASIFICADA', 'EN_ATENCION', 'ATENDIDA', 'CERRADA', 'CANCELADA'];
const TIPOS: TipoSolicitud[] = ['ACADEMICA', 'ADMINISTRATIVA', 'FINANCIERA', 'TECNICA'];
const PRIORIDADES: Prioridad[] = ['CRÍTICA', 'ALTA', 'MEDIA', 'BAJA'];

export function SolicitudesPage() {
  const { role, currentUser } = useRole();
  const { solicitudes } = useMockStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const initEstado = searchParams.get('estado') || 'TODOS';
  const [filterEstado, setFilterEstado] = useState(initEstado);
  const [filterTipo, setFilterTipo] = useState('TODOS');
  const [filterPrioridad, setFilterPrioridad] = useState('TODOS');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const isEstudiante = role === 'ESTUDIANTE';
  const title = isEstudiante ? 'Mis Solicitudes' : 'Todas las Solicitudes';

  const filtered = solicitudes.filter((s) => {
    if (isEstudiante && s.solicitanteId !== currentUser?.userId) return false;
    if (filterEstado !== 'TODOS' && s.estado !== filterEstado) return false;
    if (filterTipo !== 'TODOS' && s.tipo !== filterTipo) return false;
    if (filterPrioridad !== 'TODOS' && s.prioridad !== filterPrioridad) return false;
    return true;
  });

  const handleCancel = () => {
    if (!cancelTarget || !currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const sol = solicitudes.find((s) => s.id === cancelTarget);
    if (!sol) return;
    updateSolicitud(cancelTarget, {
      estado: 'CANCELADA',
      historial: [...sol.historial, { fecha: today, accion: 'Solicitud cancelada', usuario: currentUser.nombre }],
    });
    toast({ title: 'Solicitud cancelada', description: `La solicitud ${cancelTarget} fue cancelada.` });
    setCancelTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-[#2E7D32]" />
          <h1 className="text-xl font-bold text-[#212121]">{title}</h1>
          <span className="ml-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-2 py-0.5 rounded-full">{filtered.length}</span>
        </div>
        {isEstudiante && (
          <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white gap-2" onClick={() => navigate('/solicitudes/nueva')}>
            <PlusCircle className="w-4 h-4" /> Nueva Solicitud
          </Button>
        )}
      </div>

      {/* Filters */}
      {!isEstudiante && (
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium text-muted-foreground mr-1">Filtros:</span>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los estados</SelectItem>
                  {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los tipos</SelectItem>
                  {TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterPrioridad} onValueChange={setFilterPrioridad}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todas las prioridades</SelectItem>
                  {PRIORIDADES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {(filterEstado !== 'TODOS' || filterTipo !== 'TODOS' || filterPrioridad !== 'TODOS') && (
                <Button type="button" variant="ghost" size="sm" className="h-8 text-xs"
                  onClick={() => { setFilterEstado('TODOS'); setFilterTipo('TODOS'); setFilterPrioridad('TODOS'); }}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#E8F5E9] border-b border-[#A5D6A7]">
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20] w-24">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20] max-w-xs">Descripción</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Prioridad</th>
                {!isEstudiante && <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Solicitante</th>}
                {!isEstudiante && <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Responsable</th>}
                {isEstudiante && <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">F. Registro</th>}
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">F. Límite</th>
                <th className="text-left px-4 py-3 font-semibold text-[#1B5E20]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-muted-foreground">
                    No se encontraron solicitudes
                  </td>
                </tr>
              )}
              {filtered.map((s, i) => {
                const isHighlight = !isEstudiante && s.estado === 'CLASIFICADA' && s.responsableId;
                return (
                  <tr
                    key={s.id}
                    className={[
                      i % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]',
                      isHighlight ? 'border-l-4 border-l-[#EF6C00]' : '',
                      'hover:bg-[#E8F5E9] transition-colors',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#1B5E20] font-semibold">{s.id}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{s.tipo}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate text-[#212121]" title={s.descripcion}>{s.descripcion}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge estado={s.estado} /></td>
                    <td className="px-4 py-3"><PriorityBadge prioridad={s.prioridad} /></td>
                    {!isEstudiante && <td className="px-4 py-3 text-xs">{s.solicitanteNombre}</td>}
                    {!isEstudiante && (
                      <td className="px-4 py-3 text-xs">
                        {s.responsableNombre
                          ? s.responsableNombre
                          : <span className="text-muted-foreground italic">Sin asignar</span>}
                      </td>
                    )}
                    {isEstudiante && <td className="px-4 py-3 text-xs">{s.fechaRegistro}</td>}
                    <td className="px-4 py-3 text-xs">{s.fechaLimite || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1 text-[#2E7D32] border-[#A5D6A7] hover:bg-[#E8F5E9]"
                          onClick={() => navigate(`/solicitudes/${s.id}`)}>
                          <Eye className="w-3 h-3" /> Ver
                        </Button>
                        {isEstudiante && s.estado === 'REGISTRADA' && (
                          <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setCancelTarget(s.id)}>
                            <XCircle className="w-3 h-3" /> Cancelar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cancel dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(o) => !o && setCancelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La solicitud <strong>{cancelTarget}</strong> pasará al estado CANCELADA.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCancel}>
              Sí, cancelar solicitud
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
