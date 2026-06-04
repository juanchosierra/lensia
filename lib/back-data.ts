// lib/back-data.ts — lab side: ópticas (clientes) + órdenes entrantes + Kanban config

import { STATES, rxLine, type Order, type StateDef } from "./data";

export type Optica = {
  id: string;
  name: string;
  city: string;
  tier: "Preferente" | "Estándar";
};

export const OPTICAS: Optica[] = [
  { id: "claridad",   name: "Óptica Claridad",    city: "Medellín",     tier: "Preferente" },
  { id: "vision2020", name: "Visión 20/20",       city: "Bogotá",       tier: "Estándar" },
  { id: "lacentral",  name: "Óptica La Central",  city: "Cali",         tier: "Preferente" },
  { id: "miradas",    name: "Miradas",            city: "Barranquilla", tier: "Estándar" },
  { id: "opticentro", name: "Opticentro",         city: "Bucaramanga",  tier: "Estándar" },
];

export type KbColumn = StateDef & { accent: "brand" | "ok" };

export const COLUMNS: KbColumn[] = STATES.map((s) => ({
  ...s,
  accent: s.n >= 8 ? "ok" : "brand",
}));

let _seq = 10260;

function mk(o: Partial<Order>): Order {
  const id = String(o.id ?? _seq++);
  const base: Order = {
    id,
    optica: "claridad",
    paciente: "—",
    solicitadoPor: "—",
    telefono: "",
    fecha: "1 Jun",
    eta: "—",
    prioridad: "Normal",
    tipo: "Monofocal",
    mat: "1.59",
    trats: ["AR Verde", "Antirrayas"],
    rx: {
      od: rxLine("-1.50", "", "", "", "31", ""),
      oi: rxLine("-1.50", "", "", "", "31", ""),
    },
    montura: {
      estado: "La óptica la envía",
      tipo: "Completa (full rim)",
      color: "Negro",
      material: "Acetato",
      marca: "—",
      calibre: "52□18-140",
      diam: "70 mm",
      vbox: "34 mm",
    },
    obs: "",
    precio: 160000,
    estadoN: 1,
    exception: null,
    hist: [{ n: 1, ts: "1 Jun · 9:00" }],
  };
  return { ...base, ...o, id };
}

function withHist(o: Order): Order {
  if (o.hist && o.hist.length >= o.estadoN) return o;
  const hist: Order["hist"] = o.hist ? [...o.hist] : [];
  for (let n = 1; n <= o.estadoN; n++) {
    if (!hist.find((h) => h.n === n)) {
      hist.push({ n, ts: "1 Jun · " + (8 + n) + ":00" });
    }
  }
  hist.sort((a, b) => a.n - b.n);
  return { ...o, hist };
}

