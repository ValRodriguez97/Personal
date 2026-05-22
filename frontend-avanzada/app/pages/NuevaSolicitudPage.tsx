import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/app/context/RoleContext';
import { addSolicitud, TipoSolicitud, Solicitud } from '@/app/data/mockStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Send, ArrowLeft } from 'lucide-react';

const TIPO_OPTIONS: { value: TipoSolicitud; label: string }[] = [
  { value: 'ACADEMICA', label: 'Académica' },
  { value: 'ADMINISTRATIVA', label: 'Administrativa' },
  { value: 'FINANCIERA', label: 'Financiera' },
  { value: 'TECNICA', label: 'Técnica' },
];

export function NuevaSolicitudPage() {
  const { currentUser } = useRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tipo, setTipo] = useState<TipoSolicitud | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ tipo?: string; descripcion?: string }>({});

  const validate = () => {
    const e: { tipo?: string; descripcion?: string } = {};
    if (!tipo) e.tipo = 'Seleccione un tipo de solicitud.';
    if (!descripcion.trim() || descripcion.trim().length < 10)
      e.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !currentUser) return;
    setLoading(true);
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const newSol: Solicitud = {
        id: `SOL-${String(Date.now()).slice(-4)}`,
        tipo: tipo as TipoSolicitud,
        descripcion: descripcion.trim(),
        estado: 'REGISTRADA',
        prioridad: null,
        fechaRegistro: today,
        fechaLimite: fechaLimite || null,
        solicitanteId: currentUser.userId,
        solicitanteNombre: currentUser.nombre,
        responsableId: null,
        responsableNombre: null,
        historial: [{ fecha: today, accion: 'Solicitud registrada', usuario: currentUser.nombre }],
        sugerenciaIA: null,
        sugerenciaIAConfirmada: null,
      };
      addSolicitud(newSol);
      setLoading(false);
      toast({ title: '¡Solicitud registrada!', description: `La solicitud ${newSol.id} fue creada exitosamente.` });
      navigate('/solicitudes');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/solicitudes')} className="gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div>
            <CardTitle className="text-xl text-[#212121]">Nueva Solicitud</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Complete el formulario para registrar su solicitud</p>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo */}
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de solicitud <span className="text-red-500">*</span></Label>
              <Select value={tipo} onValueChange={(v) => { setTipo(v as TipoSolicitud); setErrors((p) => ({ ...p, tipo: undefined })); }}>
                <SelectTrigger id="tipo" className={errors.tipo ? 'border-red-400' : ''}>
                  <SelectValue placeholder="Seleccione un tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipo && <p className="text-xs text-red-500">{errors.tipo}</p>}
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción <span className="text-red-500">*</span></Label>
              <Textarea
                id="descripcion"
                placeholder="Describa detalladamente su solicitud..."
                value={descripcion}
                onChange={(e) => { setDescripcion(e.target.value); setErrors((p) => ({ ...p, descripcion: undefined })); }}
                rows={5}
                className={errors.descripcion ? 'border-red-400' : ''}
              />
              <div className="flex justify-between">
                {errors.descripcion
                  ? <p className="text-xs text-red-500">{errors.descripcion}</p>
                  : <span />}
                <p className="text-xs text-muted-foreground">{descripcion.length} caracteres</p>
              </div>
            </div>

            {/* Fecha Límite */}
            <div className="grid gap-2">
              <Label htmlFor="fechaLimite">Fecha límite sugerida <span className="text-muted-foreground text-xs font-normal">(opcional)</span></Label>
              <input
                id="fechaLimite"
                type="date"
                value={fechaLimite}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFechaLimite(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Solicitante (read-only info) */}
            <div className="rounded-md bg-[#E8F5E9] border border-[#A5D6A7] px-4 py-3 text-sm text-[#1B5E20]">
              <p className="font-medium">Solicitante</p>
              <p className="text-xs mt-0.5">{currentUser?.nombre} — {currentUser?.email}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/solicitudes')} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white gap-2" disabled={loading}>
                {loading ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Solicitud</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
