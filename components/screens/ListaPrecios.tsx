"use client";

import { useEffect, useState } from "react";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { COP, LENS_TYPES, MATERIALS, TREATMENTS } from "@/lib/data";
import { lensCombos, precioOptica, type Combo } from "@/lib/commercial-data";

type Mode = "mobile" | "desktop";

type RowProps = { combo: Combo; onPedir: (c: Combo) => void; mode: Mode };

function PrecioRow({ combo, onPedir, mode }: RowProps) {
  const { base, price, special } = precioOptica("claridad", combo);
  if (mode === "mobile") {
    return (
      <div className="price-card">
        <div className="ls-row" style={{ gap: 8, marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{combo.tipo}</span>
          <span className="ls-mono ls-pill" style={{ height: 22 }}>{combo.mat}</span>
          {special && (
            <span className="special">
              <Icon name="spark" size={11} />Especial
            </span>
          )}
        </div>
        <div className="ls-row" style={{ gap: 8 }}>
          <div className="ls-col" style={{ gap: 1 }}>
            {special && <span className="strike ls-mono">{COP(base)}</span>}
            <span className="ls-mono" style={{ fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
              {COP(price)}
            </span>
          </div>
          <span className="ls-grow" />
          <button className="ls-btn ls-btn-soft ls-btn-sm" onClick={() => onPedir(combo)} type="button">
            <Icon name="plus" size={15} />Pedir
          </button>
        </div>
      </div>
    );
  }
  return (
    <tr>
      <td style={{ fontWeight: 700, color: "var(--ink)" }}>{combo.tipo}</td>
      <td>
        <span className="ls-mono" style={{ fontWeight: 600 }}>{combo.mat}</span>{" "}
        <span style={{ color: "var(--muted)" }}>· {combo.matName}</span>
      </td>
      <td className="num">
        {special
          ? <span className="strike">{COP(base)}</span>
          : <span style={{ color: "var(--muted)", fontWeight: 500 }}>{COP(base)}</span>}
      </td>
      <td className="num">
        <div className="ls-row" style={{ gap: 8, justifyContent: "flex-end" }}>
          {special && <span className="special">Especial</span>}
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{COP(price)}</span>
        </div>
      </td>
      <td style={{ textAlign: "right", width: 1 }}>
        <button className="ls-btn ls-btn-soft ls-btn-sm" onClick={() => onPedir(combo)} type="button">
          <Icon name="plus" size={15} />Pedir
        </button>
      </td>
    </tr>
  );
}

type Props = {
  mode: Mode;
  onPedir: (combo: Combo) => void;
  brandName?: string;
};

export function ListaPrecios({ mode, onPedir, brandName }: Props) {
  const [q, setQ] = useState("");
  const [ft, setFt] = useState<string>("todos");
  const [fm, setFm] = useState<string>("todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const combos = lensCombos().filter((c) => {
    if (ft !== "todos" && c.tipo !== ft) return false;
    if (fm !== "todos" && c.mat !== fm) return false;
    if (q) {
      const s = (c.tipo + " " + c.mat + " " + (c.matName ?? "")).toLowerCase();
      if (!s.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const pad = mode === "desktop" ? 28 : 18;

  return (
    <div className="ls-scroll" style={{ paddingBottom: mode === "desktop" ? 36 : 96 }}>
      <div
        style={{
          padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px`,
          position: "sticky", top: 0,
          background: "linear-gradient(var(--bg) 80%, transparent)", zIndex: 10,
        }}
      >
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 4 }}>Lista de Precios</h1>
        )}
        <div className="vbanner info" style={{ marginBottom: 12 }}>
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <Icon name="tag" size={16} />
          </span>
          <span>
            Estos son <b>tus precios</b> con {brandName || "el laboratorio"} — ya incluyen tu descuento de óptica preferente.
          </span>
        </div>
        <div className="ls-search" style={{ marginBottom: 10 }}>
          <Icon name="search" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar lente, material…"
          />
        </div>
        <div className="ls-filters">
          <select
            className="ls-select"
            style={{ height: 34, width: "auto", fontSize: 12.5, fontWeight: 700, paddingRight: 32 }}
            value={ft}
            onChange={(e) => setFt(e.target.value)}
          >
            <option value="todos">Todo tipo de lente</option>
            {LENS_TYPES.map((l) => <option key={l.key} value={l.key}>{l.key}</option>)}
          </select>
          <select
            className="ls-select"
            style={{ height: 34, width: "auto", fontSize: 12.5, fontWeight: 700, paddingRight: 32 }}
            value={fm}
            onChange={(e) => setFm(e.target.value)}
          >
            <option value="todos">Todo material</option>
            {MATERIALS.map((m) => (
              <option key={m.idx} value={m.idx}>{m.idx} · {m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ padding: `4px ${pad}px 0` }}>
        {loading ? (
          <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="ls-row"
                style={{ gap: 12, padding: "16px", borderBottom: "1px solid var(--line)" }}
              >
                <div style={{ height: 14, width: "30%", borderRadius: 6, background: "var(--bg-sunken)" }} />
                <span className="ls-grow" />
                <div style={{ height: 14, width: 80, borderRadius: 6, background: "var(--bg-sunken)" }} />
              </div>
            ))}
          </div>
        ) : combos.length === 0 ? (
          <div
            className="ls-col"
            style={{ alignItems: "center", padding: "56px 0", color: "var(--faint)", gap: 10 }}
          >
            <Icon name="search" size={30} />
            <span style={{ fontWeight: 600 }}>Sin resultados con esos filtros</span>
          </div>
        ) : mode === "desktop" ? (
          <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="dtable">
              <thead>
                <tr>
                  <th>Tipo de lente</th>
                  <th>Material / Índice</th>
                  <th style={{ textAlign: "right" }}>Precio lista</th>
                  <th style={{ textAlign: "right" }}>Tu precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {combos.map((c) => (
                  <PrecioRow key={c.tipo + c.mat} combo={c} onPedir={onPedir} mode={mode} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ls-col" style={{ gap: 10 }}>
            {combos.map((c) => (
              <PrecioRow key={c.tipo + c.mat} combo={c} onPedir={onPedir} mode={mode} />
            ))}
          </div>
        )}

        {!loading && (
          <div style={{ marginTop: 26 }}>
            <SectionHead
              title="Tratamientos y filtros"
              sub="Se suman al precio del lente."
              icon="shield"
            />
            <div className="ls-card" style={{ padding: 0, overflow: "hidden", marginTop: 12 }}>
              <table className="dtable">
                <tbody>
                  {TREATMENTS.map((t) => (
                    <tr key={t.key}>
                      <td style={{ fontWeight: 600, color: "var(--ink)" }}>{t.key}</td>
                      <td className="num">
                        {t.price === 0
                          ? <span className="ls-badge is-done" style={{ height: 22 }}>Incluido</span>
                          : "+ " + COP(t.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