export const ORDERS_LAB: Order[] = [
  mk({
    optica: "vision2020", paciente: "Daniel Quintero", solicitadoPor: "Laura P.",
    tipo: "Monofocal", mat: "1.56", precio: 145000, estadoN: 1, prioridad: "Urgente",
    montura: { estado: "La óptica la envía", tipo: "Completa (full rim)", color: "Negro mate", material: "Acetato", marca: "Tommy Hilfiger", calibre: "53□17-140", diam: "70 mm", vbox: "34 mm" },
    obs: "Montura recibida en buen estado. Bisagra derecha algo floja — ajustar al montar.",
    rx: { od: rxLine("-2.50", "-0.50", "80", "", "30", ""), oi: rxLine("-2.25", "", "", "", "30", "") },
  }),
  mk({
    optica: "miradas", paciente: "Sofía Naranjo", solicitadoPor: "Camilo R.",
    tipo: "Progresivo", mat: "1.61", precio: 290000, estadoN: 1,
    trats: ["AR Premium", "Blue cut"],
    rx: { od: rxLine("-3.50", "-1.00", "95", "+1.75", "31", "18"), oi: rxLine("-3.25", "-0.75", "100", "+1.75", "31", "18") },
  }),
  mk({
    optica: "lacentral", paciente: "Hernán Gallego", solicitadoPor: "Ana M.",
    tipo: "Monofocal", mat: "1.74", precio: 520000, estadoN: 2, prioridad: "Urgente",
    obs: "Fórmula alta, usar 1.74. Borde pulido.",
    rx: { od: rxLine("-8.00", "-1.50", "10", "", "29", ""), oi: rxLine("-8.25", "-1.25", "170", "", "29", "") },
  }),
  mk({
    optica: "claridad", paciente: "Patricia Londoño", solicitadoPor: "Sara R.",
    tipo: "Bifocal", mat: "1.56", precio: 198000, estadoN: 2,
    montura: { estado: "Solo lente (sin montar)", tipo: "—", color: "—", material: "—", marca: "—", calibre: "—" },
    obs: "La óptica monta. Enviar solo los lentes terminados, sin biselar.",
    rx: { od: rxLine("+1.50", "", "", "+2.00", "30", "16"), oi: rxLine("+1.75", "-0.25", "20", "+2.00", "30", "16") },
  }),
  mk({
    optica: "opticentro", paciente: "Ricardo Vélez", solicitadoPor: "Mónica T.",
    tipo: "Progresivo", mat: "1.67", precio: 430000, estadoN: 3,
    trats: ["AR Premium", "Fotocromático"],
    rx: { od: rxLine("-4.75", "-2.00", "15", "+2.25", "30", "19"), oi: rxLine("-4.50", "-2.25", "165", "+2.25", "30", "19") },
  }),
  mk({
    optica: "vision2020", paciente: "Gloria Mesa", solicitadoPor: "Laura P.",
    tipo: "Progresivo", mat: "1.67", precio: 460000, estadoN: 3,
    trats: ["AR Premium", "Fotocromático"],
    exception: { type: "backorder", label: "En espera de material", detail: "Pendiente fotocromático 1.67. Llega 3 Jun." },
    rx: { od: rxLine("-5.00", "-1.00", "20", "+2.50", "30", "19"), oi: rxLine("-5.25", "-1.25", "160", "+2.50", "30", "19") },
  }),
  mk({
    optica: "claridad", paciente: "Esteban Ríos", solicitadoPor: "Diego M.",
    tipo: "Ocupacional", mat: "1.59", precio: 260000, estadoN: 4,
    trats: ["AR Azul", "Blue cut", "Antirrayas"],
    rx: { od: rxLine("-2.00", "-0.50", "70", "+1.25", "31", "17"), oi: rxLine("-2.25", "-0.50", "110", "+1.25", "31", "17") },
  }),
  mk({
    optica: "lacentral", paciente: "Marcela Pino", solicitadoPor: "Ana M.",
    tipo: "Monofocal", mat: "1.61", precio: 210000, estadoN: 4,
    trats: ["AR Premium", "Hidrofóbico"],
    rx: { od: rxLine("-3.75", "-0.75", "85", "", "30", ""), oi: rxLine("-3.50", "-1.00", "95", "", "30", "") },
  }),
  mk({
    optica: "miradas", paciente: "Julián Acosta", solicitadoPor: "Camilo R.",
    tipo: "Monofocal", mat: "1.59", precio: 175000, estadoN: 5, prioridad: "Urgente",
    montura: { estado: "La óptica la envía", tipo: "Al aire (perforada)", color: "Cristal", material: "Titanio", marca: "Silhouette", calibre: "53□18-140", diam: "65 mm", vbox: "32 mm" },
    rx: { od: rxLine("-1.75", "", "", "", "32", ""), oi: rxLine("-2.00", "-0.25", "175", "", "32", "") },
  }),
  mk({
    optica: "opticentro", paciente: "Beatriz Cano", solicitadoPor: "Mónica T.",
    tipo: "Bifocal", mat: "1.56", precio: 205000, estadoN: 6,
    rx: { od: rxLine("+2.00", "-0.50", "10", "+2.25", "30", "16"), oi: rxLine("+2.25", "", "", "+2.25", "30", "16") },
  }),
  mk({
    optica: "claridad", paciente: "Andrés Felipe Ruiz", solicitadoPor: "Sara R.",
    tipo: "Monofocal", mat: "1.59", precio: 168000, estadoN: 7,
    hist: [
      { n: 1, ts: "29 May · 10:02" },
      { n: 2, ts: "29 May · 10:55", info: "Entrega est.: 2 Jun." },
      { n: 3, ts: "29 May · 14:10" },
      { n: 4, ts: "30 May · 9:30" },
      { n: 5, ts: "30 May · 16:45" },
      { n: 6, ts: "31 May · 8:20" },
      { n: 7, ts: "31 May · 12:05", info: "Servientrega · Guía 0254-11907 · ETA 2 Jun.", ship: true },
    ],
    rx: { od: rxLine("-1.00", "", "", "", "32", ""), oi: rxLine("-1.25", "-0.25", "175", "", "31.5", "") },
  }),
  mk({
    optica: "lacentral", paciente: "Luz Marina Castaño", solicitadoPor: "Ana M.",
    tipo: "Bifocal", mat: "1.56", precio: 196000, estadoN: 8,
    rx: { od: rxLine("+1.75", "-0.50", "10", "+2.25", "30", "16"), oi: rxLine("+2.00", "", "", "+2.25", "30", "16") },
  }),
].map(withHist);

export const LAB = { name: "Lensia Lab", user: "Operaciones", initials: "OP" };

export function opticaById(id?: string): { id: string; name: string; city: string; tier: string } {
  return OPTICAS.find((o) => o.id === id) ?? { id: id ?? "", name: id ?? "", city: "", tier: "" };
}
