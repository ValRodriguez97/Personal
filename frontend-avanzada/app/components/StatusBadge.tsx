import { Estado } from '@/app/data/mockStore';

const CONFIG: Record<Estado, { bg: string; text: string; label: string }> = {
  REGISTRADA:  { bg: '#9E9E9E', text: '#fff', label: 'Registrada' },
  CLASIFICADA: { bg: '#1565C0', text: '#fff', label: 'Clasificada' },
  EN_ATENCION: { bg: '#EF6C00', text: '#fff', label: 'En Atención' },
  ATENDIDA:    { bg: '#2E7D32', text: '#fff', label: 'Atendida' },
  CERRADA:     { bg: '#424242', text: '#fff', label: 'Cerrada' },
  CANCELADA:   { bg: '#B71C1C', text: '#fff', label: 'Cancelada' },
};

export function StatusBadge({ estado }: { estado: Estado }) {
  const cfg = CONFIG[estado];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}
