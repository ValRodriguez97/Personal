import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '@/app/context/RoleContext';
import { useMockStore, updateSolicitud, MOCK_RESPONSABLES, TipoSolicitud, Prioridad } from '@/app/data/mockStore';
import { StatusBadge } from '@/app/components/StatusBadge';
import { PriorityBadge } from '@/app/components/PriorityBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, Clock, User, Calendar, Sparkles, CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

const TIPO_OPTIONS: { value: TipoSolicitud; label: string }[] = [
  { value: 'ACADEMICA', label: 'Académica' },
  { value: 'ADMINISTRATIVA', label: 'Administrativa' },
  { value: 'FINANCIERA', label: 'Financiera' },
  { value: 'TECNICA', label: 'Técnica' },
];
const PRIORIDAD_OPTIONS: { value: Prioridad; label: string }[] = [
  { value: 'CRÍTICA', label: 'Crítica' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'BAJA', label: 'Baja' },
];

const AI_SUGGESTIONS: Record<string, string> = {
  ACADEMICA: 'Se recomienda revisar el reglamento académico artículo 45 sobre revisión de notas. Plazo máximo de respuesta: 5 días hábiles.',
  ADMINISTRATIVA: 'Solicitud de gestión rutinaria. Se sugiere verificar los documentos adjuntos y validar la identidad del solicitante antes de proceder.',
  FINANCIERA: 'Verifique el comprobante de pago en el sistema financiero universitario. Coordinar con el departamento de tesorería para agilizar el proceso.',
  TECNICA: 'Escalar al equipo de soporte técnico de TI. Documentar el incidente con capturas de pantalla y datos del sistema afectado.',
};

