"use client";

import { useState } from "react";
import { Icon, type IconName } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import {
  GARANTIA_STATES, MOTIVOS, RESPONSABILIDAD_META,
  type Garantia, type MotivoGarantia,
} from "@/lib/garantia";

type Mode = "mobile" | "desktop";

function estadoBadge(g: Garantia) {
  if (g.estado === "rechazada") {
    return <span className="ls-badge is-alert"><i className="dot" />Rechazada</span>;
  }
  if (g.estado === "lista") {
    return <span className="ls-badge is-done"><i className="dot" />Lista</span>;
  }
  return (
    <span className="ls-badge is-active">
      <i className="dot" />
      {GARANTIA_STATES.find((s) => s.key === g.estado)?.label}
    </span>
  );
}

function GarantiaCard({ g, onOpen }: { g: Garantia; onOpen: (g: Garantia) => void }) {
  const motivo = MOTIVOS.find((m) => m.key === g.motivo);
  return (
    <div className="ls-card ls-order" onClick={() => onOpen(g)}>
      <div className="ls-row" style={{ gap: 8, marginBottom: 9 }}>
        <span
          className="ls-mono"
          style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)" }}
        >
          {g.id}
        </span>
        <span
          className="ls-pill"
          style={{ height: 22, fontSize: 11, fontWeight: 700 }}
        >
          pedido #{g.orderId}
        </span>
        <span className="ls-grow" />
        {estadoBadge(g)}
      </div>
      <div className="ls-h3" style={{ fontSize: 15, marginBottom: 3 }}>{g.paciente}</div>
      <div
        className="ls-row"
        style={{ gap: 7, color: "var(--muted)", fontSize: 12.5, fontWeight: 600 }}
      >
        {motivo?.label}
        <span className="dash">·</span>
        <span style={{ whiteSpace: "nowrap" }}>{g.fecha}</span>
      </div>
      {g.responsabilidad && (
        <>
          <div style={{ height: 10 }} />
          <span
            className={"ls-badge " + RESPONSABILIDAD_META[g.responsabilidad].cls}
            style={{ height: 22, fontSize: 11 }}
          >
            {RESPONSABILIDAD_META[g.responsabilidad].label}
          </span>
        </>
      )}
    </div>
  );
}

type FormProps = {
  orderId: string;
  paciente: string;
  onClose: () => void;
  onSubmit: (g: {
    orderId: string;
    paciente: string;
    motivo: MotivoGarantia;
    descripcion: string;
    foto: boolean;
  }) => void;
};

