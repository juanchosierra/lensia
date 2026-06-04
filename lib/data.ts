// lib/data.ts — mock data + domain constants (ES / Colombia / COP)

export type RxEye = {
  esf: string;
  cil: string;
  eje: string;
  add: string;
  dp: string;
  alt: string;
};

export type Rx = { od: RxEye; oi: RxEye };

export type HistEntry = {
  n: number;
  ts: string;
  info?: string;
  ship?: boolean;
};

export type Montura = {
  estado: string;
  tipo: string;
  color: string;
  material: string;
  marca: string;
  calibre: string;
  diam?: string;
  vbox?: string;
};

export type OrderException = { type: string; label: string; detail: string };

export type Order = {
  id: string;
  optica?: string;
  paciente: string;
  solicitadoPor: string;
  telefono: string;
  fecha: string;
  eta: string;
  prioridad: "Normal" | "Urgente";
  tipo: string;
  mat: string;
  trats: string[];
  rx: Rx;
  montura: Montura;
  obs: string;
  foto?: boolean;
  precio: number;
  estadoN: number;
  exception?: OrderException | null;
  hist: HistEntry[];
};

export type StateDef = { n: number; key: string; label: string; desc: string };

export const STATES: StateDef[] = [
  { n: 1, key: "recibido",     label: "Recibido",            desc: "Tu orden llegó al laboratorio." },
  { n: 2, key: "validacion",   label: "En validación",       desc: "Verifican fórmula, viabilidad y montura." },
  { n: 3, key: "produccion",   label: "En producción",       desc: "Tallado de la superficie del lente (surfacing)." },
  { n: 4, key: "tratamientos", label: "Tratamientos",        desc: "Endurecido, antirreflejo y tinte." },
  { n: 5, key: "biselado",     label: "Biselado / Montaje",  desc: "Se corta y monta el lente en la montura." },
  { n: 6, key: "calidad",      label: "Control de calidad",  desc: "Se verifica fórmula, centrado y acabados." },
  { n: 7, key: "despachado",   label: "Despachado",          desc: "Va en camino hacia tu óptica." },
  { n: 8, key: "entregado",    label: "Entregado",           desc: "Recibido en la óptica." },
];

export const LENS_TYPES = [
  { key: "Monofocal",   d: "Visión sencilla — un solo poder" },
  { key: "Bifocal",     d: "Lejos + cerca con línea visible" },
  { key: "Progresivo",  d: "Lejos, intermedio y cerca sin línea" },
  { key: "Ocupacional", d: "Intermedio — computador y oficina" },
];

export type Material = { idx: string; name: string; t: number; d: string };

export const MATERIALS: Material[] = [
  { idx: "1.50", name: "CR-39 orgánico",    t: 0,    d: "Fórmulas bajas, económico" },
  { idx: "1.53", name: "Trivex",            t: 0.12, d: "Resistente, deportivo / niños" },
  { idx: "1.56", name: "Orgánico medio",    t: 0.22, d: "Económico delgado" },
  { idx: "1.59", name: "Policarbonato",     t: 0.34, d: "Resistente al impacto" },
  { idx: "1.61", name: "Alto índice",       t: 0.5,  d: "Fórmulas medias" },
  { idx: "1.67", name: "Alto índice",       t: 0.72, d: "Fórmulas medias-altas" },
  { idx: "1.74", name: "Ultra alto índice", t: 1,    d: "Lo más delgado, fórmulas altas" },
];

export type Treatment = { key: string; price: number };

export const TREATMENTS: Treatment[] = [
  { key: "AR Verde",        price: 28000 },
  { key: "AR Azul",         price: 28000 },
  { key: "AR Premium",      price: 52000 },
  { key: "Blue cut",        price: 35000 },
  { key: "Fotocromático",   price: 78000 },
  { key: "Polarizado",      price: 65000 },
  { key: "Tinte degradado", price: 22000 },
  { key: "Antirrayas",      price: 14000 },
  { key: "Protección UV",   price: 0 },
  { key: "Hidrofóbico",     price: 18000 },
];

