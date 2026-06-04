"use client";

import { Icon, type IconName } from "./ui/Icon";
import { STATES, type Order } from "@/lib/data";

type Mode = "mobile" | "desktop";

type Noti = {
  id: string;
  txt: string;
  sub: string;
  ic: IconName;
  alert: boolean;
};

function buildNotis(orders: Order[]): Noti[] {
  return orders
    .slice()
    .sort((a, b) => b.estadoN - a.estadoN)
    .slice(0, 4)
    .map((o) => {
      const st = STATES[o.estadoN - 1];
      let txt: string;
      let ic: IconName = "spark";
      if (o.exception) {
        txt = `${o.exception.label} · #${o.id}`;
        ic = "alert";
      } else if (o.estadoN === 7) {
        txt = `Despachado · #${o.id} va en camino`;
        ic = "truck";
      } else if (o.estadoN >= 8) {
        txt = `Entregado · #${o.id} recibido`;
        ic = "check";
      } else {
        txt = `${st.label} · #${o.id}`;
        ic = "spark";
      }
      return { id: o.id, txt, sub: o.paciente, ic, alert: !!o.exception };
    });
}

type Props = {
  orders: Order[];
  onOpen: (o: Order) => void;
  mode: Mode;
};

export function Notifications({ orders, onOpen, mode }: Props) {
  const notis = buildNotis(orders);
  return (
    <div
      className="ls-pop"
      style={{
        top: mode === "mobile" ? 56 : 54,
        right: mode === "mobile" ? 12 : 18,
        width: 320,
      }}
    >
      <div
        style={{ padding: "13px 15px", borderBottom: "1px solid var(--line)" }}
        className="ls-row"
      >
        <span className="ls-h3">Notificaciones</span>
        <span className="ls-grow" />
        <span style={{ fontSize: 11, color: "var(--brand)", fontWeight: 700 }}>
          Push · WhatsApp
        </span>
      </div>
      {notis.map((n) => {
        const o = orders.find((x) => x.id === n.id);
        if (!o) return null;
        return (
          <button
            key={n.id}
            className="ls-noti"
            style={{ width: "100%", textAlign: "left" }}
            onClick={() => onOpen(o)}
            type="button"
          >
            <div
              className="ic"
              style={n.alert ? { background: "var(--warn-bg)", color: "var(--warn)" } : undefined}
            >
              <Icon name={n.ic} size={16} />
            </div>
            <div className="ls-col" style={{ gap: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{n.txt}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{n.sub}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
