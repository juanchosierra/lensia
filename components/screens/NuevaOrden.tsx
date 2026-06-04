"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Field } from "../ui/Field";
import { SectionHead } from "../ui/SectionHead";
import { Stepper } from "../ui/Stepper";
import {
  COP, FRAME_MAT, FRAME_STATE, FRAME_TYPE, LENS_TYPES, MATERIALS, TREATMENTS,
  type Order, type RxEye,
} from "@/lib/data";
import { calcPrice } from "@/lib/pricing";
import type { AccountStatus } from "@/lib/commercial-data";

type Mode = "mobile" | "desktop";

export type NuevaOrdenForm = Omit<
  Order,
  "id" | "fecha" | "eta" | "estadoN" | "exception" | "hist" | "precio"
> & { foto?: boolean };

const EMPTY_EYE: RxEye = { esf: "", cil: "", eje: "", add: "", dp: "", alt: "" };

export function blankForm(): NuevaOrdenForm {
  return {
    paciente: "", solicitadoPor: "Sara R.", telefono: "", prioridad: "Normal",
    tipo: "Monofocal", mat: "1.59",
    trats: ["AR Verde", "Antirrayas"],
    rx: { od: { ...EMPTY_EYE }, oi: { ...EMPTY_EYE } },
    montura: { estado: "La óptica la envía", tipo: "Completa (full rim)", color: "", material: "Acetato", marca: "", calibre: "" },
    obs: "", foto: false,
  };
}

type RxCol = "esf" | "cil" | "eje" | "add" | "dp" | "alt";

const RX_CFG: Record<RxCol, { step: number; decimals: number; signed: boolean; min: number; max: number }> = {
  esf: { step: 0.25, decimals: 2, signed: true, min: -20, max: 20 },
  cil: { step: 0.25, decimals: 2, signed: true, min: -6, max: 0 },
  eje: { step: 5, decimals: 0, signed: false, min: 0, max: 180 },
  add: { step: 0.25, decimals: 2, signed: true, min: 0.75, max: 3.5 },
  dp: { step: 0.5, decimals: 1, signed: false, min: 20, max: 40 },
  alt: { step: 0.5, decimals: 1, signed: false, min: 10, max: 30 },
};

function RxField({
  col, val, set, disabled,
}: { col: RxCol; val: string; set: (v: string) => void; disabled?: boolean }) {
  return <Stepper value={val} onChange={set} disabled={disabled} {...RX_CFG[col]} />;
}

const RX_COLS = [
  { k: "esf" as const, l: "ESF", h: "Esfera" },
  { k: "cil" as const, l: "CIL", h: "Cilindro" },
  { k: "eje" as const, l: "EJE", h: "Eje °" },
  { k: "add" as const, l: "ADD", h: "Adición" },
  { k: "dp"  as const, l: "DP",  h: "mm" },
  { k: "alt" as const, l: "ALT", h: "mm" },
];

