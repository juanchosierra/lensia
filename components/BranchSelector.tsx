"use client";

import { useState } from "react";
import { Icon } from "./ui/Icon";
import { BRANCHES, type Branch } from "@/lib/branches";

type Props = {
  opticaId: string;
  selected: string;
  onSelect: (b: Branch) => void;
  compact?: boolean;
};

export function BranchSelector({ opticaId, selected, onSelect, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const list = BRANCHES[opticaId] ?? [];
  const current = list.find((b) => b.id === selected) ?? list[0];
  if (!current || list.length <= 1) {
    return current ? (
      <span
        style={{
          fontSize: 12, fontWeight: 700, color: "var(--muted)",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}
      >
        <Icon name="pin" size={13} />{current.name}
      </span>
    ) : null;
  }
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: compact ? "5px 11px" : "7px 13px",
          background: "var(--bg-sunken)", borderRadius: 999,
          border: "1px solid var(--line)",
          cursor: "pointer",
          fontSize: compact ? 11.5 : 12.5,
          fontWeight: 700, color: "var(--ink)",
          letterSpacing: "-.01em",
        }}
      >
        <Icon name="pin" size={compact ? 13 : 14} style={{ color: "var(--brand)" }} />
        <span style={{ whiteSpace: "nowrap" }}>{current.name}</span>
        <Icon
          name="chevron"
          size={compact ? 11 : 12}
          style={{ transform: "rotate(90deg)", color: "var(--muted)" }}
        />
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
          />
          <div className="ls-pop" style={{ top: compact ? 36 : 42, right: 0, width: 264, padding: 6 }}>
            <div
              style={{
                padding: "8px 12px 6px",
                fontSize: 10, fontWeight: 800,
                letterSpacing: ".08em", textTransform: "uppercase",
                color: "var(--faint)",
              }}
            >
              Cambiar de sucursal
            </div>
            {list.map((b) => {
              const active = b.id === selected;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onSelect(b);
                    setOpen(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 12px",
                    background: active ? "var(--brand-50)" : "transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13.5, fontWeight: 700,
                      color: active ? "var(--brand-700)" : "var(--ink)",
                    }}
                  >
                    {b.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5, color: "var(--muted)",
                      fontWeight: 500, marginTop: 1,
                    }}
                  >
                    {b.direccion} · {b.ciudad}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function BranchAddress({ id }: { id: string }) {
  const allBranches = Object.values(BRANCHES).flat();
  const b = allBranches.find((x) => x.id === id);
  if (!b) return null;
  return (
    <div className="ls-row" style={{ gap: 8, color: "var(--muted)", fontSize: 12 }}>
      <Icon name="pin" size={13} style={{ color: "var(--brand)" }} />
      <span>
        Despacho a <b style={{ color: "var(--ink)", fontWeight: 700 }}>{b.name}</b> — {b.direccion}, {b.ciudad}
      </span>
    </div>
  );
}
