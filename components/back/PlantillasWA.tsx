"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import {
  DEFAULT_WA_TEMPLATES, WA_VARIABLES, renderTemplate,
  type WATemplate,
} from "@/lib/wa-templates";

type Mode = "mobile" | "desktop";

function WhatsAppBubble({ body }: { body: string }) {
  const rendered = renderTemplate(body);
  // simple markdown: *bold*
  const html = rendered
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*(.+?)\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br/>");
  return (
    <div
      style={{
        background: "#D9FDD3",
        borderRadius: "12px 12px 12px 3px",
        padding: "8px 12px 9px",
        maxWidth: 320,
        fontSize: 14, lineHeight: 1.4,
        color: "#0b1f10",
        boxShadow: "0 1px 1px rgba(0,0,0,.07)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        position: "relative",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div
        style={{
          textAlign: "right",
          fontSize: 10.5, color: "#667781",
          marginTop: 4,
        }}
      >
        9:41 ✓✓
      </div>
    </div>
  );
}

function VariableChip({
  v, onPick,
}: { v: typeof WA_VARIABLES[number]; onPick: (k: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(v.key)}
      className="ls-chip"
      style={{ height: 30, fontSize: 11.5, cursor: "pointer" }}
      title={`${v.label} → ${v.example}`}
    >
      <span className="ls-mono" style={{ color: "var(--brand)" }}>{v.key}</span>
    </button>
  );
}

export function PlantillasWA({
  mode, onToast,
}: { mode: Mode; onToast: (m: string) => void }) {
  const [templates, setTemplates] = useState<WATemplate[]>(DEFAULT_WA_TEMPLATES);
  const [sel, setSel] = useState<string>(DEFAULT_WA_TEMPLATES[0].key);
  const current = templates.find((t) => t.key === sel) ?? templates[0];
  const pad = mode === "desktop" ? 28 : 16;

  const updateBody = (body: string) =>
    setTemplates((list) => list.map((t) => (t.key === current.key ? { ...t, body } : t)));
  const toggle = (key: string) =>
    setTemplates((list) => list.map((t) => (t.key === key ? { ...t, enabled: !t.enabled } : t)));
  const insert = (variable: string) => {
    const next = current.body + " " + variable;
    updateBody(next);
  };

  return (
    <div className="ls-scroll" style={{ paddingBottom: 28 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px` }}>
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 10 }}>Plantillas WhatsApp</h1>
        )}
        <SectionHead
          title="Mensajes por cambio de estado"
          sub="Lo que reciben las ópticas cuando un pedido avanza."
          icon="phone"
        />
      </div>

      <div
        style={{
          padding: `0 ${pad}px`,
          display: "grid",
          gap: 16,
          gridTemplateColumns: mode === "desktop" ? "320px 1fr 280px" : "1fr",
        }}
      >
        {/* list */}
        <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
          {templates.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setSel(t.key)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "13px 14px",
                background: sel === t.key ? "var(--brand-50)" : "transparent",
                border: "none",
                borderBottom: "1px solid var(--line)",
                cursor: "pointer",
              }}
            >
              <div className="ls-row" style={{ gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    width: 24, height: 24, borderRadius: 7,
                    background: t.enabled ? "var(--ok-bg)" : "var(--bg-sunken)",
                    color: t.enabled ? "var(--ok)" : "var(--faint)",
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}
                >
                  <Icon name={t.enabled ? "check" : "x"} size={13} sw={2.4} />
                </span>
                <span
                  style={{
                    fontSize: 13.5, fontWeight: 700,
                    color: sel === t.key ? "var(--brand-700)" : "var(--ink)",
                  }}
                >
                  {t.label}
                </span>
                <span className="ls-grow" />
                {t.estadoN > 0 && (
                  <span
                    className="ls-mono"
                    style={{
                      fontSize: 11, fontWeight: 700,
                      color: "var(--faint)",
                    }}
                  >
                    #{t.estadoN}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 11.5, color: "var(--muted)",
                  fontWeight: 500, lineHeight: 1.45,
                  overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                }}
              >
                {t.body}
              </div>
            </button>
          ))}
        </div>

        {/* editor */}
        <div className="ls-card" style={{ padding: 18 }}>
          <div className="ls-row" style={{ marginBottom: 12 }}>
            <div className="ls-col" style={{ gap: 2 }}>
              <span className="ls-eyebrow">Editando</span>
              <span className="ls-h3">{current.label}</span>
            </div>
            <span className="ls-grow" />
            <button
              type="button"
              onClick={() => toggle(current.key)}
              className={"ls-btn ls-btn-sm " + (current.enabled ? "ls-btn-ghost" : "ls-btn-primary")}
            >
              <Icon name={current.enabled ? "x" : "check"} size={15} />
              {current.enabled ? "Desactivar" : "Activar"}
            </button>
          </div>
          <textarea
            className="ls-textarea"
            value={current.body}
            onChange={(e) => updateBody(e.target.value)}
            placeholder="Escribe el mensaje. Usa * para *negritas*."
            style={{ minHeight: 140, fontFamily: "var(--mono)", fontSize: 13.5 }}
          />
          <div style={{ marginTop: 12 }}>
            <span className="ls-eyebrow">Variables disponibles</span>
            <div className="ls-row" style={{ gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {WA_VARIABLES.map((v) => (
                <VariableChip key={v.key} v={v} onPick={insert} />
              ))}
            </div>
          </div>
          <div className="ls-row" style={{ marginTop: 16, gap: 10 }}>
            <span className="ls-sub">Cambios guardados automáticamente.</span>
            <span className="ls-grow" />
            <button
              className="ls-btn ls-btn-primary ls-btn-sm"
              onClick={() => onToast("Plantillas WhatsApp actualizadas")}
              type="button"
            >
              <Icon name="check" size={15} />Guardar
            </button>
          </div>
        </div>

        {/* preview */}
        <div
          className="ls-card"
          style={{
            padding: 18,
            background: "linear-gradient(180deg, #efeae2 0, #efeae2 100%)",
            border: "1px solid #d6cfc1",
          }}
        >
          <div
            className="ls-eyebrow"
            style={{ color: "#3d5a4a", marginBottom: 10 }}
          >
            Vista previa
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: 10,
              borderRadius: 12,
              background: "#efeae2",
            }}
          >
            <WhatsAppBubble body={current.body} />
          </div>
          <p
            style={{
              marginTop: 12,
              fontSize: 11, color: "#5a6a5e",
              fontWeight: 500, lineHeight: 1.5,
            }}
          >
            Las variables se reemplazan con datos reales del pedido al enviarse.
          </p>
        </div>
      </div>
    </div>
  );
}
