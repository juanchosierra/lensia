"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./ui/Icon";
import { SectionHead } from "./ui/SectionHead";
import { MATERIALS, type Order, type Rx } from "@/lib/data";

const RX_COLS = [
  { k: "esf", l: "ESF" }, { k: "cil", l: "CIL" }, { k: "eje", l: "EJE" },
  { k: "add", l: "ADD" }, { k: "dp", l: "DP" }, { k: "alt", l: "ALT" },
] as const;

function Cell({ v }: { v?: string }) {
  return (
    <div
      className="ls-rx-cell ls-mono"
      style={{ fontSize: 13, fontWeight: 600, color: v ? "var(--ink)" : "var(--faint)" }}
    >
      {v || "—"}
    </div>
  );
}

export function RxTableRO({ rx }: { rx: Rx }) {
  const grid = "92px repeat(6, 1fr)";
  return (
    <div className="ls-rx">
      <div className="ls-rx-head" style={{ gridTemplateColumns: grid }}>
        <div className="cell eye">Ojo</div>
        {RX_COLS.map((c) => <div key={c.k} className="cell">{c.l}</div>)}
      </div>
      {(["od", "oi"] as const).map((k) => (
        <div key={k} className="ls-rx-row" style={{ gridTemplateColumns: grid }}>
          <div className="ls-rx-eye">
            <span className={"ab" + (k === "oi" ? " oi" : "")}>{k.toUpperCase()}</span>
          </div>
          {RX_COLS.map((c) => <Cell key={c.k} v={rx[k][c.k]} />)}
        </div>
      ))}
    </div>
  );
}

export function KV({ k, v }: { k: string; v?: string }) {
  return (
    <div className="ls-col" style={{ gap: 2 }}>
      <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700, letterSpacing: ".02em" }}>{k}</span>
      <span style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 600 }}>{v || "—"}</span>
    </div>
  );
}

const parseCal = (c: string) => {
  const m = /(\d+)\D+(\d+)\D+(\d+)/.exec(c || "");
  return m ? { a: m[1], puente: m[2], varilla: m[3] } : { a: "—", puente: "—", varilla: "—" };
};

function Medida({ k, v, unit }: { k: string; v?: string; unit?: string }) {
  const empty = v == null || v === "" || v === "—";
  return (
    <div className="medida">
      <span className="mk">{k}</span>
      <span className="mv ls-mono">
        {empty ? "—" : v}
        {!empty && unit ? <span className="mu"> {unit}</span> : null}
      </span>
    </div>
  );
}

function MonturaEstado({ estado }: { estado: string }) {
  const solo = /solo lente/i.test(estado);
  const nueva = /nueva/i.test(estado);
  const cls = solo ? "solo" : nueva ? "nueva" : "envia";
  return (
    <div className={"montura-estado " + cls}>
      <span className="me-ico">
        <Icon name={solo ? "alert" : "frame"} size={17} />
      </span>
      <div className="ls-col" style={{ gap: 1, minWidth: 0 }}>
        <span className="me-lab">ESTADO DE LA MONTURA</span>
        <span className="me-val">{estado}</span>
      </div>
      <span className="ls-grow" />
      {solo && <span className="me-note">El lab no monta — entrega el lente sin biselar</span>}
    </div>
  );
}

