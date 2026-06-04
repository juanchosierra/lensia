"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { Field } from "../ui/Field";
import {
  MOTIVOS, RESPONSABILIDAD_META, type Garantia, type Responsabilidad,
} from "@/lib/garantia";
import { opticaById } from "@/lib/back-data";

type Mode = "mobile" | "desktop";

function ReprocessoCard({
  g, onOpen,
}: { g: Garantia; onOpen: (g: Garantia) => void }) {
  const op = opticaById(g.optica);
  const motivo = MOTIVOS.find((m) => m.key === g.motivo);
  return (
    <button
      onClick={() => onOpen(g)}
      className="ls-card"
      style={{
        padding: 15,
        textAlign: "left",
        cursor: "pointer",
        transition: "box-shadow .15s, border-color .15s",
      }}
      type="button"
    >
      <div className="ls-row" style={{ gap: 8, marginBottom: 9 }}>
        <span
          className="ls-mono"
          style={{ fontSize: 12, fontWeight: 800, color: "var(--brand)" }}
        >
          {g.id}
        </span>
        <span className="ls-pill" style={{ height: 22 }}>pedido #{g.orderId}</span>
        <span className="ls-grow" />
        {g.responsabilidad && (
          <span
            className={"ls-badge " + RESPONSABILIDAD_META[g.responsabilidad].cls}
            style={{ height: 22, fontSize: 11 }}
          >
            {RESPONSABILIDAD_META[g.responsabilidad].label}
          </span>
        )}
      </div>
      <div className="ls-h3" style={{ fontSize: 15, marginBottom: 2 }}>{g.paciente}</div>
      <div
        className="ls-sub"
        style={{ marginBottom: 9 }}
      >
        {op.name} · {motivo?.label} · {g.fecha}
      </div>
      <p
        style={{
          fontSize: 12.5, color: "var(--muted)",
          margin: 0, lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical" as const,
          overflow: "hidden",
        }}
      >
        {g.descripcion}
      </p>
    </button>
  );
}

type DrawerProps = {
  g: Garantia;
  onClose: () => void;
  onApprove: (g: Garantia, resp: Responsabilidad) => void;
  onReject: (g: Garantia, motivo: string) => void;
};

