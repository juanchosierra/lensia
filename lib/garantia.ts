// lib/garantia.ts — warranty / rework requests (Módulo C)

export type MotivoGarantia =
  | "error-formula"
  | "defecto-lente"
  | "rayado-dano"
  | "montaje"
  | "otro";

export const MOTIVOS: Array<{ key: MotivoGarantia; label: string; desc: string }> = [
  { key: "error-formula", label: "Error de fórmula",   desc: "El paciente ve mal con la fórmula entregada." },
  { key: "defecto-lente", label: "Defecto del lente",  desc: "Burbujas, vetas o problemas de fabricación." },
  { key: "rayado-dano",   label: "Rayado / daño",      desc: "Llegó rayado o se rayó en uso normal pronto." },
  { key: "montaje",       label: "Montaje",            desc: "Problema con biselado, centrado o montura." },
  { key: "otro",          label: "Otro",               desc: "Describe el problema en detalle." },
];

export type GarantiaEstado =
  | "solicitada"
  | "revision"
  | "aprobada"
  | "rechazada"
  | "en-reproceso"
  | "lista";

export const GARANTIA_STATES: Array<{
  key: GarantiaEstado;
  n: number;
  label: string;
  desc: string;
}> = [
  { key: "solicitada",   n: 1, label: "Solicitada",          desc: "El lab recibió tu reporte." },
  { key: "revision",     n: 2, label: "En revisión por el lab", desc: "Evaluando responsabilidad." },
  { key: "aprobada",     n: 3, label: "Aprobada",            desc: "Procede el reproceso." },
  { key: "en-reproceso", n: 4, label: "En reproceso",        desc: "Refabricando el lente." },
  { key: "lista",        n: 5, label: "Lista",               desc: "Disponible para entrega." },
];

export type Responsabilidad = "lab" | "optica" | "garantia";

export const RESPONSABILIDAD_META: Record<
  Responsabilidad,
  { label: string; sub: string; cobro: string; cls: string }
> = {
  lab:      { label: "Error del lab",      sub: "Sin costo para la óptica", cobro: "Sin costo", cls: "is-active" },
  optica:   { label: "Error de la óptica", sub: "Se cobra el reproceso",    cobro: "Con costo", cls: "is-wait" },
  garantia: { label: "Garantía",           sub: "Cubierto por garantía",    cobro: "Sin costo", cls: "is-done" },
};

export type GarantiaHist = {
  n: number;
  ts: string;
  info?: string;
};

export type Garantia = {
  id: string;
  orderId: string;
  paciente: string;
  optica: string;
  motivo: MotivoGarantia;
  descripcion: string;
  foto: boolean;
  fecha: string;
  estado: GarantiaEstado;
  estadoN: number;
  responsabilidad?: Responsabilidad;
  reprocessOrderId?: string;
  rechazoMotivo?: string;
  hist: GarantiaHist[];
};

export const MOCK_GARANTIAS: Garantia[] = [
  {
    id: "G-411", orderId: "10232", paciente: "Luz Marina Castaño",
    optica: "claridad", motivo: "rayado-dano",
    descripcion: "Lente derecho con rayón profundo en la zona central. Paciente lo recibió hace 5 días.",
    foto: true, fecha: "2 Jun",
    estado: "revision", estadoN: 2,
    hist: [
      { n: 1, ts: "2 Jun · 11:20" },
      { n: 2, ts: "2 Jun · 15:08", info: "Recibido en mesa de revisión. Te avisamos pronto." },
    ],
  },
  {
    id: "G-408", orderId: "10247", paciente: "María Fernanda Gómez",
    optica: "claridad", motivo: "error-formula",
    descripcion: "Paciente ve borroso a 2m. Reverifiqué con autorrefractor y la fórmula está bien.",
    foto: false, fecha: "31 May",
    estado: "rechazada", estadoN: 3,
    responsabilidad: "optica",
    rechazoMotivo: "Fórmula entregada coincide con la solicitada. Sugerimos repetir refracción al paciente; si confirma cambio de fórmula, generar nueva orden.",
    hist: [
      { n: 1, ts: "31 May · 9:00" },
      { n: 2, ts: "31 May · 12:40", info: "En revisión clínica." },
      { n: 3, ts: "1 Jun · 8:15", info: "Rechazada — fórmula entregada coincide con la solicitada." },
    ],
  },
  {
    id: "G-405", orderId: "10241", paciente: "Jorge Iván Mejía",
    optica: "claridad", motivo: "montaje",
    descripcion: "Centrado del progresivo desplazado. Paciente reporta mareo al bajar la vista.",
    foto: true, fecha: "28 May",
    estado: "en-reproceso", estadoN: 4,
    responsabilidad: "lab",
    reprocessOrderId: "10241-R",
    hist: [
      { n: 1, ts: "28 May · 14:22" },
      { n: 2, ts: "28 May · 16:00", info: "En revisión. Foto recibida." },
      { n: 3, ts: "29 May · 9:00", info: "Aprobada — sin costo. Error del lab en centrado." },
      { n: 4, ts: "29 May · 10:30", info: "Reproceso #10241-R generado. ETA 5 Jun." },
    ],
  },
];
