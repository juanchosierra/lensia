// lib/commercial-data.ts — pricing rules + credit/cartera (Módulos A + B)

import { LENS_TYPES, MATERIALS } from "./data";
import { LENS_BASE, MAT_ADD } from "./pricing";

export type Combo = { tipo: string; mat: string; matName?: string };

export function precioBase(combo: Combo): number {
  let p = LENS_BASE[combo.tipo] ?? 0;
  p += MAT_ADD[combo.mat] ?? 0;
  return p;
}

export const round500 = (n: number): number => Math.round(n / 500) * 500;

type OpticaRule = {
  pct: number;
  overrides: Record<string, number>;
  trat?: Record<string, number>;
};

export const OPTICA_PRICING: Record<string, OpticaRule> = {
  claridad:   { pct: 0.12, overrides: { "Progresivo|1.67": 360000, "Monofocal|1.74": 470000 }, trat: { "AR Premium": 42000, "Fotocromático": 68000 } },
  lacentral:  { pct: 0.10, overrides: { "Monofocal|1.74": 510000 }, trat: { "AR Premium": 46000 } },
  vision2020: { pct: 0.0,  overrides: {} },
  miradas:    { pct: 0.05, overrides: {} },
  opticentro: { pct: 0.0,  overrides: {} },
};

export type PriceResult = { base: number; price: number; special: boolean };

export function precioOptica(opticaId: string, combo: Combo): PriceResult {
  const base = precioBase(combo);
  const rule = OPTICA_PRICING[opticaId] ?? { pct: 0, overrides: {} };
  const key = combo.tipo + "|" + combo.mat;
  if (rule.overrides[key] != null) {
    return { base, price: rule.overrides[key], special: true };
  }
  return { base, price: round500(base * (1 - rule.pct)), special: false };
}

export function lensCombos(): Combo[] {
  const out: Combo[] = [];
  LENS_TYPES.forEach((lt) => {
    MATERIALS.forEach((m) => {
      out.push({ tipo: lt.key, mat: m.idx, matName: m.name });
    });
  });
  return out;
}

// ---------- credit / cartera ----------
export type Factura = {
  id: string;
  fecha: string;
  vence: string;
  monto: number;
  bucket: "corriente" | "b30" | "b60" | "b90";
  estado: "al-dia" | "vencida";
};

function mkFactura(
  id: string, fecha: string, vence: string, monto: number,
  bucket: Factura["bucket"],
): Factura {
  return { id, fecha, vence, monto, bucket, estado: bucket === "corriente" ? "al-dia" : "vencida" };
}

export type Pago = { fecha: string; monto: number; metodo: string };

export type Account = {
  cupo: number;
  plazo: number;
  facturas: Factura[];
  pagos: Pago[];
};

export const ACCOUNTS: Record<string, Account> = {
  claridad: {
    cupo: 4000000, plazo: 30,
    facturas: [
      mkFactura("F-2218", "2 Jun", "2 Jul", 412000, "corriente"),
      mkFactura("F-2201", "29 May", "28 Jun", 168000, "corriente"),
      mkFactura("F-2189", "20 May", "19 Jun", 548000, "corriente"),
      mkFactura("F-2160", "28 Abr", "28 May", 286000, "b30"),
      mkFactura("F-2147", "18 Abr", "18 May", 196000, "b30"),
    ],
    pagos: [
      { fecha: "1 Jun", monto: 600000, metodo: "Transferencia" },
      { fecha: "20 May", monto: 450000, metodo: "Transferencia" },
      { fecha: "8 May", monto: 380000, metodo: "Efectivo" },
    ],
  },
  vision2020: {
    cupo: 2500000, plazo: 30,
    facturas: [
      mkFactura("F-2210", "30 May", "29 Jun", 290000, "corriente"),
      mkFactura("F-2155", "15 Abr", "15 May", 145000, "b30"),
    ],
    pagos: [{ fecha: "28 May", monto: 300000, metodo: "Transferencia" }],
  },
  lacentral: {
    cupo: 6000000, plazo: 45,
    facturas: [
      mkFactura("F-2215", "1 Jun", "16 Jul", 520000, "corriente"),
      mkFactura("F-2198", "25 May", "9 Jul", 210000, "corriente"),
    ],
    pagos: [{ fecha: "30 May", monto: 800000, metodo: "Transferencia" }],
  },
  miradas: {
    cupo: 2000000, plazo: 30,
    facturas: [
      mkFactura("F-2209", "28 May", "27 Jun", 290000, "corriente"),
      mkFactura("F-2120", "10 Mar", "9 Abr", 480000, "b60"),
      mkFactura("F-2088", "5 Feb", "7 Mar", 520000, "b90"),
      mkFactura("F-2061", "10 Ene", "9 Feb", 410000, "b90"),
    ],
    pagos: [{ fecha: "2 May", monto: 200000, metodo: "Efectivo" }],
  },
  opticentro: {
    cupo: 3000000, plazo: 30,
    facturas: [
      mkFactura("F-2212", "31 May", "30 Jun", 205000, "corriente"),
      mkFactura("F-2175", "22 Abr", "22 May", 175000, "b30"),
    ],
    pagos: [{ fecha: "25 May", monto: 300000, metodo: "Transferencia" }],
  },
};

export type BucketDef = { key: Factura["bucket"]; label: string; color: string };

export const BUCKETS: BucketDef[] = [
  { key: "corriente", label: "Corriente", color: "var(--ok)" },
  { key: "b30",       label: "1–30",     color: "#c97a09" },
  { key: "b60",       label: "31–60",    color: "#d9772e" },
  { key: "b90",       label: "60+",      color: "var(--danger)" },
];

export type AccountStatus = "ok" | "warning" | "blocked";

export type AccountSummary = {
  saldo: number;
  vencido: number;
  aging: Record<string, number>;
  usage: number;
  status: AccountStatus;
  disponible: number;
};

export function acctSummary(a: Account): AccountSummary {
  const saldo = a.facturas.reduce((s, f) => s + f.monto, 0);
  const vencido = a.facturas
    .filter((f) => f.estado === "vencida")
    .reduce((s, f) => s + f.monto, 0);
  const aging: Record<string, number> = {};
  BUCKETS.forEach((b) => {
    aging[b.key] = a.facturas
      .filter((f) => f.bucket === b.key)
      .reduce((s, f) => s + f.monto, 0);
  });
  const has90 = aging.b90 > 0;
  const usage = saldo / a.cupo;
  let status: AccountStatus = "ok";
  if (saldo > a.cupo || has90) status = "blocked";
  else if (usage > 0.78 || vencido > 0) status = "warning";
  const disponible = Math.max(0, a.cupo - saldo);
  return { saldo, vencido, aging, usage, status, disponible };
}

export const STATUS_META: Record<AccountStatus, { label: string; cls: string }> = {
  ok:      { label: "Al día",     cls: "is-done" },
  warning: { label: "Por vencer", cls: "is-wait" },
  blocked: { label: "Bloqueada",  cls: "is-alert" },
};