export function NuevaGarantiaForm({ orderId, paciente, onClose, onSubmit }: FormProps) {
  const [motivo, setMotivo] = useState<MotivoGarantia>("rayado-dano");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState(false);
  const valid = descripcion.trim().length >= 10;

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(540px, 100%)", maxHeight: "92vh", display: "flex", flexDirection: "column" }}
      >
        <div className="modal-head">
          <div className="ls-eyebrow" style={{ marginBottom: 5 }}>Reportar problema</div>
          <div className="ls-h2">{paciente}</div>
          <div className="ls-sub" style={{ marginTop: 2 }}>Pedido #{orderId}</div>
        </div>
        <div className="modal-body" style={{ overflow: "auto" }}>
          <div className="ls-col" style={{ gap: 8 }}>
            <span className="ls-label">Motivo del reporte</span>
            <div className="ls-optgrid" style={{ gridTemplateColumns: "1fr" }}>
              {MOTIVOS.map((m) => (
                <button
                  key={m.key}
                  className={"ls-opt" + (motivo === m.key ? " on" : "")}
                  onClick={() => setMotivo(m.key)}
                  type="button"
                >
                  <span className="t">{m.label}</span>
                  <span className="d">{m.desc}</span>
                  <span className="check">
                    <Icon name="check" size={16} sw={2.6} style={{ color: "var(--brand)" }} />
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="ls-field">
            <label className="ls-label">Descripción detallada</label>
            <textarea
              className="ls-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el problema con el mayor detalle posible. Esto ayuda a clasificar y resolver más rápido."
            />
          </div>
          <button
            onClick={() => setFoto((v) => !v)}
            type="button"
            style={{
              border: "1.5px dashed " + (foto ? "var(--brand)" : "var(--line-2)"),
              borderRadius: 14, padding: 14, display: "flex",
              alignItems: "center", gap: 12,
              background: foto ? "var(--brand-50)" : "var(--card)",
              textAlign: "left", transition: "all .15s",
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 11,
                background: foto ? "var(--brand)" : "var(--bg-sunken)",
                color: foto ? "#fff" : "var(--muted)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}
            >
              <Icon name={foto ? "check" : "camera"} size={20} />
            </div>
            <div className="ls-col" style={{ gap: 1 }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)" }}>
                {foto ? "Foto del problema adjunta" : "Adjuntar foto del problema"}
              </span>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                Muy recomendado — acelera la decisión del lab.
              </span>
            </div>
          </button>
        </div>
        <div className="modal-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            disabled={!valid}
            onClick={() => onSubmit({ orderId, paciente, motivo, descripcion, foto })}
            type="button"
          >
            <Icon name="check" size={17} sw={2.3} />Enviar reporte
          </button>
        </div>
      </div>
    </div>
  );
}

function GarantiaTimeline({ g }: { g: Garantia }) {
  const cur = g.estadoN;
  const states =
    g.estado === "rechazada"
      ? GARANTIA_STATES.slice(0, 3)
      : GARANTIA_STATES;
  return (
    <div className="ls-timeline">
      {states.map((s) => {
        const done = s.n < cur;
        const current = s.n === cur;
        const isReject = current && g.estado === "rechazada";
        const h = g.hist.find((x) => x.n === s.n);
        const cls = ["ls-tl-step", s.key, done ? "done" : "", current ? "current" : ""].join(" ");
        return (
          <div key={s.n} className={cls}>
            <div className="ls-tl-rail">
              <div
                className="ls-tl-node"
                style={isReject ? { background: "var(--danger)", color: "#fff", boxShadow: "0 0 0 5px var(--danger-bg)" } : undefined}
              >
                {done ? (
                  <Icon name="check" size={16} sw={2.6} />
                ) : isReject ? (
                  <Icon name="x" size={15} sw={2.3} />
                ) : (
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{s.n}</span>
                )}
              </div>
              {s.n < states.length && <div className="ls-tl-line" />}
            </div>
            <div className="ls-tl-body">
              <div className="ls-tl-title">
                {isReject ? "Rechazada" : s.label}
              </div>
              {h && <div className="ls-tl-time">{h.ts}</div>}
              {!done && !current && <div className="ls-tl-desc">{s.desc}</div>}
              {h?.info && (
                <div className="ls-tl-info" style={isReject ? { background: "var(--danger-bg)", color: "var(--danger)" } : undefined}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon name={isReject ? "alert" : "check"} size={15} />
                  </span>
                  <span>{h.info}</span>
                </div>
              )}
              {isReject && g.rechazoMotivo && !h?.info && (
                <div
                  className="ls-tl-info"
                  style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
                >
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon name="alert" size={15} />
                  </span>
                  <span>{g.rechazoMotivo}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function GarantiaDetail({
  g, mode, onBack,
}: { g: Garantia; mode: Mode; onBack: () => void }) {
  const motivo = MOTIVOS.find((m) => m.key === g.motivo);
  const pad = mode === "desktop" ? 28 : 18;
  return (
    <div className="ls-scroll" style={{ paddingBottom: mode === "desktop" ? 36 : 96 }}>
      <div
        style={{
          padding: `${mode === "desktop" ? 18 : 12}px ${pad}px`,
          position: "sticky", top: 0,
          background: "rgba(244,247,251,.9)", backdropFilter: "blur(8px)", zIndex: 10,
        }}
        className="ls-row"
      >
        <button className="ls-btn ls-btn-ghost ls-btn-sm" onClick={onBack} type="button">
          <Icon name="chevL" size={16} />Garantías
        </button>
        <span className="ls-grow" />
      </div>
      <div style={{ padding: `4px ${pad}px 0`, display: "grid", gap: 16 }}>
        <div className="ls-card" style={{ padding: 16 }}>
          <div className="ls-row" style={{ gap: 8, marginBottom: 8 }}>
            <span
              className="ls-mono"
              style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)" }}
            >
              {g.id}
            </span>
            <span className="ls-pill" style={{ height: 22 }}>pedido #{g.orderId}</span>
            <span className="ls-grow" />
            {estadoBadge(g)}
          </div>
          <div className="ls-h2" style={{ marginBottom: 4 }}>{g.paciente}</div>
          <div className="ls-sub">{motivo?.label} · reportado {g.fecha}</div>
          <div className="ls-divider" style={{ margin: "14px 0" }} />
          <p
            style={{
              fontSize: 13.5, color: "var(--text)", fontWeight: 500,
              margin: 0, lineHeight: 1.55,
            }}
          >
            {g.descripcion}
          </p>
          {g.responsabilidad && (
            <div style={{ marginTop: 14 }}>
              <span
                className={"ls-badge " + RESPONSABILIDAD_META[g.responsabilidad].cls}
                style={{ height: 26 }}
              >
                <i className="dot" />
                {RESPONSABILIDAD_META[g.responsabilidad].label} · {RESPONSABILIDAD_META[g.responsabilidad].cobro}
              </span>
            </div>
          )}
          {g.reprocessOrderId && (
            <div className="vbanner info" style={{ marginTop: 14 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <Icon name="repeat" size={16} />
              </span>
              <span>
                Reproceso ligado:{" "}
                <span
                  className="ls-mono"
                  style={{ fontWeight: 800, color: "var(--brand-700)" }}
                >
                  #{g.reprocessOrderId}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="ls-card" style={{ padding: 20 }}>
          <SectionHead
            title="Seguimiento del reporte"
            sub="Cada paso lo actualiza el laboratorio."
            icon="pin"
          />
          <div style={{ height: 18 }} />
          <GarantiaTimeline g={g} />
        </div>
      </div>
    </div>
  );
}

type ListProps = {
  garantias: Garantia[];
  mode: Mode;
  onOpen: (g: Garantia) => void;
};

export function GarantiaList({ garantias, mode, onOpen }: ListProps) {
  const pad = mode === "desktop" ? 28 : 18;
  return (
    <div className="ls-scroll" style={{ paddingBottom: mode === "desktop" ? 36 : 96 }}>
      <div
        style={{
          padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px`,
        }}
      >
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 8 }}>Garantías</h1>
        )}
        <p
          className="ls-sub"
          style={{ marginBottom: 6 }}
        >
          Reportes de problemas o reprocesos sobre pedidos entregados. Para reportar uno nuevo,
          abre el pedido en <b>Mis Órdenes</b> y usa “Reportar problema”.
        </p>
      </div>
      <div
        style={{
          padding: `4px ${pad}px 0`,
          display: "grid", gap: 12,
          gridTemplateColumns: mode === "desktop" ? "repeat(2, 1fr)" : "1fr",
        }}
      >
        {garantias.length === 0 ? (
          <div
            className="ls-col"
            style={{
              alignItems: "center", padding: "60px 0",
              color: "var(--faint)", gap: 10, gridColumn: "1 / -1",
            }}
          >
            <Icon name="shield" size={32} />
            <span style={{ fontWeight: 600 }}>Sin garantías abiertas</span>
          </div>
        ) : (
          garantias.map((g) => <GarantiaCard key={g.id} g={g} onOpen={onOpen} />)
        )}
      </div>
    </div>
  );
}

export const garantiaIcon: IconName = "shield";