export const FRAME_STATE = [
  "La óptica la envía",
  "Montura nueva (del lab)",
  "Solo lente (sin montar)",
];
export const FRAME_TYPE = ["Completa (full rim)", "Semi al aire", "Al aire (perforada)"];
export const FRAME_MAT  = ["Acetato", "Metal", "TR90", "Titanio"];

export const COP = (n: number): string =>
  "$" + (n || 0).toLocaleString("es-CO");

export function rxLine(
  esf: string, cil: string, eje: string, add: string, dp: string, alt: string,
): RxEye {
  return { esf, cil, eje, add, dp, alt };
}

export const ORDERS: Order[] = [
  {
    id: "10247", paciente: "María Fernanda Gómez", solicitadoPor: "Sara R.", telefono: "310 555 1234",
    fecha: "28 May", eta: "3 Jun", prioridad: "Urgente",
    tipo: "Progresivo", mat: "1.67",
    trats: ["AR Premium", "Blue cut", "Fotocromático", "Antirrayas"],
    rx: {
      od: rxLine("-2.25", "-0.75", "90", "+2.00", "31", "18"),
      oi: rxLine("-2.00", "-0.50", "85", "+2.00", "30.5", "18"),
    },
    montura: { estado: "La óptica la envía", tipo: "Completa (full rim)", color: "Carey", material: "Acetato", marca: "Vogue", calibre: "52□18-140" },
    obs: "Paciente notó mareo con progresivos anteriores. Ampliar el pasillo de progresión si es posible.",
    precio: 412000, estadoN: 4,
    hist: [
      { n: 1, ts: "28 May · 9:14" },
      { n: 2, ts: "28 May · 11:40", info: "Entrega estimada: 3 Jun. Montura recibida en buen estado." },
      { n: 3, ts: "29 May · 8:05" },
      { n: 4, ts: "30 May · 15:22", info: "Aplicados: endurecido + AR Premium + Blue cut." },
    ],
  },
  {
    id: "10251", paciente: "Andrés Felipe Ruiz", solicitadoPor: "Sara R.", telefono: "300 888 4521",
    fecha: "29 May", eta: "2 Jun", prioridad: "Normal",
    tipo: "Monofocal", mat: "1.59",
    trats: ["AR Verde", "Antirrayas", "Protección UV"],
    rx: {
      od: rxLine("-1.00", "", "", "", "32", ""),
      oi: rxLine("-1.25", "-0.25", "175", "", "31.5", ""),
    },
    montura: { estado: "Montura nueva (del lab)", tipo: "Semi al aire", color: "Negro mate", material: "TR90", marca: "—", calibre: "54□17-145" },
    obs: "",
    precio: 168000, estadoN: 7,
    hist: [
      { n: 1, ts: "29 May · 10:02" },
      { n: 2, ts: "29 May · 10:55", info: "Entrega estimada: 2 Jun." },
      { n: 3, ts: "29 May · 14:10" },
      { n: 4, ts: "30 May · 9:30" },
      { n: 5, ts: "30 May · 16:45" },
      { n: 6, ts: "31 May · 8:20", info: "Aprobado en control de calidad." },
      { n: 7, ts: "31 May · 12:05", info: "Servientrega · Guía 0254-11907 · ETA 2 Jun.", ship: true },
    ],
  },
  {
    id: "10232", paciente: "Luz Marina Castaño", solicitadoPor: "Diego M.", telefono: "315 220 7788",
    fecha: "26 May", eta: "30 May", prioridad: "Normal",
    tipo: "Bifocal", mat: "1.56",
    trats: ["AR Verde", "Antirrayas"],
    rx: {
      od: rxLine("+1.75", "-0.50", "10", "+2.25", "30", "16"),
      oi: rxLine("+2.00", "", "", "+2.25", "30", "16"),
    },
    montura: { estado: "La óptica la envía", tipo: "Completa (full rim)", color: "Dorado", material: "Metal", marca: "Ray-Ban", calibre: "50□19-140" },
    obs: "Flat-top 28.",
    precio: 196000, estadoN: 8,
    hist: [
      { n: 1, ts: "26 May · 8:40" }, { n: 2, ts: "26 May · 9:30", info: "Entrega estimada: 30 May." },
      { n: 3, ts: "26 May · 13:00" }, { n: 4, ts: "27 May · 10:15" }, { n: 5, ts: "27 May · 15:40" },
      { n: 6, ts: "28 May · 9:10" }, { n: 7, ts: "28 May · 11:30", info: "Coordinadora · Guía 7781-2204.", ship: true },
      { n: 8, ts: "30 May · 14:22", info: "Recibido por Diego M. en la óptica." },
    ],
  },
  {
    id: "10256", paciente: "Carlos Eduardo Peña", solicitadoPor: "Sara R.", telefono: "318 401 9963",
    fecha: "31 May", eta: "5 Jun", prioridad: "Normal",
    tipo: "Monofocal", mat: "1.74",
    trats: ["AR Premium", "Hidrofóbico", "Antirrayas"],
    rx: {
      od: rxLine("-7.50", "-1.25", "180", "", "29", ""),
      oi: rxLine("-7.75", "-1.00", "5", "", "29", ""),
    },
    montura: { estado: "La óptica la envía", tipo: "Al aire (perforada)", color: "Cristal", material: "Titanio", marca: "Silhouette", calibre: "53□18-140" },
    obs: "Fórmula alta — usar 1.74 para el menor espesor posible. Borde pulido brillante.",
    precio: 548000, estadoN: 2,
    hist: [
      { n: 1, ts: "31 May · 16:08" },
      { n: 2, ts: "1 Jun · 8:25", info: "Entrega estimada: 5 Jun. Verificando stock de 1.74." },
    ],
  },
  {
    id: "10254", paciente: "Valentina Ortiz", solicitadoPor: "Sara R.", telefono: "302 776 5510",
    fecha: "30 May", eta: "4 Jun", prioridad: "Normal",
    tipo: "Ocupacional", mat: "1.61",
    trats: ["AR Azul", "Blue cut", "Antirrayas"],
    rx: {
      od: rxLine("-3.00", "-0.50", "70", "+1.50", "31", "17"),
      oi: rxLine("-3.25", "-0.75", "110", "+1.50", "31", "17"),
    },
    montura: { estado: "Montura nueva (del lab)", tipo: "Completa (full rim)", color: "Azul translúcido", material: "Acetato", marca: "—", calibre: "51□18-142" },
    obs: "Trabaja 8h frente a pantalla.",
    precio: 274000, estadoN: 5,
    hist: [
      { n: 1, ts: "30 May · 11:20" }, { n: 2, ts: "30 May · 12:05", info: "Entrega estimada: 4 Jun." },
      { n: 3, ts: "30 May · 15:50" }, { n: 4, ts: "31 May · 10:40", info: "AR Azul + Blue cut aplicados." },
      { n: 5, ts: "1 Jun · 9:15" },
    ],
  },
  {
    id: "10241", paciente: "Jorge Iván Mejía", solicitadoPor: "Diego M.", telefono: "311 654 3300",
    fecha: "27 May", eta: "—", prioridad: "Normal",
    tipo: "Progresivo", mat: "1.67",
    trats: ["AR Premium", "Fotocromático"],
    rx: {
      od: rxLine("-4.25", "-1.50", "15", "+2.50", "30", "19"),
      oi: rxLine("-4.00", "-1.75", "165", "+2.50", "30", "19"),
    },
    montura: { estado: "La óptica la envía", tipo: "Completa (full rim)", color: "Habana", material: "Acetato", marca: "Persol", calibre: "52□18-145" },
    obs: "",
    precio: 468000, estadoN: 3,
    exception: { type: "backorder", label: "En espera de material", detail: "Pendiente lote de fotocromático 1.67. Proveedor confirma llegada 3 Jun; reanudamos producción ese día." },
    hist: [
      { n: 1, ts: "27 May · 9:00" }, { n: 2, ts: "27 May · 10:20", info: "Entrega estimada: 1 Jun." },
      { n: 3, ts: "27 May · 14:30" },
    ],
  },
];