function RxEditor({
  form, setForm, mode,
}: {
  form: NuevaOrdenForm;
  setForm: React.Dispatch<React.SetStateAction<NuevaOrdenForm>>;
  mode: Mode;
}) {
  const isMono = form.tipo === "Monofocal";
  const setRx = (eye: "od" | "oi", col: RxCol, v: string) =>
    setForm((f) => ({
      ...f,
      rx: { ...f.rx, [eye]: { ...f.rx[eye], [col]: v } },
    }));

  const disabledCol = (k: RxCol, eye: "od" | "oi"): boolean =>
    (k === "add" && isMono) ||
    (k === "alt" && isMono) ||
    (k === "eje" && !form.rx[eye].cil);

  if (mode === "desktop") {
    const grid = "84px repeat(6, minmax(0,1fr))";
    return (
      <div className="ls-rx">
        <div className="ls-rx-head" style={{ gridTemplateColumns: grid }}>
          <div className="cell eye">Ojo</div>
          {RX_COLS.map((c) => <div key={c.k} className="cell">{c.l}</div>)}
        </div>
        {(["od", "oi"] as const).map((eye) => (
          <div key={eye} className="ls-rx-row" style={{ gridTemplateColumns: grid }}>
            <div className="ls-rx-eye">
              <span className={"ab" + (eye === "oi" ? " oi" : "")}>{eye.toUpperCase()}</span>
            </div>
            {RX_COLS.map((c) => (
              <div key={c.k} className="ls-rx-cell" style={{ padding: 5 }}>
                <RxField
                  col={c.k}
                  val={form.rx[eye][c.k]}
                  set={(v) => setRx(eye, c.k, v)}
                  disabled={disabledCol(c.k, eye)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  // mobile
  return (
    <div className="ls-col" style={{ gap: 12 }}>
      {(["od", "oi"] as const).map((eye) => {
        const name = eye === "od" ? "Ojo derecho" : "Ojo izquierdo";
        return (
          <div key={eye} className="ls-card" style={{ padding: 14 }}>
            <div className="ls-row" style={{ gap: 9, marginBottom: 12 }}>
              <span
                className={"ab " + eye}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  display: "grid", placeItems: "center",
                  background: eye === "oi" ? "var(--ink)" : "var(--brand)",
                  color: "#fff", fontWeight: 800, fontSize: 12,
                }}
              >
                {eye.toUpperCase()}
              </span>
              <span style={{ fontWeight: 700, color: "var(--ink)", fontSize: 14 }}>{name}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {RX_COLS.map((c) => (
                <div key={c.k} className="ls-field" style={{ gap: 5 }}>
                  <label className="ls-label" style={{ fontSize: 11 }}>
                    {c.l} <span className="opt" style={{ marginLeft: 2 }}>{c.h}</span>
                  </label>
                  <RxField
                    col={c.k}
                    val={form.rx[eye][c.k]}
                    set={(v) => setRx(eye, c.k, v)}
                    disabled={disabledCol(c.k, eye)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Thickness({ mat }: { mat: string }) {
  const m = MATERIALS.find((x) => x.idx === mat) || MATERIALS[0];
  return (
    <div
      className="ls-row"
      style={{ gap: 12, padding: "11px 13px", background: "var(--bg-sunken)", borderRadius: 12, marginTop: 4 }}
    >
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", whiteSpace: "nowrap" }}>
        Más grueso
      </span>
      <div className="ls-thick ls-grow">
        <div className="bar">
          <div className="mk" style={{ left: `calc(${(1 - m.t) * 100}% - 1.5px)` }} />
        </div>
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--brand)", whiteSpace: "nowrap" }}>
        Más delgado
      </span>
    </div>
  );
}

type Props = {
  mode: Mode;
  onCreate: (form: NuevaOrdenForm & { precio: number }) => void;
  seed?: Partial<NuevaOrdenForm> | null;
  acctStatus: AccountStatus;
  onGoCuenta?: () => void;
};

export function NuevaOrden({ mode, onCreate, seed, acctStatus, onGoCuenta }: Props) {
  const [form, setForm] = useState<NuevaOrdenForm>(() =>
    seed ? { ...blankForm(), ...seed } : blankForm(),
  );

  const set = (patch: Partial<NuevaOrdenForm>) =>
    setForm((f) => ({ ...f, ...patch }));
  const setM = (patch: Partial<NuevaOrdenForm["montura"]>) =>
    setForm((f) => ({ ...f, montura: { ...f.montura, ...patch } }));
  const toggleTrat = (t: string) =>
    setForm((f) => ({
      ...f,
      trats: f.trats.includes(t) ? f.trats.filter((x) => x !== t) : [...f.trats, t],
    }));

  const price = calcPrice(form);
  const blocked = acctStatus === "blocked";
  const valid =
    !blocked &&
    form.paciente.trim().length > 1 &&
    form.rx.od.esf !== "" &&
    form.rx.oi.esf !== "";
  const pad = mode === "desktop" ? 28 : 18;
  const wrap = mode === "desktop" ? { maxWidth: 760, margin: "0 auto" as const } : {};

  const submit = () => {
    if (!valid) return;
    onCreate({ ...form, precio: price });
  };

  return (
    <div className="ls-scroll" style={{ paddingBottom: 0 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 8px` }}>
        <div style={wrap}>
          <p className="ls-sub" style={{ marginBottom: 4 }}>
            Completa la fórmula. Los campos con <span style={{ color: "var(--brand)" }}>★</span> son obligatorios.
          </p>
        </div>
      </div>

      <div style={{ padding: `8px ${pad}px 130px` }}>
        <div style={{ ...wrap, display: "grid", gap: 26 }}>

          {blocked && (
            <div className="vbanner err">
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <Icon name="alert" size={17} />
              </span>
              <span>
                <b>Tu cuenta está en pausa por saldo pendiente.</b> No puedes crear pedidos nuevos por ahora.
                Ponte al día en tu estado de cuenta y se reactiva al instante.
                {onGoCuenta && (
                  <>
                    {" "}
                    <button
                      onClick={onGoCuenta}
                      style={{ color: "inherit", fontWeight: 800, textDecoration: "underline" }}
                      type="button"
                    >
                      Ver mi cuenta
                    </button>
                  </>
                )}
              </span>
            </div>
          )}
          {acctStatus === "warning" && (
            <div className="vbanner warn">
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <Icon name="clock" size={17} />
              </span>
              <span>Tienes saldo por vencer. Aún puedes pedir con normalidad.</span>
            </div>
          )}

          {/* 1 · Paciente */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="1" title="Paciente" sub="Para identificar el trabajo." />
            <div style={{ display: "grid", gridTemplateColumns: mode === "desktop" ? "2fr 1fr" : "1fr", gap: 14 }}>
              <Field label="Nombre del paciente ★">
                <input
                  className="ls-input"
                  value={form.paciente}
                  onChange={(e) => set({ paciente: e.target.value })}
                  placeholder="Nombre y apellido"
                />
              </Field>
              <Field label="Teléfono" opt="opcional">
                <input
                  className="ls-input"
                  value={form.telefono}
                  onChange={(e) => set({ telefono: e.target.value })}
                  placeholder="300 000 0000"
                />
              </Field>
              <Field label="Solicitado por">
                <input
                  className="ls-input"
                  value={form.solicitadoPor}
                  onChange={(e) => set({ solicitadoPor: e.target.value })}
                />
              </Field>
              <Field label="Prioridad">
                <div className="ls-segment">
                  {(["Normal", "Urgente"] as const).map((p) => (
                    <button
                      key={p}
                      className={form.prioridad === p ? "on" : ""}
                      onClick={() => set({ prioridad: p })}
                      type="button"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </section>

          {/* 2 · Tipo de lente */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="2" title="Tipo de lente ★" />
            <div className="ls-optgrid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {LENS_TYPES.map((lt) => (
                <button
                  key={lt.key}
                  className={"ls-opt" + (form.tipo === lt.key ? " on" : "")}
                  onClick={() => set({ tipo: lt.key })}
                  type="button"
                >
                  <span className="t">{lt.key}</span>
                  <span className="d">{lt.d}</span>
                  <span className="check">
                    <Icon name="check" size={16} sw={2.6} style={{ color: "var(--brand)" }} />
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 3 · Fórmula Rx */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="3" title="Fórmula (Rx) ★" sub="Pasos de 0.25 D. Captura por cada ojo." />
            <RxEditor form={form} setForm={setForm} mode={mode} />
            {form.tipo === "Monofocal" && (
              <span style={{ fontSize: 11.5, color: "var(--faint)", fontWeight: 500 }}>
                ADD y ALT aplican solo en bifocal, progresivo y ocupacional.
              </span>
            )}
          </section>

          {/* 4 · Material */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="4" title="Material / Índice ★" sub="A mayor índice, más delgado el lente." />
            <Field>
              <select
                className="ls-select"
                value={form.mat}
                onChange={(e) => set({ mat: e.target.value })}
              >
                {MATERIALS.map((m) => (
                  <option key={m.idx} value={m.idx}>
                    {m.idx} — {m.name} · {m.d}
                  </option>
                ))}
              </select>
            </Field>
            <Thickness mat={form.mat} />
          </section>

          {/* 5 · Tratamientos */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="5" title="Tratamientos / Filtros" sub="Multiselección. Suman al precio." />
            <div className="ls-chips">
              {TREATMENTS.map((t) => {
                const on = form.trats.includes(t.key);
                return (
                  <button
                    key={t.key}
                    className={"ls-chip" + (on ? " on" : "")}
                    onClick={() => toggleTrat(t.key)}
                    type="button"
                  >
                    {t.key}
                    {t.price > 0 && (
                      <span style={{ fontSize: 11, opacity: 0.75 }} className="ls-mono">
                        +{t.price / 1000}k
                      </span>
                    )}
                    <span className="x">{on ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 6 · Montura */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="6" title="Montura" />
            <Field label="Estado de la montura">
              <div
                className="ls-optgrid"
                style={{ gridTemplateColumns: mode === "desktop" ? "repeat(3,1fr)" : "1fr" }}
              >
                {FRAME_STATE.map((s) => (
                  <button
                    key={s}
                    className={"ls-opt" + (form.montura.estado === s ? " on" : "")}
                    onClick={() => setM({ estado: s })}
                    style={{ padding: "11px 13px" }}
                    type="button"
                  >
                    <span className="t" style={{ fontSize: 13 }}>{s}</span>
                  </button>
                ))}
              </div>
            </Field>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mode === "desktop" ? "1fr 1fr 1fr" : "1fr 1fr",
                gap: 14,
              }}
            >
              <Field label="Tipo">
                <select
                  className="ls-select"
                  value={form.montura.tipo}
                  onChange={(e) => setM({ tipo: e.target.value })}
                >
                  {FRAME_TYPE.map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="Material">
                <select
                  className="ls-select"
                  value={form.montura.material}
                  onChange={(e) => setM({ material: e.target.value })}
                >
                  {FRAME_MAT.map((x) => <option key={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="Color">
                <input
                  className="ls-input"
                  value={form.montura.color}
                  onChange={(e) => setM({ color: e.target.value })}
                  placeholder="Ej. Negro mate"
                />
              </Field>
              <Field label="Marca" opt="opcional">
                <input
                  className="ls-input"
                  value={form.montura.marca}
                  onChange={(e) => setM({ marca: e.target.value })}
                  placeholder="Ej. Ray-Ban"
                />
              </Field>
              <Field label="Calibre / medidas" hint="Puente □ diámetro - varilla">
                <input
                  className="ls-input ls-mono"
                  value={form.montura.calibre}
                  onChange={(e) => setM({ calibre: e.target.value })}
                  placeholder="52□18-140"
                />
              </Field>
            </div>
          </section>

          {/* 7 · Observaciones */}
          <section className="ls-col" style={{ gap: 14 }}>
            <SectionHead n="7" title="Observaciones y receta" />
            <Field label="Observaciones para el laboratorio" opt="opcional">
              <textarea
                className="ls-textarea"
                value={form.obs}
                onChange={(e) => set({ obs: e.target.value })}
                placeholder="Indicaciones especiales, antecedentes del paciente…"
              />
            </Field>
            <button
              onClick={() => set({ foto: !form.foto })}
              type="button"
              style={{
                border: "1.5px dashed " + (form.foto ? "var(--brand)" : "var(--line-2)"),
                borderRadius: 14, padding: "18px",
                display: "flex", alignItems: "center", gap: 13,
                background: form.foto ? "var(--brand-50)" : "var(--card)",
                textAlign: "left", transition: "all .15s",
              }}
            >
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: form.foto ? "var(--brand)" : "var(--bg-sunken)",
                  color: form.foto ? "#fff" : "var(--muted)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}
              >
                <Icon name={form.foto ? "check" : "camera"} size={22} />
              </div>
              <div className="ls-col" style={{ gap: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                  {form.foto ? "Foto de la receta adjunta" : "Adjuntar foto de la receta"}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                  Recomendado — evita errores de digitación.
                </span>
              </div>
            </button>
          </section>
        </div>
      </div>

      {/* sticky footer */}
      <div
        style={{
          position: "sticky", bottom: 0,
          padding: `12px ${pad}px`,
          background: "rgba(255,255,255,.94)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div style={wrap} className="ls-row">
          <div className="ls-col" style={{ gap: 1 }}>
            <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>
              TOTAL ESTIMADO
            </span>
            <span
              className="ls-mono"
              style={{ fontSize: 21, fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}
            >
              {COP(price)}
            </span>
          </div>
          <span className="ls-grow" />
          <button
            className="ls-btn ls-btn-primary"
            disabled={!valid}
            onClick={submit}
            style={{ paddingInline: 24 }}
            type="button"
          >
            <Icon name="check" size={18} sw={2.4} />Crear orden
          </button>
        </div>
      </div>
    </div>
  );
}