function ReprocessoDrawer({ g, onClose, onApprove, onReject }: DrawerProps) {
  const op = opticaById(g.optica);
  const motivo = MOTIVOS.find((m) => m.key === g.motivo);
  const [resp, setResp] = useState<Responsabilidad>(
    g.responsabilidad ?? "lab",
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rechazo, setRechazo] = useState("");
  const decided = g.estadoN >= 3;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <button className="iconbtn" onClick={onClose} type="button">
            <Icon name="chevron" size={18} />
          </button>
          <div className="ls-grow">
            <div className="ls-row" style={{ gap: 8 }}>
              <span
                className="ls-mono"
                style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)" }}
              >
                {g.id}
              </span>
              <span className="ls-pill" style={{ height: 22 }}>pedido #{g.orderId}</span>
            </div>
            <div className="ls-h2" style={{ marginTop: 2 }}>{g.paciente}</div>
          </div>
        </div>
        <div className="drawer-body ls-col" style={{ gap: 18 }}>
          <div className="ls-card" style={{ padding: 14 }}>
            <div className="ls-row" style={{ gap: 10 }}>
              <div className="ls-avatar" style={{ width: 36, height: 36 }}>
                {op.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </div>
              <div className="ls-col" style={{ gap: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
                  {op.name}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  {op.city} · reportado {g.fecha}
                </span>
              </div>
              <span className="ls-grow" />
              <span
                className={"tier" + (op.tier === "Preferente" ? " pref" : "")}
              >
                {op.tier}
              </span>
            </div>
          </div>

          <div className="ls-col" style={{ gap: 10 }}>
            <SectionHead title="Motivo del reporte" icon="alert" />
            <div className="ls-card" style={{ padding: 14 }}>
              <div
                className="ls-row"
                style={{ gap: 8, marginBottom: 8 }}
              >
                <span
                  style={{
                    fontSize: 13, fontWeight: 800,
                    color: "var(--ink)",
                  }}
                >
                  {motivo?.label}
                </span>
                {g.foto && (
                  <span className="ls-pill" style={{ height: 22 }}>
                    <Icon name="camera" size={12} />Con foto
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 13, color: "var(--text)",
                  margin: 0, lineHeight: 1.5,
                }}
              >
                {g.descripcion}
              </p>
              {g.foto && (
                <div
                  style={{
                    marginTop: 12, height: 130, borderRadius: 11,
                    border: "1px solid var(--line-2)",
                    backgroundColor: "var(--bg-sunken)",
                    backgroundImage:
                      "repeating-linear-gradient(135deg, transparent 0 12px, rgba(43,79,140,.07) 12px 24px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--faint)",
                  }}
                >
                  <span className="ls-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>
                    foto del problema
                  </span>
                </div>
              )}
            </div>
          </div>

          {!decided && (
            <div className="ls-col" style={{ gap: 10 }}>
              <SectionHead
                title="Clasificar responsabilidad"
                sub="Define quién asume el costo y si procede el reproceso."
                icon="shield"
              />
              <div className="ls-optgrid" style={{ gap: 8 }}>
                {(["lab", "garantia", "optica"] as Responsabilidad[]).map((k) => (
                  <button
                    key={k}
                    className={"ls-opt" + (resp === k ? " on" : "")}
                    onClick={() => setResp(k)}
                    type="button"
                  >
                    <span className="t">{RESPONSABILIDAD_META[k].label}</span>
                    <span className="d">{RESPONSABILIDAD_META[k].sub}</span>
                    <span className="check">
                      <Icon name="check" size={16} sw={2.6} style={{ color: "var(--brand)" }} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {decided && g.responsabilidad && (
            <div className="ls-card" style={{ padding: 14 }}>
              <div className="ls-eyebrow">Decisión</div>
              <div className="ls-row" style={{ gap: 10, marginTop: 8 }}>
                <span
                  className={"ls-badge " + RESPONSABILIDAD_META[g.responsabilidad].cls}
                  style={{ height: 26 }}
                >
                  <i className="dot" />
                  {RESPONSABILIDAD_META[g.responsabilidad].label}
                </span>
                {g.reprocessOrderId && (
                  <span
                    className="ls-mono"
                    style={{
                      fontSize: 12, color: "var(--brand-700)",
                      background: "var(--brand-50)",
                      padding: "4px 10px", borderRadius: 999,
                      fontWeight: 800,
                    }}
                  >
                    Reproceso #{g.reprocessOrderId}
                  </span>
                )}
              </div>
              {g.rechazoMotivo && (
                <div className="vbanner err" style={{ marginTop: 10 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon name="alert" size={15} />
                  </span>
                  <span>{g.rechazoMotivo}</span>
                </div>
              )}
            </div>
          )}

          {rejectOpen && (
            <div className="ls-col" style={{ gap: 8 }}>
              <Field label="Motivo del rechazo (lo verá la óptica)">
                <textarea
                  className="ls-textarea"
                  value={rechazo}
                  onChange={(e) => setRechazo(e.target.value)}
                  placeholder="Explica con respeto por qué no procede el reproceso."
                />
              </Field>
            </div>
          )}
        </div>
        <div className="drawer-foot">
          {!decided && (
            <>
              <button
                className="ls-btn ls-btn-ghost"
                onClick={() => setRejectOpen((v) => !v)}
                type="button"
              >
                <Icon name="x" size={16} />Rechazar
              </button>
              <span className="ls-grow" />
              {rejectOpen ? (
                <button
                  className="ls-btn ls-btn-primary"
                  disabled={rechazo.trim().length < 5}
                  onClick={() => onReject(g, rechazo)}
                  type="button"
                  style={{ background: "var(--danger)" }}
                >
                  <Icon name="check" size={17} sw={2.3} />Enviar rechazo
                </button>
              ) : (
                <button
                  className="ls-btn ls-btn-primary"
                  onClick={() => onApprove(g, resp)}
                  type="button"
                >
                  <Icon name="check" size={17} sw={2.3} />
                  Aprobar y generar reproceso
                </button>
              )}
            </>
          )}
          {decided && (
            <>
              <span className="ls-grow" />
              <button className="ls-btn ls-btn-ghost" onClick={onClose} type="button">
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

type Props = {
  garantias: Garantia[];
  onApprove: (g: Garantia, resp: Responsabilidad) => void;
  onReject: (g: Garantia, motivo: string) => void;
  mode: Mode;
};

export function ReprocesosView({ garantias, onApprove, onReject, mode }: Props) {
  const [sel, setSel] = useState<Garantia | null>(null);
  const pad = mode === "desktop" ? 28 : 16;

  const pendientes = garantias.filter((g) => g.estadoN < 3);
  const cerradas = garantias.filter((g) => g.estadoN >= 3);

  return (
    <div className="ls-scroll" style={{ paddingBottom: 28 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px` }}>
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 10 }}>Reprocesos</h1>
        )}
        <SectionHead
          title="Por resolver"
          sub={`${pendientes.length} solicitud${pendientes.length === 1 ? "" : "es"} pendientes de clasificación`}
          icon="alert"
        />
      </div>
      <div
        style={{
          padding: `0 ${pad}px`,
          display: "grid",
          gap: 12,
          gridTemplateColumns: mode === "desktop" ? "repeat(auto-fill, minmax(320px,1fr))" : "1fr",
        }}
      >
        {pendientes.length === 0 ? (
          <div
            className="ls-col"
            style={{
              alignItems: "center",
              padding: "40px 0",
              color: "var(--faint)",
              gap: 10,
              gridColumn: "1 / -1",
            }}
          >
            <Icon name="check" size={28} />
            <span style={{ fontWeight: 600 }}>Todo al día — sin reprocesos abiertos</span>
          </div>
        ) : (
          pendientes.map((g) => <ReprocessoCard key={g.id} g={g} onOpen={setSel} />)
        )}
      </div>

      <div style={{ padding: `28px ${pad}px 14px` }}>
        <SectionHead
          title="Cerradas"
          sub={`${cerradas.length} reproceso${cerradas.length === 1 ? "" : "s"} resueltos`}
          icon="check"
        />
      </div>
      <div
        style={{
          padding: `0 ${pad}px`,
          display: "grid",
          gap: 12,
          gridTemplateColumns: mode === "desktop" ? "repeat(auto-fill, minmax(320px,1fr))" : "1fr",
        }}
      >
        {cerradas.map((g) => <ReprocessoCard key={g.id} g={g} onOpen={setSel} />)}
      </div>

      {sel && (
        <ReprocessoDrawer
          g={garantias.find((x) => x.id === sel.id) ?? sel}
          onClose={() => setSel(null)}
          onApprove={(g, r) => {
            onApprove(g, r);
            setSel(null);
          }}
          onReject={(g, m) => {
            onReject(g, m);
            setSel(null);
          }}
        />
      )}
    </div>
  );
}
