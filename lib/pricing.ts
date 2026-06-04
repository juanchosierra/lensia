// lib/pricing.ts — base lens/material pricing + total calculator

import { TREATMENTS } from "./data";

export const LENS_BASE: Record<string, number> = {
  Monofocal: 60000,
  Bifocal: 95000,
  Progresivo: 150000,
  Ocupacional: 120000,
};

export const MAT_ADD: Record<string, number> = {
  "1.50": 0,
  "1.53": 25000,
  "1.56": 18000,
  "1.59": 40000,
  "1.61": 70000,
  "1.67": 120000,
  "1.74": 240000,
};

export type PriceableForm = {
  tipo: string;
  mat: string;
  trats: string[];
};

export function calcPrice(form: PriceableForm): number {
  let p = LENS_BASE[form.tipo] ?? 0;
  p += MAT_ADD[form.mat] ?? 0;
  form.trats.forEach((t) => {
    const x = TREATMENTS.find((y) => y.key === t);
    if (x) p += x.price;
  });
  return p;
}
