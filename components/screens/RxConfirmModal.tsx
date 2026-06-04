"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { RxTableRO } from "../OrderDetails";
import { COP, MATERIALS, type Rx } from "@/lib/data";
import type { ValidationIssue } from "@/lib/rx-validation";

type Props = {
  rx: Rx;
  paciente: string;
  tipo: string;
  mat: string;
  trats: string[];
  precio: number;
  issues: ValidationIssue[];
  onClose: () => void;
  onConfirm: () => void;
};

export function RxConfirmModal({
  rx, paciente, tipo, mat, trats, precio, issues, onClose, onConfirm,
}: Props) {
  const warns = issues.filter((i) => i.level === "warn");
  const [ack, setAck] = useState<Record<string, boolean>>({});
  const allAcked = warns.every((w) => ack[w.id]);
  const m = MATERIALS.find((x) => x.idx === mat);

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ width: "min(560px, 100%)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <div className="modal-head">
          <div className="ls-eyebrow" style={{ marginBottom: 6 }}>Confirmar antes de enviar</div>
          <div className="ls-h2">{paciente}</div>
          <div className="ls-sub" style={{ marginTop: 4 }}>
            {tipo} · {mat} {m?.name} · {trats.length} tratamiento{trats.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="modal-body" style={{ overflow: "auto" }}>
          <RxTableRO rx={rx} />
          {warns.length > 0 && (
            <div className="ls-col" style={{ gap: 8, marginTop: 6 }}>
              {warns.map((w) => (
                <label
                  key={w.id}
                  className="vbanner warn"
                  style={{ cursor: "pointer", alignItems: "flex-start" }}
                >
                  <input
                    type="checkbox"
                    checked={!!ack[w.id]}
                    onChange={(e) => setAck((p) => ({ ...p, [w.id]: e.target.checked }))}
                    style={{
                      width: 18, height: 18,
                      accentColor: "var(--warn)",
                      marginTop: 1, flexShrink: 0,
                    }}
                  />
                  <span>
                    <b>{w.message}.</b> {w.detail}
                  </span>
                </label>
              ))}
            </div>
          )}
          <div
            className="ls-card"
            style={{
              padding: 14, background: "var(--bg-sunken)",
              border: "1px solid var(--line)", marginTop: 4,
            }}
          >
            <div className="ls-row">
              <span className="ls-eyebrow">Total estimado</span>
              <span className="ls-grow" />
              <span
                className="ls-mono"
                style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)" }}
              >
                {COP(precio)}
              </span>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Revisar
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            disabled={warns.length > 0 && !allAcked}
            onClick={onConfirm}
            type="button"
          >
            <Icon name="check" size={18} sw={2.3} />Enviar al laboratorio
          </button>
        </div>
      </div>
    </div>
  );
}
