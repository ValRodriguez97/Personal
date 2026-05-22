import { useState, useEffect } from 'react';

export type Estado = 'REGISTRADA' | 'CLASIFICADA' | 'EN_ATENCION' | 'ATENDIDA' | 'CERRADA' | 'CANCELADA';
export type Prioridad = 'CRÍTICA' | 'ALTA' | 'MEDIA' | 'BAJA';
export type TipoSolicitud = 'ACADEMICA' | 'ADMINISTRATIVA' | 'FINANCIERA' | 'TECNICA';

export interface HistorialEntry {
  fecha: string;
  accion: string;
  usuario: string;
  observacion?: string;
}

export interface Solicitud {
  id: string;
  tipo: TipoSolicitud;
  descripcion: string;
  estado: Estado;
  prioridad: Prioridad | null;
  fechaRegistro: string;
  fechaLimite: string | null;
  solicitanteId: string;
  solicitanteNombre: string;
  responsableId: string | null;
  responsableNombre: string | null;
  historial: HistorialEntry[];
  sugerenciaIA: string | null;
  sugerenciaIAConfirmada: boolean | null;
}

const now = new Date();
const dAgo = (days: number) => {
  const dt = new Date(now); dt.setDate(dt.getDate() - days);
  return dt.toISOString().split('T')[0];
};
const dAhead = (days: number) => {
  const dt = new Date(now); dt.setDate(dt.getDate() + days);
  return dt.toISOString().split('T')[0];
};

const initialData: Solicitud[] = [
  {
    id: 'SOL-001', tipo: 'ACADEMICA',
    descripcion: 'Revisión de calificación parcial de Cálculo II — examen calificado incorrectamente.',
    estado: 'REGISTRADA', prioridad: null,
    fechaRegistro: dAgo(3), fechaLimite: dAhead(10),
    solicitanteId: 'u001', solicitanteNombre: 'Ana García',
    responsableId: null, responsableNombre: null,
    historial: [{ fecha: dAgo(3), accion: 'Solicitud registrada', usuario: 'Ana García' }],
    sugerenciaIA: null, sugerenciaIAConfirmada: null,
  },
  {
    id: 'SOL-002', tipo: 'FINANCIERA',
    descripcion: 'Beca de excelencia académica para el semestre 2026-II.',
    estado: 'CLASIFICADA', prioridad: 'ALTA',
    fechaRegistro: dAgo(7), fechaLimite: dAhead(5),
    solicitanteId: 'u001', solicitanteNombre: 'Ana García',
    responsableId: 'u002', responsableNombre: 'Prof. Carlos Méndez',
    historial: [
      { fecha: dAgo(7), accion: 'Solicitud registrada', usuario: 'Ana García' },
      { fecha: dAgo(5), accion: 'Solicitud clasificada', usuario: 'Laura Torres', observacion: 'Prioridad ALTA asignada' },
      { fecha: dAgo(4), accion: 'Responsable asignado', usuario: 'Laura Torres', observacion: 'Asignado a Prof. Carlos Méndez' },
    ],
    sugerenciaIA: null, sugerenciaIAConfirmada: null,
  },
  {
    id: 'SOL-003', tipo: 'ADMINISTRATIVA',
    descripcion: 'Constancia de estudios para trámites migratorios urgentes.',
    estado: 'EN_ATENCION', prioridad: 'CRÍTICA',
    fechaRegistro: dAgo(10), fechaLimite: dAhead(2),
    solicitanteId: 'u001', solicitanteNombre: 'Ana García',
    responsableId: 'u002', responsableNombre: 'Prof. Carlos Méndez',
    historial: [
      { fecha: dAgo(10), accion: 'Solicitud registrada', usuario: 'Ana García' },
      { fecha: dAgo(8), accion: 'Solicitud clasificada', usuario: 'Laura Torres' },
      { fecha: dAgo(7), accion: 'Responsable asignado', usuario: 'Laura Torres' },
      { fecha: dAgo(3), accion: 'Atención iniciada', usuario: 'Prof. Carlos Méndez', observacion: 'Verificando documentación' },
    ],
    sugerenciaIA: 'Procesar con prioridad máxima dado el carácter migratorio. Documentar cada paso.',
    sugerenciaIAConfirmada: true,
  },
  {
    id: 'SOL-004', tipo: 'TECNICA',
    descripcion: 'Falla en acceso al sistema de biblioteca digital — catálogo no carga.',
    estado: 'ATENDIDA', prioridad: 'MEDIA',
    fechaRegistro: dAgo(14), fechaLimite: dAhead(1),
    solicitanteId: 'u004', solicitanteNombre: 'Pedro Ramírez',
    responsableId: 'u002', responsableNombre: 'Prof. Carlos Méndez',
    historial: [
      { fecha: dAgo(14), accion: 'Solicitud registrada', usuario: 'Pedro Ramírez' },
      { fecha: dAgo(12), accion: 'Solicitud clasificada', usuario: 'Laura Torres' },
      { fecha: dAgo(11), accion: 'Responsable asignado', usuario: 'Laura Torres' },
      { fecha: dAgo(9), accion: 'Atención iniciada', usuario: 'Prof. Carlos Méndez' },
      { fecha: dAgo(5), accion: 'Solicitud atendida', usuario: 'Prof. Carlos Méndez', observacion: 'Certificado SSL renovado.' },
    ],
    sugerenciaIA: 'Programar alertas automáticas de vencimiento de certificados SSL.',
    sugerenciaIAConfirmada: false,
  },
  {
    id: 'SOL-005', tipo: 'ACADEMICA',
    descripcion: 'Cambio de sección en Física I por incompatibilidad de horario con práctica profesional.',
    estado: 'CERRADA', prioridad: 'BAJA',
    fechaRegistro: dAgo(20), fechaLimite: dAgo(5),
    solicitanteId: 'u005', solicitanteNombre: 'María Soto',
    responsableId: 'u002', responsableNombre: 'Prof. Carlos Méndez',
    historial: [
      { fecha: dAgo(20), accion: 'Solicitud registrada', usuario: 'María Soto' },
      { fecha: dAgo(18), accion: 'Solicitud clasificada', usuario: 'Laura Torres' },
      { fecha: dAgo(15), accion: 'Atención iniciada', usuario: 'Prof. Carlos Méndez' },
      { fecha: dAgo(12), accion: 'Solicitud atendida', usuario: 'Prof. Carlos Méndez' },
      { fecha: dAgo(8), accion: 'Solicitud cerrada', usuario: 'Prof. Carlos Méndez', observacion: 'Cambio de sección ejecutado.' },
    ],
    sugerenciaIA: null, sugerenciaIAConfirmada: null,
  },
  {
    id: 'SOL-006', tipo: 'FINANCIERA',
    descripcion: 'Devolución de pago duplicado de arancel de matrícula 2026-I.',
    estado: 'CLASIFICADA', prioridad: 'ALTA',
    fechaRegistro: dAgo(4), fechaLimite: dAhead(8),
    solicitanteId: 'u006', solicitanteNombre: 'Luis Herrera',
    responsableId: null, responsableNombre: null,
    historial: [
      { fecha: dAgo(4), accion: 'Solicitud registrada', usuario: 'Luis Herrera' },
      { fecha: dAgo(2), accion: 'Solicitud clasificada', usuario: 'Laura Torres', observacion: 'Pendiente de responsable' },
    ],
    sugerenciaIA: null, sugerenciaIAConfirmada: null,
  },
];

