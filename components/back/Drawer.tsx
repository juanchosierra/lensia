"use client";

import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { StatusBadge } from "../ui/StatusBadge";
import { OrderDetails, KV } from "../OrderDetails";
import { Timeline } from "../Timeline";
import { STATES, type Order } from "@/lib/data";
import { opticaById } from "@/lib/back-data";

type Mode = "mobile" | "desktop";

type Props = {
  order: Order;
  mode: Mode;
  onClose: () => void;
  onAdvance: (order: Order, toN: number) => void;
  onException: (order: Order) => void;
};

export function Drawer({ order, mode, onClose, onAdvance, onException }: Props) {
  const op = opticaById(order.optica);
  const next = order.estadoN < 8 ? STATES[order.estadoN] : null;
  const initials = op.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div
        className="drawer"
        style={mode === "mobile" ? { width: "100%" } : undefined}
      >
        <div className="drawer-head">
          <button className="iconbtn" onClick={onClose} type="button">
            <Icon name="chevron" size={18} style={{ transform: "scaleX(1)" }} />
          </button>
          <div className="ls-grow">
            <div className="ls-row" style={{ gap: 8 }}>
              <span className="ls-mono" style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)" }}>
                #{order.id}
              </span>
              <StatusBadge order={order} />
            </div>
            <div className="ls-h2" style={{ marginTop: 2 }}>{order.paciente}</div>
          </div>
        </div>

        <div className="drawer-body ls-col" style={{ gap: 20 }}>
          <div className="ls-card" style={{ padding: 15 }}>
            <div className="ls-row" style={{ gap: 10, marginBottom: 12 }}>
              <div className="ls-avatar" style={{ width: 38, height: 38 }}>
                {initials}
              </div>
              <div className="ls-col" style={{ gap: 1 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{op.name}</span>
                <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{op.city}</span>
              </div>
              <span className="ls-grow" />
              <span className={"tier" + (op.tier === "Preferente" ? " pref" : "")}>
                {op.tier}
              </span>
            </div>
            <div className="ls-divider" style={{ marginBottom: 12 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <KV k="SOLICITÓ" v={order.solicitadoPor} />
              <KV k="TELÉFONO" v={order.telefono} />
              <KV k="PRIORIDAD" v={order.prioridad} />
            </div>
          </div>

          {order.exception && (
            <div
              className="ls-tl-info"
              style={{ background: "var(--warn-bg)", color: "var(--warn)", margin: 0 }}
            >
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <Icon name="alert" size={16} />
              </span>
              <span>
                <b>{order.exception.label}.</b> {order.exception.detail}
              </span>
            </div>
          )}

          <OrderDetails o={order} />

          <div className="ls-col" style={{ gap: 10 }}>
            <SectionHead title="Historial" icon="clock" />
            <div className="ls-card" style={{ padding: "18px 16px 4px" }}>
              <Timeline o={order} />
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          {!order.exception && order.estadoN < 8 && (
            <button
              className="ls-btn ls-btn-ghost ls-btn-sm"
              onClick={() => onException(order)}
              title="Marcar en espera de material"
              type="button"
            >
              <Icon name="alert" size={16} />Excepción
            </button>
          )}
          <span className="ls-grow" />
          {next ? (
            <button
              className="ls-btn ls-btn-primary"
              onClick={() => onAdvance(order, order.estadoN + 1)}
              type="button"
            >
              Avanzar a {next.label}
              <Icon name="chevron" size={17} sw={2.3} />
            </button>
          ) : (
            <span
              className="ls-badge is-done"
              style={{ height: 38, padding: "0 16px" }}
            >
              <Icon name="check" size={16} />Entregado
            </span>
          )}
        </div>
      </div>
    </>
  );
}
