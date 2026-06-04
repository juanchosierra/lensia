"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { COP, LENS_TYPES, MATERIALS, TREATMENTS } from "@/lib/data";
import {
  OPTICA_PRICING, lensCombos, precioBase, round500, type Combo,
} from "@/lib/commercial-data";
import { OPTICAS, opticaById } from "@/lib/back-data";

type Mode = "mobile" | "desktop";

const ckey = (c: Combo) => c.tipo + "|" + c.mat;
const num = (s: string): number => parseInt(String(s).replace(/\D/g, ""), 10) || 0;

type Props = {
  mode: Mode;
  onToast: (msg: string) => void;
};

export function CatalogoView({ mode, onToast }: Props) {
  const combos = lensCombos();

  const [target, setTarget] = useState<string>("general"); // "general" | opticaId
  const [gp, setGp] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    combos.forEach((c) => { o[ckey(c)] = precioBase(c); });
    return o;
  });
  const [ov, setOv] = useState<Record<string, Record<string, number>>>(() => {
    const o: Record<string, Record<string, number>> = {};
    Object.keys(OPTICA_PRICING).forEach((k) => {
      o[k] = { ...OPTICA_PRICING[k].overrides };
    });
    return o;
  });
  const [tp, setTp] = useState<Record<string, number>>(() => {
    const o: Record<string, number> = {};
    TREATMENTS.forEach((t) => { o[t.key] = t.price; });
    return o;
  });
  const [tov, setTov] = useState<Record<string, Record<string, number>>>(() => {
    const o: Record<string, Record<string, number>> = {};
    Object.keys(OPTICA_PRICING).forEach((k) => {
      o[k] = { ...(OPTICA_PRICING[k].trat ?? {}) };
    });
    return o;
  });
  const [activeMats, setActiveMats] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    MATERIALS.forEach((m) => { o[m.idx] = true; });
    return o;
  });
  const [ft, setFt] = useState<string>("todos");

  const isOptica = target !== "general";
  const tierPct = isOptica ? OPTICA_PRICING[target].pct : 0;
  const baseline = (key: string) => round500(gp[key] * (1 - tierPct));
  const opticaPrice = (key: string): number =>
    ov[target] && ov[target][key] != null ? ov[target][key] : baseline(key);
  const isOv = (key: string): boolean =>
    isOptica && ov[target] != null && ov[target][key] != null;

  const editGeneral = (key: string, v: number) =>
    setGp((p) => ({ ...p, [key]: v }));
  const editOverride = (key: string, v: number) =>
    setOv((p) => ({ ...p, [target]: { ...p[target], [key]: v } }));
  const revert = (key: string) =>
    setOv((p) => {
      const c = { ...p[target] };
      delete c[key];
      return { ...p, [target]: c };
    });
  const toggleMat = (idx: string) =>
    setActiveMats((p) => ({ ...p, [idx]: !p[idx] }));

  const tBaseline = (key: string) => round500(tp[key] * (1 - tierPct));
  const tOpticaPrice = (key: string): number =>
    tov[target] && tov[target][key] != null ? tov[target][key] : tBaseline(key);
  const tIsOv = (key: string): boolean =>
    isOptica && tov[target] != null && tov[target][key] != null;
  const editTov = (key: string, v: number) =>
    setTov((p) => ({ ...p, [target]: { ...p[target], [key]: v } }));
  const revertTov = (key: string) =>
    setTov((p) => {
      const c = { ...p[target] };
      delete c[key];
      return { ...p, [target]: c };
    });

  const rows = combos.filter((c) => ft === "todos" || c.tipo === ft);
  const pad = mode === "desktop" ? 28 : 16;
  const targetName = isOptica ? opticaById(target).name : "Lista general";

  return (
    <div className="ls-scroll" style={{ height: "100%", paddingBottom: 28 }}>
      <div
        style={{
          padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 0`,
          maxWidth: mode === "desktop" ? 1000 : "none",
          margin: mode === "desktop" ? "0 auto" : 0,
        }}
      >
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 12 }}>Catálogo y precios</h1>
        )}

        <div className="ls-card" style={{ padding: 14, marginBottom: 16 }}>
          <div className="ls-row" style={{ gap: 12, flexWrap: "wrap" }}>
            <div className="ls-col" style={{ gap: 3 }}>
              <span className="ls-eyebrow">Editando precios</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>
                {targetName}
              </span>
            </div>
            <span className="ls-grow" />
            <select
              className="ls-select"
              style={{ width: mode === "desktop" ? 240 : "100%", height: 42 }}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="general">Lista general (todas)</option>
              {OPTICAS.map((o) => {
                const pct = OPTICA_PRICING[o.id]?.pct;
                return (
                  <option key={o.id} value={o.id}>
                    {o.name} {pct ? `· −${pct * 100}%` : ""}
                  </option>
                );
              })}
            </select>
          </div>
          {isOptica && (
            <div className="vbanner info" style={{ marginTop: 12 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <Icon name="eye" size={15} />
              </span>
              <span>
                Así ve <b>{targetName}</b> sus precios. Parten de la lista general con su
                descuento (−{tierPct * 100}%); edita una celda para fijar un{" "}
                <b>precio especial</b> que sobrescribe ese cálculo.
              </span>
            </div>
          )}
        </div>

        <div className="ls-filters" style={{ marginBottom: 12 }}>
          {["todos", ...LENS_TYPES.map((l) => l.key)].map((k) => (
            <button
              key={k}
              className={"ls-filter" + (ft === k ? " on" : "")}
              onClick={() => setFt(k)}
              type="button"
            >
              {k === "todos" ? "Todos" : k}
            </button>
          ))}
        </div>

        <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="dtable">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Material / Índice</th>
                {isOptica && <th style={{ textAlign: "right" }}>General</th>}
                <th style={{ textAlign: "right" }}>
                  {isOptica ? "Precio óptica" : "Precio general"}
                </th>
                {isOptica && <th></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const key = ckey(c);
                const active = activeMats[c.mat];
                return (
                  <tr key={key} style={!active ? { opacity: 0.45 } : undefined}>
                    <td style={{ fontWeight: 700, color: "var(--ink)" }}>{c.tipo}</td>
                    <td>
                      <span className="ls-mono" style={{ fontWeight: 600 }}>{c.mat}</span>{" "}
                      <span style={{ color: "var(--muted)" }}>· {c.matName}</span>
                    </td>
                    {isOptica && (
                      <td className="num" style={{ color: "var(--muted)", fontWeight: 500 }}>
                        {COP(gp[key])}
                      </td>
                    )}
                    <td style={{ textAlign: "right" }}>
                      {!active ? (
                        <span className="ls-badge is-idle" style={{ height: 22 }}>
                          Desactivado
                        </span>
                      ) : isOptica ? (
                        <input
                          className={"price-edit" + (isOv(key) ? " over" : "")}
                          value={COP(opticaPrice(key))}
                          onChange={(e) => editOverride(key, num(e.target.value))}
                        />
                      ) : (
                        <input
                          className="price-edit"
                          value={COP(gp[key])}
                          onChange={(e) => editGeneral(key, num(e.target.value))}
                        />
                      )}
                    </td>
                    {isOptica && (
                      <td style={{ textAlign: "right", width: 1, whiteSpace: "nowrap" }}>
                        {active &&
                          (isOv(key) ? (
                            <button
                              className="ls-btn ls-btn-ghost ls-btn-sm"
                              style={{ height: 32 }}
                              onClick={() => revert(key)}
                              title="Quitar precio especial"
                              type="button"
                            >
                              <Icon name="repeat" size={14} />Revertir
                            </button>
                          ) : (
                            <span className="ls-sub" style={{ fontSize: 11.5, color: "var(--faint)" }}>
                              −{tierPct * 100}%
                            </span>
                          ))}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 24 }}>
          <SectionHead
            title="Precios de tratamientos"
            sub={
              isOptica
                ? `Lo que paga ${targetName} por cada tratamiento — se suma al lente.`
                : "Precio general — se suma al total del lente."
            }
            icon="shield"
          />
          <div className="ls-card" style={{ padding: 0, overflow: "hidden", marginTop: 12 }}>
            <table className="dtable">
              <thead>
                <tr>
                  <th>Tratamiento</th>
                  {isOptica && <th style={{ textAlign: "right" }}>General</th>}
                  <th style={{ textAlign: "right" }}>
                    {isOptica ? "Precio óptica" : "Precio general"}
                  </th>
                  {isOptica && <th></th>}
                </tr>
              </thead>
              <tbody>
                {TREATMENTS.map((t) => {
                  const incl = tp[t.key] === 0;
                  return (
                    <tr key={t.key}>
                      <td style={{ fontWeight: 600, color: "var(--ink)" }}>{t.key}</td>
                      {isOptica && (
                        <td className="num" style={{ color: "var(--muted)", fontWeight: 500 }}>
                          {incl ? "Incluido" : COP(tp[t.key])}
                        </td>
                      )}
                      <td style={{ textAlign: "right", width: 1 }}>
                        {incl ? (
                          <span className="ls-badge is-done" style={{ height: 22 }}>
                            Incluido
                          </span>
                        ) : isOptica ? (
                          <input
                            className={"price-edit" + (tIsOv(t.key) ? " over" : "")}
                            value={COP(tOpticaPrice(t.key))}
                            onChange={(e) => editTov(t.key, num(e.target.value))}
                          />
                        ) : (
                          <input
                            className="price-edit"
                            value={COP(tp[t.key])}
                            onChange={(e) =>
                              setTp((p) => ({ ...p, [t.key]: num(e.target.value) }))
                            }
                          />
                        )}
                      </td>
                      {isOptica && (
                        <td style={{ textAlign: "right", width: 1, whiteSpace: "nowrap" }}>
                          {!incl &&
                            (tIsOv(t.key) ? (
                              <button
                                className="ls-btn ls-btn-ghost ls-btn-sm"
                                style={{ height: 32 }}
                                onClick={() => revertTov(t.key)}
                                title="Quitar precio especial"
                                type="button"
                              >
                                <Icon name="repeat" size={14} />Revertir
                              </button>
                            ) : (
                              <span className="ls-sub" style={{ fontSize: 11.5, color: "var(--faint)" }}>
                                −{tierPct * 100}%
                              </span>
                            ))}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <SectionHead
            title="Materiales del catálogo"
            sub="Desactiva un índice para ocultarlo de los pedidos."
            icon="settings"
          />
          <div className="ls-chips" style={{ marginTop: 12 }}>
            {MATERIALS.map((m) => (
              <button
                key={m.idx}
                className={"ls-chip" + (activeMats[m.idx] ? " on" : "")}
                onClick={() => toggleMat(m.idx)}
                type="button"
              >
                <span className="ls-mono">{m.idx}</span> {m.name}
                <span className="x">{activeMats[m.idx] ? "✓" : "+"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ls-row" style={{ marginTop: 24, gap: 10 }}>
          <span className="ls-sub" style={{ fontWeight: 600 }}>
            Los cambios se guardan automáticamente en este demo.
          </span>
          <span className="ls-grow" />
          <button
            className="ls-btn ls-btn-primary ls-btn-sm"
            onClick={() => onToast("Catálogo y precios actualizados")}
            type="button"
          >
            <Icon name="check" size={16} sw={2.3} />Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
