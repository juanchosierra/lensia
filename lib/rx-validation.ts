// lib/rx-validation.ts — clinical Rx validation + cylinder transposition

import type { Rx, RxEye } from "./data";

export type ValidationLevel = "error" | "warn" | "info";

export type ValidationIssue = {
  id: string;
  level: ValidationLevel;
  field?: "esf" | "cil" | "eje" | "add" | "dp" | "alt" | "tipo" | "mat";
  eye?: "od" | "oi" | "both";
  message: string;
  detail?: string;
};

const num = (s: string): number | null => {
  if (s == null || s === "") return null;
  const v = parseFloat(s);
  return isNaN(v) ? null : v;
};

const eyeName = (k: "od" | "oi" | "both"): string =>
  k === "od" ? "Ojo derecho (OD)" : k === "oi" ? "Ojo izquierdo (OI)" : "Ambos ojos";

function validateEye(
  eye: "od" | "oi",
  e: RxEye,
  tipo: string,
  mat: string,
): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const esf = num(e.esf);
  const cil = num(e.cil);
  const eje = num(e.eje);
  const add = num(e.add);
  const dp = num(e.dp);

  // ERRORS — block submission
  if (cil != null && cil !== 0 && eje == null) {
    out.push({
      id: `${eye}-cil-no-eje`,
      level: "error",
      field: "eje",
      eye,
      message: `${eyeName(eye)}: cilindro sin eje`,
      detail: "Cuando hay cilindro, el eje (0°–180°) es obligatorio para fabricar el lente.",
    });
  }
  if (eje != null && (eje < 0 || eje > 180)) {
    out.push({
      id: `${eye}-eje-range`,
      level: "error",
      field: "eje",
      eye,
      message: `${eyeName(eye)}: eje fuera de rango`,
      detail: "El eje debe estar entre 0° y 180°.",
    });
  }
  if ((tipo === "Progresivo" || tipo === "Bifocal" || tipo === "Ocupacional") && add == null) {
    out.push({
      id: `${eye}-no-add`,
      level: "error",
      field: "add",
      eye,
      message: `${eyeName(eye)}: ${tipo} requiere ADD`,
      detail: "Lentes bifocales, progresivos y ocupacionales necesitan poder de adición (ADD).",
    });
  }

  // WARNINGS — confirm to send
  if (esf != null && Math.abs(esf) > 8) {
    out.push({
      id: `${eye}-esf-high`,
      level: "warn",
      field: "esf",
      eye,
      message: `${eyeName(eye)}: esfera muy alta (${e.esf} D)`,
      detail: `Confirma que la fórmula es correcta. Para |ESF| > 6 D conviene índice 1.67 o 1.74.`,
    });
  }
  if (cil != null && cil < -4) {
    out.push({
      id: `${eye}-cil-high`,
      level: "warn",
      field: "cil",
      eye,
      message: `${eyeName(eye)}: cilindro alto (${e.cil} D)`,
      detail: "Verifica eje y signo. Cilindros mayores a 4 D no son comunes.",
    });
  }
  if (dp != null && (dp < 26 || dp > 38)) {
    out.push({
      id: `${eye}-dp-odd`,
      level: "warn",
      field: "dp",
      eye,
      message: `${eyeName(eye)}: DP fuera de lo común (${e.dp} mm)`,
      detail: "DP monocular típica: 28–35 mm. Verifica que es por ojo, no binocular.",
    });
  }
  if (add != null && add > 2.5) {
    out.push({
      id: `${eye}-add-high`,
      level: "warn",
      field: "add",
      eye,
      message: `${eyeName(eye)}: adición alta (+${add.toFixed(2)} D)`,
      detail: "ADD > +2.50 D es inusual. Confirma con el paciente.",
    });
  }

  // INFO — suggestions
  if (esf != null && Math.abs(esf) > 6 && (mat === "1.50" || mat === "1.56" || mat === "1.59")) {
    out.push({
      id: `${eye}-suggest-index`,
      level: "info",
      field: "mat",
      eye,
      message: `Para |ESF| ${Math.abs(esf).toFixed(2)} D conviene índice 1.67 o 1.74`,
      detail: "El lente saldría notoriamente grueso. Cambia el material en la sección 4.",
    });
  }

  return out;
}

export function validateRx(form: {
  tipo: string;
  mat: string;
  rx: Rx;
  paciente: string;
}): ValidationIssue[] {
  const out: ValidationIssue[] = [];

  if (!form.paciente || form.paciente.trim().length < 2) {
    out.push({
      id: "paciente-required",
      level: "error",
      message: "Falta el nombre del paciente",
      detail: "Sin paciente no podemos identificar el trabajo.",
    });
  }

  out.push(...validateEye("od", form.rx.od, form.tipo, form.mat));
  out.push(...validateEye("oi", form.rx.oi, form.tipo, form.mat));

  return out;
}

export function countByLevel(issues: ValidationIssue[]): Record<ValidationLevel, number> {
  return issues.reduce(
    (acc, i) => {
      acc[i.level] += 1;
      return acc;
    },
    { error: 0, warn: 0, info: 0 } as Record<ValidationLevel, number>,
  );
}

// ---------------- Cylinder transposition (+/-) -----------------
// Transpone una fórmula entre forma negativa y positiva del cilindro:
//   nueva_esf = esf + cil
//   nuevo_cil = -cil
//   nuevo_eje = eje ± 90 (mod 180)
export function transposeEye(e: RxEye): RxEye {
  const esf = num(e.esf);
  const cil = num(e.cil);
  const eje = num(e.eje);
  if (esf == null || cil == null) return e;
  const newEsf = esf + cil;
  const newCil = -cil;
  let newEje: string = e.eje;
  if (eje != null) {
    const t = (eje + 90) % 180;
    newEje = String(t);
  }
  const fmt = (v: number): string => {
    const s = v.toFixed(2);
    return v > 0 ? "+" + s : s;
  };
  return {
    ...e,
    esf: fmt(newEsf),
    cil: fmt(newCil),
    eje: newEje,
  };
}

export function transposeRx(rx: Rx): Rx {
  return { od: transposeEye(rx.od), oi: transposeEye(rx.oi) };
}

// Detecta si la fórmula está en cilindro positivo (poco común en LATAM)
// y sugiere transposición.
export function suggestsTransposition(rx: Rx): boolean {
  const od = num(rx.od.cil);
  const oi = num(rx.oi.cil);
  // sugerir si AMBOS cilindros son positivos (los labs trabajan en negativo)
  return (od != null && od > 0) && (oi != null && oi > 0);
}