// Module-level reactive store
const store: Solicitud[] = [...initialData];
const listeners = new Set<() => void>();

function notify() { listeners.forEach((fn) => fn()); }

export function getSolicitudes(): Solicitud[] { return store; }
export function getSolicitudById(id: string): Solicitud | undefined {
  return store.find((s) => s.id === id);
}
export function addSolicitud(sol: Solicitud) { store.push(sol); notify(); }
export function updateSolicitud(id: string, patch: Partial<Solicitud>) {
  const idx = store.findIndex((s) => s.id === id);
  if (idx === -1) return;
  store[idx] = { ...store[idx], ...patch };
  notify();
}

export function useMockStore() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((t) => t + 1);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);
  return { tick, solicitudes: getSolicitudes(), getSolicitudById, addSolicitud, updateSolicitud };
}

export const MOCK_RESPONSABLES = [
  { id: 'u002', nombre: 'Prof. Carlos Méndez' },
  { id: 'u007', nombre: 'Prof. Diana Vargas' },
  { id: 'u008', nombre: 'Lic. Roberto Castillo' },
  { id: 'u009', nombre: 'Ing. Sofía Reyes' },
];

export const MOCK_ALL_USERS = [
  { userId: 'u001', nombre: 'Ana García', email: 'estudiante@uni.edu', rol: 'ESTUDIANTE', activo: true },
  { userId: 'u002', nombre: 'Prof. Carlos Méndez', email: 'docente@uni.edu', rol: 'DOCENTE', activo: true },
  { userId: 'u003', nombre: 'Laura Torres', email: 'admin@uni.edu', rol: 'ADMINISTRATIVO', activo: true },
  { userId: 'u004', nombre: 'Pedro Ramírez', email: 'p.ramirez@uni.edu', rol: 'ESTUDIANTE', activo: true },
  { userId: 'u005', nombre: 'María Soto', email: 'm.soto@uni.edu', rol: 'ESTUDIANTE', activo: false },
  { userId: 'u006', nombre: 'Luis Herrera', email: 'l.herrera@uni.edu', rol: 'ESTUDIANTE', activo: true },
  { userId: 'u007', nombre: 'Prof. Diana Vargas', email: 'd.vargas@uni.edu', rol: 'DOCENTE', activo: true },
  { userId: 'u008', nombre: 'Lic. Roberto Castillo', email: 'r.castillo@uni.edu', rol: 'DOCENTE', activo: true },
  { userId: 'u009', nombre: 'Ing. Sofía Reyes', email: 's.reyes@uni.edu', rol: 'ADMINISTRATIVO', activo: true },
];
