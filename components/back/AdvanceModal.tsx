"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Field } from "../ui/Field";
import { STATES, type Order } from "@/lib/data";

const TRANSPORTADORAS = [
  "Servientrega", "Coordinadora", "Interrapidísimo", "TCC", "Envía",
];

export type AdvanceExtra = { eta: string; ship?: boolean };

type Props = {
  order: Order;
  toN: number;
  onClose: () => void;
  onConfirm: (order: Order, toN: number, info: string, extra: AdvanceExtra) => void;
};

export function AdvanceModal({ order, toN, onClose, onConfirm }: Props) {
  const from = STATES[order.estadoN - 1];
  const to = STATES[toN - 1];
  const [eta, setEta] = useState(order.eta !== "—" ? order.eta : "");
  const [transp, setTransp] = useState(TRANSPORTADORAS[0]);
  const [guia, setGuia] = useState("");
  const [nota, setNota] = useState("");
  const [recibe, setRecibe] = useState("");

  let info = "";
  if (toN === 2) info = eta ? `Entrega estimada: ${eta}.` + (nota ? " " + nota : "") : nota;
  else if (toN === 7)
    info = `${transp} · Guía ${guia || "—"}` + (eta ? ` · ETA ${eta}` : "");
  else if (toN === 8)
    info = recibe ? `Recibido por ${recibe} en la óptica.` : "Entregado en la óptica.";
  else info = nota;

  const ship = toN === 7;
  const confirm = () =>
    onConfirm(order, toN, info.trim(), { eta: toN === 2 ? eta : order.eta, ship });

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="ls-eyebrow" style={{ marginBottom: 6 }}>
            Avanzar pedido #{order.id}
          </div>
          <div className="stepflow">
            <div className="from">
              <div className="lbl">Desde</div>
              <div className="val">{from.label}</div>
            </div>
            <span style={{ color: "var(--brand)" }}>
              <Icon name="chevron" size={20} />
            </span>
            <div className="to">
              <div className="lbl">Hacia</div>
              <div className="val">{to.label}</div>
            </div>
          </div>
        </div>
        <div className="modal-body">
          <p
            style={{
              fontSize: 13, color: "var(--muted)",
              margin: 0, fontWeight: 500, lineHeight: 1.5,
            }}
          >
            Lo que agregues aquí lo verá la óptica en su seguimiento.
          </p>
          {toN === 2 && (
            <>
              <Field label="Fecha estimada de entrega">
                <input
                  className="ls-input"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="Ej. 5 Jun"
                />
              </Field>
              <Field label="Nota para la óptica" opt="opcional">
                <input
                  className="ls-input"
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Observación de validación"
                />
              </Field>
            </>
          )}
          {toN === 7 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Transportadora">
                  <select
                    className="ls-select"
                    value={transp}
                    onChange={(e) => setTransp(e.target.value)}
                  >
                    {TRANSPORTADORAS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="# de guía">
                  <input
                    className="ls-input ls-mono"
                    value={guia}
                    onChange={(e) => setGuia(e.target.value)}
                    placeholder="0000-00000"
                  />
                </Field>
              </div>
              <Field label="ETA de llegada" opt="opcional">
                <input
                  className="ls-input"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="Ej. 2 Jun"
                />
              </Field>
            </>
          )}
          {toN === 8 && (
            <Field label="¿Quién recibió?" opt="opcional">
              <input
                className="ls-input"
                value={recibe}
                onChange={(e) => setRecibe(e.target.value)}
                placeholder="Nombre"
              />
            </Field>
          )}
          {![2, 7, 8].includes(toN) && (
            <Field label="Nota para la óptica" opt="opcional">
              <input
                className="ls-input"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder={
                  to.key === "tratamientos"
                    ? "Ej. AR Premium + Blue cut aplicados"
                    : "Observación"
                }
              />
            </Field>
          )}
          {info && (
            <div className="ls-tl-info" style={{ marginTop: -2 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>
                <Icon name="eye" size={15} />
              </span>
              <span>
                La óptica verá: <b>{info}</b>
              </span>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            onClick={confirm}
            type="button"
          >
            <Icon name="check" size={18} sw={2.3} />Confirmar avance
          </button>
        </div>
      </div>
    </div>
  );
}