function RecetaFoto({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const isClient = typeof window !== "undefined";
  return (
    <>
      <button
        className="receta-thumb"
        onClick={() => setOpen(true)}
        title="Ampliar foto de la receta"
        type="button"
      >
        <span className="receta-tag ls-mono">RX-{id}.jpg</span>
        <span className="receta-zoom">
          <Icon name="search" size={15} sw={2} />
        </span>
      </button>
      {open && isClient && createPortal(
        <div className="receta-light" onClick={() => setOpen(false)}>
          <div className="receta-light-inner" onClick={(e) => e.stopPropagation()}>
            <div className="receta-light-head">
              <span className="ls-mono" style={{ fontSize: 13, fontWeight: 700 }}>
                Foto de la receta · #{id}
              </span>
              <button className="iconbtn" onClick={() => setOpen(false)} type="button">
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="receta-light-img">
              <span className="ls-mono">foto de la receta</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

export function OrderDetails({ o }: { o: Order }) {
  const m = MATERIALS.find((x) => x.idx === o.mat);
  const cal = parseCal(o.montura.calibre);
  const alt = o.rx.od.alt || o.rx.oi.alt || "";
  const diam = o.montura.diam || (o.montura.calibre === "—" ? "" : "70 mm");
  const vbox = o.montura.vbox || (o.montura.calibre === "—" ? "" : "34 mm");
  return (
    <div className="ls-col" style={{ gap: 18 }}>
      <div className="ls-col" style={{ gap: 10 }}>
        <SectionHead title="Fórmula (Rx)" icon="eye" />
        <RxTableRO rx={o.rx} />
      </div>

      <div className="ls-col" style={{ gap: 10 }}>
        <SectionHead title="Lente" icon="spark" />
        <div className="ls-card" style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <KV k="TIPO" v={o.tipo} />
          <KV k="MATERIAL / ÍNDICE" v={`${o.mat} · ${m ? m.name : ""}`} />
          <div style={{ gridColumn: "1 / -1" }}>
            <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>TRATAMIENTOS</span>
            <div className="ls-chips" style={{ marginTop: 7 }}>
              {o.trats.map((t) => (
                <span key={t} className="ls-chip on" style={{ height: 30, fontSize: 12 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ls-col" style={{ gap: 10 }}>
        <SectionHead title="Montura" icon="frame" />
        <div className="ls-card" style={{ padding: 14 }}>
          <MonturaEstado estado={o.montura.estado} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
            <KV k="TIPO" v={o.montura.tipo} />
            <KV k="MARCA" v={o.montura.marca} />
            <KV k="MATERIAL" v={o.montura.material} />
            <KV k="COLOR" v={o.montura.color} />
          </div>
          <div className="ls-divider" style={{ margin: "14px 0 12px" }} />
          <div className="ls-row" style={{ gap: 7, marginBottom: 9 }}>
            <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700, letterSpacing: ".03em" }}>
              MEDIDAS PARA BISELAR
            </span>
            <span className="ls-mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)" }}>
              {o.montura.calibre}
            </span>
          </div>
          <div className="medidas">
            <Medida k="Calibre A" v={cal.a} unit="mm" />
            <Medida k="Puente" v={cal.puente} unit="mm" />
            <Medida k="Varilla" v={cal.varilla} unit="mm" />
            <Medida
              k="A × B"
              v={cal.a !== "—" ? `${cal.a} × ${vbox.replace(/\D/g, "")}` : ""}
              unit="mm"
            />
            <Medida k="Ø Blank" v={diam} />
            <Medida k="Altura mtj." v={alt} unit={alt ? "mm" : ""} />
          </div>
        </div>
      </div>

      <div className="ls-col" style={{ gap: 10 }}>
        <SectionHead title="Receta de la óptica" icon="camera" />
        <div className="ls-card" style={{ padding: 14 }}>
          <div className="ls-row" style={{ gap: 14, alignItems: "stretch" }}>
            <RecetaFoto id={o.id} />
            <div className="ls-col ls-grow" style={{ gap: 5, minWidth: 0 }}>
              <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700, letterSpacing: ".03em" }}>
                OBSERVACIONES DE LA ÓPTICA
              </span>
              <p
                style={{
                  margin: 0, fontSize: 13.5,
                  color: o.obs ? "var(--text)" : "var(--faint)",
                  lineHeight: 1.55, fontWeight: 500,
                  fontStyle: o.obs ? "normal" : "italic",
                }}
              >
                {o.obs || "Sin observaciones adicionales."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
