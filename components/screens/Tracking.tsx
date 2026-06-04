"use client";

import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { StatusBadge } from "../ui/StatusBadge";
import { OrderDetails, KV } from "../OrderDetails";
import { Timeline } from "../Timeline";
import { COP, MATERIALS, type Order } from "@/lib/data";

type Mode = "mobile" | "desktop";

type Props = {
  o: Order;
  onBack: () => void;
  onRepeat: (o: Order) => void;
  mode: Mode;
};

export function Tracking({ o, onBack, onRepeat, mode }: Props) {
  const pad = mode === "desktop" ? 28 : 18;
  const m = MATERIALS.find((x) => x.idx === o.mat);

  const Header = (
    <div className="ls-card" style={{ padding: 16 }}>
      <div className="ls-row" style={{ gap: 8, marginBottom: 10 }}>
        <span className="ls-mono" style={{ fontSize: 13, fontWeight: 800, color: "var(--brand)" }}>
          #{o.id}
        </span>
        {o.prioridad === "Urgente" && (
          <span className="ls-pill urgent">
            <Icon name="spark" size={12} />Urgente
          </span>
        )}
        <span className="ls-grow" />
        <StatusBadge order={o} />
      </div>
      <div className="ls-h2" style={{ marginBottom: 4 }}>{o.paciente}</div>
      <div className="ls-sub">
        {o.tipo} · {o.mat} {m ? m.name : ""} · Solicitó {o.solicitadoPor}
      </div>
      <div className="ls-divider" style={{ margin: "14px 0" }} />
      <div className="ls-row" style={{ gap: 18 }}>
        <KV k="SOLICITUD" v={o.fecha} />
        <KV
          k={o.estadoN >= 8 ? "ENTREGADO" : "ENTREGA EST."}
          v={o.eta === "—" ? "Por confirmar" : o.eta}
        />
        <span className="ls-grow" />
        <div className="ls-col" style={{ alignItems: "flex-end", gap: 2 }}>
          <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>TOTAL</span>
          <span className="ls-mono" style={{ fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
            {COP(o.precio)}
          </span>
        </div>
      </div>
    </div>
  );

  const Actions = (
    <div className="ls-row" style={{ gap: 10 }}>
      <button className="ls-btn ls-btn-soft ls-grow" onClick={() => onRepeat(o)}>
        <Icon name="repeat" size={17} />Repetir pedido
      </button>
      <button className="ls-btn ls-btn-ghost ls-grow">
        <Icon name="phone" size={16} />Contactar lab
      </button>
    </div>
  );

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
        <button className="ls-btn ls-btn-ghost ls-btn-sm" onClick={onBack}>
          <Icon name="chevL" size={16} />Órdenes
        </button>
        <span className="ls-grow" />
        {mode === "desktop" && (
          <span className="ls-mono" style={{ color: "var(--faint)", fontSize: 12, fontWeight: 600 }}>
            Seguimiento en tiempo real
          </span>
        )}
      </div>

      {mode === "desktop" ? (
        <div
          style={{
            padding: `4px ${pad}px 0`,
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 22, alignItems: "start",
          }}
        >
          <div className="ls-col" style={{ gap: 18 }}>
            {Header}
            <div className="ls-card" style={{ padding: 20 }}>
              <SectionHead title="Seguimiento del pedido" sub="Cada paso lo actualiza el laboratorio." icon="pin" />
              <div style={{ height: 18 }} />
              <Timeline o={o} />
            </div>
            {Actions}
          </div>
          <div className="ls-col" style={{ gap: 18, position: "sticky", top: 70 }}>
            <OrderDetails o={o} />
          </div>
        </div>
      ) : (
        <div style={{ padding: `4px ${pad}px 0`, display: "grid", gap: 18 }}>
          {Header}
          {Actions}
          <div className="ls-card" style={{ padding: 18 }}>
            <SectionHead title="Seguimiento" sub="Actualizado por el laboratorio." icon="pin" />
            <div style={{ height: 18 }} />
            <Timeline o={o} />
          </div>
          <OrderDetails o={o} />
        </div>
      )}
    </div>
  );
}
