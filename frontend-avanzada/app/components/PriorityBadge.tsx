import { Prioridad } from '@/app/data/mockStore';

const CONFIG: Record<Prioridad, { bg: string; text: string }> = {
  'CRÍTICA': { bg: '#C62828', text: '#fff' },
  'ALTA':    { bg: '#EF6C00', text: '#fff' },
  'MEDIA':   { bg: '#F9A825', text: '#212121' },
  'BAJA':    { bg: '#A5D6A7', text: '#212121' },
};

export function PriorityBadge({ prioridad }: { prioridad: Prioridad | null }) {
  if (!prioridad) return <span className="text-xs text-muted-foreground">—</span>;
  const cfg = CONFIG[prioridad];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {prioridad}
    </span>
  );
}
