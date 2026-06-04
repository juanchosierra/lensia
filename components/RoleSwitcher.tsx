"use client";

import { useState } from "react";
import { Icon } from "./ui/Icon";
import {
  LAB_ROLES, ROLE_META, SHOP_ROLES,
  type LabRole, type ShopRole, type Role,
} from "@/lib/roles";

type Props = {
  side: "lab" | "shop";
  role: Role;
  setRole: (r: Role) => void;
  compact?: boolean;
};

export function RoleSwitcher({ side, role, setRole, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const roles: Role[] =
    side === "lab" ? (LAB_ROLES as Role[]) : (SHOP_ROLES as Role[]);
  const current = ROLE_META[role];
  if (!current) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: compact ? "5px 10px" : "7px 13px",
          background: "var(--bg-sunken)", borderRadius: 999,
          border: "1px solid var(--line)",
          cursor: "pointer",
          fontSize: compact ? 11 : 12,
          fontWeight: 700,
          color: "var(--muted)",
          letterSpacing: "-.01em",
        }}
      >
        <Icon name="user" size={compact ? 13 : 14} />
        <span style={{ color: "var(--ink)" }}>{current.label}</span>
        <Icon name="chevron" size={compact ? 11 : 12} style={{ transform: "rotate(90deg)" }} />
      </button>
      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
          />
          <div
            className="ls-pop"
            style={{
              top: compact ? 36 : 42,
              right: 0,
              width: 252,
              padding: 6,
            }}
          >
            <div
              style={{
                padding: "8px 12px 6px",
                fontSize: 10, fontWeight: 800,
                letterSpacing: ".08em", textTransform: "uppercase",
                color: "var(--faint)",
              }}
            >
              Rol demo · {side === "lab" ? "Laboratorio" : "Óptica"}
            </div>
            {roles.map((r) => {
              const meta = ROLE_META[r];
              const active = r === role;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
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
                      fontSize: 13, fontWeight: 700,
                      color: active ? "var(--brand-700)" : "var(--ink)",
                    }}
                  >
                    {meta.label}
                    {active && (
                      <Icon
                        name="check"
                        size={13}
                        sw={2.4}
                        style={{ marginLeft: 6, verticalAlign: "-1px", color: "var(--brand)" }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5, color: "var(--muted)",
                      fontWeight: 500, marginTop: 1,
                    }}
                  >
                    {meta.sub}
                  </div>
                </button>
              );
            })}
            <div
              style={{
                marginTop: 4,
                padding: "8px 12px",
                fontSize: 10.5, color: "var(--faint)",
                lineHeight: 1.5, fontWeight: 500,
                borderTop: "1px solid var(--line)",
              }}
            >
              RBAC demo: cambia el rol y verás cómo aparecen/desaparecen módulos y acciones.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export type { Role, LabRole, ShopRole };
