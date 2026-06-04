"use client";

import type { DragEvent } from "react";
import { Icon } from "../ui/Icon";
import { COP, type Order } from "@/lib/data";
import { opticaById } from "@/lib/back-data";

type Mode = "mobile" | "desktop";

type Props = {
  o: Order;
  mode: Mode;
  onOpen: (o: Order) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, o: Order) => void;
  onDragEnd: () => void;
  dragging: boolean;
};

export function KbCard({ o, mode, onOpen, onDragStart, onDragEnd, dragging }: Props) {
  const op = opticaById(o.optica);
  return (
    <div
      className={"kb-card" + (o.exception ? " alert" : "") + (dragging ? " dragging" : "")}
      draggable={mode === "desktop"}
      onDragStart={(e) => onDragStart(e, o)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(o)}
    >
      <div className="top">
        <span className="ls-mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)" }}>
          #{o.id}
        </span>
        {o.prioridad === "Urgente" && (
          <span
            className="ls-pill urgent"
            style={{ height: 20, padding: "0 7px", fontSize: 11 }}
          >
            <Icon name="spark" size={11} />Urgente
          </span>
        )}
        <span className="ls-grow" />
        {o.exception && (
          <span style={{ color: "var(--warn)" }}>
            <Icon name="alert" size={15} />
          </span>
        )}
      </div>
      <div className="pac">{o.paciente}</div>
      <div className="meta">
        {o.tipo} · <span className="ls-mono">{o.mat}</span> · {o.trats.length} trat.
      </div>
      <div className="foot">
        <span className="tier" style={{ background: "var(--bg-sunken)" }}>{op.name}</span>
        <span className="ls-grow" />
        <span
          className="ls-mono"
          style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}
        >
          {COP(o.precio)}
        </span>
      </div>
    </div>
  );
}
