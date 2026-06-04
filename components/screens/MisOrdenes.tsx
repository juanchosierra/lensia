"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Meter } from "../ui/Meter";
import { StatusBadge } from "../ui/StatusBadge";
import type { Order } from "@/lib/data";

type Mode = "mobile" | "desktop";

const FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "proceso", label: "En proceso" },
  { key: "despachado", label: "Despachadas" },
  { key: "entregado", label: "Entregadas" },
  { key: "alerta", label: "Con alerta" },
] as const;

type FilterKey = typeof FILTERS[number]["key"];

function OrderCard({ o, onOpen }: { o: Order; onOpen: (o: Order) => void }) {
  return (
    <div className="ls-card ls-order" onClick={() => onOpen(o)}>
      <div className="ls-row" style={{ gap: 8, marginBottom: 9 }}>
        <span className="ls-mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--brand)" }}>
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
      <div className="ls-h3" style={{ fontSize: 16, marginBottom: 3 }}>{o.paciente}</div>
      <div className="ls-row" style={{ gap: 7, color: "var(--muted)", fontSize: 12.5, fontWeight: 600, flexWrap: "wrap" }}>
        <span style={{ whiteSpace: "nowrap" }}>{o.tipo}</span>
        <span className="dash">·</span>
        <span className="ls-mono" style={{ whiteSpace: "nowrap" }}>{o.mat}</span>
        <span className="dash">·</span>
        <span style={{ whiteSpace: "nowrap" }}>{o.trats.length} trat.</span>
      </div>
      <div style={{ height: 13 }} />
      <Meter n={o.estadoN} done={o.estadoN >= 8} />
      <div className="ls-row" style={{ marginTop: 11, gap: 8 }}>
        <div className="ls-row" style={{ gap: 6, color: o.exception ? "var(--warn)" : "var(--muted)", fontSize: 12, fontWeight: 600 }}>
          <Icon name={o.exception ? "alert" : o.estadoN >= 8 ? "check" : "clock"} size={14} />
          {o.exception
            ? o.exception.label
            : o.estadoN >= 8
              ? "Entregado " + o.eta
              : "Entrega " + (o.eta === "—" ? "por confirmar" : o.eta)}
        </div>
        <span className="ls-grow" />
        <span style={{ color: "var(--faint)" }}>
          <Icon name="chevron" size={16} />
        </span>
      </div>
    </div>
  );
}

type Props = {
  orders: Order[];
  onOpen: (o: Order) => void;
  mode: Mode;
};

export function MisOrdenes({ orders, onOpen, mode }: Props) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<FilterKey>("todas");

  const match = (o: Order) => {
    if (q) {
      const s = (o.paciente + " " + o.id + " " + o.tipo).toLowerCase();
      if (!s.includes(q.toLowerCase())) return false;
    }
    if (f === "proceso") return o.estadoN < 7 && !o.exception;
    if (f === "despachado") return o.estadoN === 7;
    if (f === "entregado") return o.estadoN >= 8;
    if (f === "alerta") return !!o.exception;
    return true;
  };

  const list = orders.filter(match);
  const counts = (key: FilterKey): number =>
    orders.filter((o) => {
      if (key === "todas") return true;
      if (key === "proceso") return o.estadoN < 7 && !o.exception;
      if (key === "despachado") return o.estadoN === 7;
      if (key === "entregado") return o.estadoN >= 8;
      if (key === "alerta") return !!o.exception;
      return false;
    }).length;

  const pad = mode === "desktop" ? 28 : 18;
  return (
    <div className="ls-scroll" style={{ paddingBottom: mode === "desktop" ? 36 : 96 }}>
      <div
        style={{
          padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px`,
          position: "sticky", top: 0,
          background: "linear-gradient(var(--bg) 78%, transparent)", zIndex: 10,
        }}
      >
        {mode === "mobile" && <h1 className="ls-h1" style={{ marginBottom: 12 }}>Mis Órdenes</h1>}
        <div className="ls-search" style={{ marginBottom: 12 }}>
          <Icon name="search" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar paciente o # de orden…"
          />
        </div>
        <div className="ls-filters">
          {FILTERS.map((x) => (
            <button
              key={x.key}
              className={"ls-filter" + (f === x.key ? " on" : "")}
              onClick={() => setF(x.key)}
            >
              {x.label}
              <span className="cnt">{counts(x.key)}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: `4px ${pad}px 0`,
          display: "grid", gap: 12,
          gridTemplateColumns: mode === "desktop" ? "repeat(2, 1fr)" : "1fr",
        }}
      >
        {list.map((o) => <OrderCard key={o.id} o={o} onOpen={onOpen} />)}
        {list.length === 0 && (
          <div className="ls-col" style={{ alignItems: "center", padding: "60px 0", color: "var(--faint)", gap: 10, gridColumn: "1 / -1" }}>
            <Icon name="search" size={32} />
            <span style={{ fontWeight: 600 }}>Sin resultados</span>
          </div>
        )}
      </div>
    </div>
  );
}
