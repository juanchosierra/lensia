"use client";

import { useEffect, useState, type ReactNode } from "react";

export type TweakState = {
  brand: string;
  font: string;
  corners: "Suaves" | "Marcadas";
};

const KEY = "lensia.tweaks.v1";

export function useTweaks(defaults: TweakState): [TweakState, <K extends keyof TweakState>(k: K, v: TweakState[K]) => void] {
  const [t, setT] = useState<TweakState>(defaults);
  // hydrate from localStorage after mount to keep SSR stable
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setT({ ...defaults, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const set = <K extends keyof TweakState>(k: K, v: TweakState[K]) => {
    setT((prev) => {
      const next = { ...prev, [k]: v };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };
  return [t, set];
}

const panelBase = {
  position: "fixed" as const,
  right: 22,
  bottom: 22,
  zIndex: 9000,
  background: "#0d1726",
  color: "#fff",
  borderRadius: 18,
  boxShadow: "0 24px 60px rgba(0,0,0,.32), 0 0 0 1px rgba(255,255,255,.04)",
  width: 296,
  fontFamily: "Plus Jakarta Sans, system-ui, sans-serif",
};

type PanelProps = { title?: string; children: ReactNode };

export function TweaksPanel({ title = "Tweaks", children }: PanelProps) {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", right: 22, bottom: 22, zIndex: 9000,
          width: 48, height: 48, borderRadius: "50%",
          background: "#0d1726", color: "#fff",
          boxShadow: "0 18px 36px rgba(0,0,0,.32)",
          border: "none", cursor: "pointer",
          display: "grid", placeItems: "center", fontSize: 18,
        }}
        aria-label="Abrir tweaks"
      >
        ⚙
      </button>
    );
  }
  return (
    <div style={panelBase}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 14px 8px", borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: ".06em", textTransform: "uppercase", color: "#cad4e4" }}>
          {title}
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar tweaks"
          style={{
            border: "none", background: "transparent", color: "#cad4e4",
            cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: "8px 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

export function TweakSection({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 11, fontWeight: 800, letterSpacing: ".08em",
        textTransform: "uppercase", color: "#7a8aa0",
        padding: "10px 2px 0",
      }}
    >
      {label}
    </div>
  );
}

type ColorProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

export function TweakColor({ label, value, options, onChange }: ColorProps) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#cad4e4", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => onChange(c)}
            aria-label={c}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              background: c,
              border: value.toLowerCase() === c.toLowerCase()
                ? "2px solid #fff"
                : "2px solid rgba(255,255,255,.18)",
              boxShadow: value.toLowerCase() === c.toLowerCase()
                ? "0 0 0 3px rgba(255,255,255,.08)"
                : "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

type RadioProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

export function TweakRadio({ label, value, options, onChange }: RadioProps) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#cad4e4", marginBottom: 6 }}>{label}</div>
      <div
        style={{
          display: "flex", gap: 4, background: "rgba(255,255,255,.06)",
          padding: 4, borderRadius: 10,
        }}
      >
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            style={{
              flex: 1, fontSize: 12, fontWeight: 700,
              padding: "8px 6px", borderRadius: 7,
              background: value === o ? "rgba(255,255,255,.14)" : "transparent",
              color: value === o ? "#fff" : "#aeb9cc",
              border: "none", cursor: "pointer",
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