export function DetalleSolicitudPage() {
  const { id } = useParams<{ id: string }>();
  const { role, currentUser } = useRole();
  const { getSolicitudById } = useMockStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const sol = getSolicitudById(id || '');

  // Docente action states
  const [obsInicio, setObsInicio] = useState('');
  const [obsAtendida, setObsAtendida] = useState('');
  const [obsCierre, setObsCierre] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Admin classification states
  const [clTipo, setClTipo] = useState<TipoSolicitud | ''>(sol?.tipo || '');
  const [clPrioridad, setClPrioridad] = useState<Prioridad | ''>('');
  const [asigResponsableId, setAsigResponsableId] = useState('');

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiText, setAiText] = useState(sol?.sugerenciaIA || '');
  const [aiConfirmada, setAiConfirmada] = useState(sol?.sugerenciaIAConfirmada);

  if (!sol) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center text-muted-foreground">
          Solicitud no encontrada. <Button type="button" variant="link" onClick={() => navigate('/solicitudes')}>Volver al listado</Button>
        </CardContent>
      </Card>
    );
  }

  const today = () => new Date().toISOString().split('T')[0];
  const who = currentUser?.nombre || 'Usuario';

  const pushHistorial = (accion: string, observacion?: string) => [
    ...sol.historial,
    { fecha: today(), accion, usuario: who, ...(observacion ? { observacion } : {}) },
  ];

  // ── DOCENTE ACTIONS ──────────────────────────────────────────
  const handleIniciarAtencion = () => {
    updateSolicitud(sol.id, { estado: 'EN_ATENCION', historial: pushHistorial('Atención iniciada', obsInicio || undefined) });
    toast({ title: 'Atención iniciada', description: `SOL ${sol.id} está EN ATENCIÓN.` });
    setObsInicio('');
  };
  const handleMarcarAtendida = () => {
    updateSolicitud(sol.id, { estado: 'ATENDIDA', historial: pushHistorial('Solicitud atendida', obsAtendida || undefined) });
    toast({ title: 'Solicitud atendida', description: `SOL ${sol.id} marcada como ATENDIDA.` });
    setObsAtendida('');
  };
  const handleCerrar = () => {
    if (!obsCierre.trim()) { toast({ title: 'Observación requerida', description: 'Debe ingresar una observación para cerrar la solicitud.', variant: 'destructive' }); return; }
    updateSolicitud(sol.id, { estado: 'CERRADA', historial: pushHistorial('Solicitud cerrada', obsCierre) });
    toast({ title: 'Solicitud cerrada', description: `SOL ${sol.id} fue cerrada exitosamente.` });
    setObsCierre('');
  };

  // ── ADMIN ACTIONS ────────────────────────────────────────────
  const handleClasificar = () => {
    if (!clTipo || !clPrioridad) { toast({ title: 'Campos requeridos', description: 'Seleccione tipo y prioridad.', variant: 'destructive' }); return; }
    updateSolicitud(sol.id, {
      tipo: clTipo as TipoSolicitud,
      prioridad: clPrioridad as Prioridad,
      estado: 'CLASIFICADA',
      historial: pushHistorial('Solicitud clasificada', `Tipo: ${clTipo}, Prioridad: ${clPrioridad}`),
    });
    toast({ title: 'Solicitud clasificada', description: `SOL ${sol.id} clasificada con prioridad ${clPrioridad}.` });
  };
  const handleAsignarResponsable = () => {
    if (!asigResponsableId) { toast({ title: 'Seleccione un responsable', variant: 'destructive' }); return; }
    const resp = MOCK_RESPONSABLES.find((r) => r.id === asigResponsableId);
    if (!resp) return;
    updateSolicitud(sol.id, {
      responsableId: resp.id,
      responsableNombre: resp.nombre,
      historial: pushHistorial('Responsable asignado', `Asignado a ${resp.nombre}`),
    });
    toast({ title: 'Responsable asignado', description: `${resp.nombre} es ahora responsable de ${sol.id}.` });
    setAsigResponsableId('');
  };
  const handleAdminCancel = () => {
    updateSolicitud(sol.id, { estado: 'CANCELADA', historial: pushHistorial('Solicitud cancelada por administrador') });
    toast({ title: 'Solicitud cancelada' });
    setShowCancelDialog(false);
  };

  // ── ESTUDIANTE CANCEL ────────────────────────────────────────
  const handleEstudianteCancel = () => {
    updateSolicitud(sol.id, { estado: 'CANCELADA', historial: pushHistorial('Solicitud cancelada por el solicitante') });
    toast({ title: 'Solicitud cancelada' });
    setShowCancelDialog(false);
    navigate('/solicitudes');
  };

  // ── AI ───────────────────────────────────────────────────────
  const handleConsultarIA = () => {
    setAiLoading(true);
    setTimeout(() => {
      const suggestion = AI_SUGGESTIONS[sol.tipo] || 'Revisar la solicitud según los procedimientos institucionales vigentes.';
      setAiText(suggestion);
      setAiConfirmada(null);
      updateSolicitud(sol.id, { sugerenciaIA: suggestion, sugerenciaIAConfirmada: null });
      setAiLoading(false);
    }, 1200);
  };
  const handleConfirmarIA = () => {
    updateSolicitud(sol.id, { sugerenciaIAConfirmada: true });
    setAiConfirmada(true);
    toast({ title: 'Sugerencia IA confirmada' });
  };
  const handleDescartarIA = () => {
    updateSolicitud(sol.id, { sugerenciaIAConfirmada: false });
    setAiConfirmada(false);
    toast({ title: 'Sugerencia IA descartada' });
  };

  const canCancel =
    (role === 'ESTUDIANTE' && sol.solicitanteId === currentUser?.userId && sol.estado === 'REGISTRADA') ||
    (role === 'ADMINISTRATIVO' && sol.estado !== 'CERRADA' && sol.estado !== 'CANCELADA');

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back */}
      <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/solicitudes')} className="gap-1 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Volver al listado
      </Button>

      {/* Header card */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">{sol.id}</p>
              <CardTitle className="text-lg text-[#212121]">{sol.tipo.charAt(0) + sol.tipo.slice(1).toLowerCase()} — Solicitud</CardTitle>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge estado={sol.estado} />
            <PriorityBadge prioridad={sol.prioridad} />
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          {/* Description */}
          <div className="rounded-md bg-[#F5F5F5] p-4 border border-border">
            <p className="text-xs text-muted-foreground font-medium mb-1">Descripción</p>
            <p className="text-sm text-[#212121]">{sol.descripcion}</p>
          </div>
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 shrink-0" />
              <div><p className="text-xs font-medium text-foreground">Solicitante</p><p>{sol.solicitanteNombre}</p></div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 shrink-0" />
              <div><p className="text-xs font-medium text-foreground">Responsable</p>
                <p>{sol.responsableNombre || <span className="italic text-muted-foreground">Sin asignar</span>}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <div><p className="text-xs font-medium text-foreground">Fecha Registro</p><p>{sol.fechaRegistro}</p></div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <div><p className="text-xs font-medium text-foreground">Fecha Límite</p><p>{sol.fechaLimite || '—'}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── ACTION PANELS ── */}

      {/* DOCENTE actions */}
      {role === 'DOCENTE' && (
        <Card className="shadow-sm border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-purple-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Panel de Acciones — Docente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {sol.estado === 'CLASIFICADA' && sol.responsableId && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Esta solicitud está clasificada y tiene responsable asignado. Puede iniciar la atención.</p>
                <div className="grid gap-2">
                  <Label htmlFor="obs-inicio">Observación inicial (opcional)</Label>
                  <Textarea id="obs-inicio" placeholder="Observaciones al iniciar atención..." rows={2} value={obsInicio} onChange={(e) => setObsInicio(e.target.value)} />
                </div>
                <Button type="button" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white gap-2" onClick={handleIniciarAtencion}>
                  <CheckCircle2 className="w-4 h-4" /> Iniciar Atención
                </Button>
              </div>
            )}
            {sol.estado === 'CLASIFICADA' && !sol.responsableId && (
              <div className="flex items-start gap-2 rounded-md bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                Esta solicitud aún no tiene responsable asignado. Un administrativo debe asignar uno antes de que pueda iniciarse la atención.
              </div>
            )}
            {sol.estado === 'EN_ATENCION' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">La solicitud está siendo atendida. Puede marcarla como atendida.</p>
                <div className="grid gap-2">
                  <Label htmlFor="obs-atendida">Observación (opcional)</Label>
                  <Textarea id="obs-atendida" placeholder="Describe las acciones realizadas..." rows={2} value={obsAtendida} onChange={(e) => setObsAtendida(e.target.value)} />
                </div>
                <Button type="button" className="bg-[#1565C0] hover:bg-[#0D47A1] text-white gap-2" onClick={handleMarcarAtendida}>
                  <CheckCircle2 className="w-4 h-4" /> Marcar como Atendida
                </Button>
              </div>
            )}
            {sol.estado === 'ATENDIDA' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">La solicitud está atendida. Ingrese una observación de cierre obligatoria.</p>
                <div className="grid gap-2">
                  <Label htmlFor="obs-cierre">Observación de cierre <span className="text-red-500">*</span></Label>
                  <Textarea id="obs-cierre" placeholder="Observación requerida para cerrar..." rows={3} value={obsCierre} onChange={(e) => setObsCierre(e.target.value)} />
                </div>
                <Button type="button" className="bg-[#424242] hover:bg-[#212121] text-white gap-2" onClick={handleCerrar}>
                  <XCircle className="w-4 h-4" /> Cerrar Solicitud
                </Button>
              </div>
            )}
            {['CERRADA', 'CANCELADA', 'REGISTRADA'].includes(sol.estado) && (
              <p className="text-sm text-muted-foreground italic">No hay acciones disponibles para este estado.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ADMINISTRATIVO actions */}
      {role === 'ADMINISTRATIVO' && (
        <Card className="shadow-sm border-amber-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Panel Administrativo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-5">
            {sol.estado === 'REGISTRADA' && (
              <div className="space-y-4 border rounded-md p-4 bg-[#FFFDE7]">
                <p className="text-sm font-semibold text-amber-900">Clasificar Solicitud</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Tipo</Label>
                    <Select value={clTipo} onValueChange={(v) => setClTipo(v as TipoSolicitud)}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar tipo..." /></SelectTrigger>
                      <SelectContent>
                        {TIPO_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Prioridad</Label>
                    <Select value={clPrioridad} onValueChange={(v) => setClPrioridad(v as Prioridad)}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar prioridad..." /></SelectTrigger>
                      <SelectContent>
                        {PRIORIDAD_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="button" className="bg-[#F9A825] hover:bg-[#F57F17] text-[#212121] gap-2" onClick={handleClasificar}>
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Clasificación
                </Button>
              </div>
            )}
            {sol.estado === 'CLASIFICADA' && (
              <div className="space-y-3 border rounded-md p-4 bg-[#E3F2FD]">
                <p className="text-sm font-semibold text-blue-900">Asignar Responsable</p>
                {sol.responsableId && (
                  <p className="text-xs text-blue-700">Responsable actual: <strong>{sol.responsableNombre}</strong></p>
                )}
                <div className="grid gap-2">
                  <Label>Seleccionar responsable</Label>
                  <Select value={asigResponsableId} onValueChange={setAsigResponsableId}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar docente/staff..." /></SelectTrigger>
                    <SelectContent>
                      {MOCK_RESPONSABLES.map((r) => <SelectItem key={r.id} value={r.id}>{r.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" className="bg-[#1565C0] hover:bg-[#0D47A1] text-white gap-2" onClick={handleAsignarResponsable}>
                  <User className="w-4 h-4" /> {sol.responsableId ? 'Reasignar Responsable' : 'Asignar Responsable'}
                </Button>
              </div>
            )}
            {['EN_ATENCION', 'ATENDIDA'].includes(sol.estado) && (
              <p className="text-sm text-muted-foreground italic">
                Solicitud en proceso de atención por el docente responsable. No se requieren acciones administrativas adicionales.
              </p>
            )}
            {['CERRADA', 'CANCELADA'].includes(sol.estado) && (
              <p className="text-sm text-muted-foreground italic">Solicitud finalizada. No hay acciones disponibles.</p>
            )}
            {/* Cancel (admin) */}
            {canCancel && (
              <div className="pt-2 border-t border-border">
                <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2" onClick={() => setShowCancelDialog(true)}>
                  <XCircle className="w-4 h-4" /> Cancelar Solicitud
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ESTUDIANTE cancel button on detail */}
      {role === 'ESTUDIANTE' && sol.estado === 'REGISTRADA' && sol.solicitanteId === currentUser?.userId && (
        <Card className="shadow-sm border-red-200">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">¿Desea cancelar esta solicitud? Esta acción no se puede deshacer.</p>
            <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2" onClick={() => setShowCancelDialog(true)}>
              <XCircle className="w-4 h-4" /> Cancelar Solicitud
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── AI SUGGESTION ── */}
      <Card className="shadow-sm border-[#A5D6A7]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#2E7D32] flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Sugerencia de Inteligencia Artificial
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          {!aiText && (
            <p className="text-sm text-muted-foreground">Aún no se ha consultado la IA para esta solicitud.</p>
          )}
          {aiText && (
            <div className={`rounded-md p-4 text-sm border ${aiConfirmada === true ? 'bg-[#E8F5E9] border-[#A5D6A7] text-[#1B5E20]' : aiConfirmada === false ? 'bg-red-50 border-red-200 text-red-800' : 'bg-[#FFFDE7] border-[#F9A825] text-[#212121]'}`}>
              <p className="font-medium mb-1">
                {aiConfirmada === true ? '✓ Confirmada' : aiConfirmada === false ? '✗ Descartada' : 'Pendiente de revisión'}
              </p>
              <p>{aiText}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="gap-2 border-[#A5D6A7] text-[#2E7D32] hover:bg-[#E8F5E9]" onClick={handleConsultarIA} disabled={aiLoading}>
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading ? 'Consultando...' : 'Consultar IA'}
            </Button>
            {/* Only DOCENTE and ADMINISTRATIVO can confirm/discard */}
            {(role === 'DOCENTE' || role === 'ADMINISTRATIVO') && aiText && aiConfirmada === null && (
              <>
                <Button type="button" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white gap-2" onClick={handleConfirmarIA}>
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Sugerencia
                </Button>
                <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2" onClick={handleDescartarIA}>
                  <XCircle className="w-4 h-4" /> Descartar Sugerencia
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── HISTORIAL ── */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#212121] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2E7D32]" /> Historial de la Solicitud
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="relative space-y-0">
            {[...sol.historial].reverse().map((entry, i) => (
              <div key={i} className="flex gap-3 pb-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] mt-1 shrink-0" />
                  {i < sol.historial.length - 1 && <div className="w-0.5 flex-1 bg-[#A5D6A7] mt-1" />}
                </div>
                <div className="flex-1 pb-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <p className="text-sm font-medium text-[#212121]">{entry.accion}</p>
                    <p className="text-xs text-muted-foreground">{entry.fecha}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.usuario}</p>
                  {entry.observacion && (
                    <p className="text-xs text-[#424242] mt-1 bg-[#F5F5F5] rounded px-2 py-1">{entry.observacion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cancelar solicitud {sol.id}?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. La solicitud pasará al estado CANCELADA.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white"
              onClick={role === 'ESTUDIANTE' ? handleEstudianteCancel : handleAdminCancel}>
              Sí, cancelar solicitud
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
