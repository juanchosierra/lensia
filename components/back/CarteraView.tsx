"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Field } from "../ui/Field";
import { COP } from "@/lib/data";
import {
  ACCOUNTS, BUCKETS, STATUS_META, acctSummary,
  type Account, type AccountSummary,
} from "@/lib/commercial-data";
import { OPTICAS, opticaById } from "@/lib/back-data";

type Mode = "mobile" | "desktop";

type LabAccount = Account & { id: string; name: string };

const METODOS = ["Transferencia", "Efectivo", "Cheque", "Tarjeta"];
const BUCKET_ORDER: Array<"b90" | "b60" | "b30" | "corriente"> = ["b90", "b60", "b30", "corriente"];

function AgingMini({ aging, saldo }: { aging: Record<string, number>; saldo: number }) {
  if (!saldo) return <span style={{ color: "var(--faint)" }}>—</span>;
  return (
    <div className="aging" style={{ width: 104 }}>
      {BUCKETS.map((b) => {
        const v = aging[b.key];
        return v > 0 ? (
          <i
            key={b.key}
            style={{ width: (v / saldo * 100) + "%", background: b.color }}
            title={b.label}
          />
        ) : null;
      })}
    </div>
  );
}

type PagoModalProps = {
  acct: LabAccount;
  onClose: () => void;
  onConfirm: (id: string, monto: number, metodo: string, fecha: string) => void;
};

function PagoModal({ acct, onClose, onConfirm }: PagoModalProps) {
  const sum = acctSummary(acct);
  const [monto, setMonto] = useState(String(sum.vencido || sum.saldo || 0));
  const [metodo, setMetodo] = useState(METODOS[0]);
  const [fecha, setFecha] = useState("Hoy");
  const m = parseInt(monto.replace(/\D/g, ""), 10) || 0;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="ls-eyebrow" style={{ marginBottom: 5 }}>Registrar pago</div>
          <div className="ls-h2">{acct.name}</div>
          <div className="ls-sub" style={{ marginTop: 2 }}>
            Saldo actual{" "}
            <span className="ls-mono" style={{ color: "var(--ink)", fontWeight: 700 }}>
              {COP(sum.saldo)}
            </span>{" "}
            · vencido{" "}
            <span className="ls-mono" style={{ color: "var(--danger)", fontWeight: 700 }}>
              {COP(sum.vencido)}
            </span>
          </div>
        </div>
        <div className="modal-body">
          <Field label="Monto del pago">
            <input
              className="ls-input ls-mono"
              value={monto ? COP(m) : ""}
              onChange={(e) => setMonto(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="$0"
              style={{ fontSize: 16, fontWeight: 700 }}
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Método">
              <select
                className="ls-select"
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
              >
                {METODOS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Fecha">
              <input
                className="ls-input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Field>
          </div>
          <div className="vbanner info">
            <span style={{ flexShrink: 0, marginTop: 1 }}>
              <Icon name="check" size={15} />
            </span>
            <span>
              Se aplica a las facturas más antiguas primero. Nuevo saldo:{" "}
              <b className="ls-mono">{COP(Math.max(0, sum.saldo - m))}</b>
            </span>
          </div>
        </div>
        <div className="modal-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            disabled={m <= 0}
            onClick={() => onConfirm(acct.id, m, metodo, fecha)}
            type="button"
          >
            <Icon name="check" size={17} sw={2.3} />Registrar {COP(m)}
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = { mode: Mode; onToast: (msg: string) => void };

export function CarteraView({ mode, onToast }: Props) {
  const [accts, setAccts] = useState<Record<string, LabAccount>>(() => {
    const o: Record<string, LabAccount> = {};
    Object.keys(ACCOUNTS).forEach((k) => {
      o[k] = {
        id: k,
        name: opticaById(k).name,
        ...ACCOUNTS[k],
        facturas: ACCOUNTS[k].facturas.map((f) => ({ ...f })),
        pagos: ACCOUNTS[k].pagos.map((p) => ({ ...p })),
      };
    });
    return o;
  });
  const [pagoFor, setPagoFor] = useState<string | null>(null);

  const order: LabAccount[] = OPTICAS.map((o) => accts[o.id]).filter(Boolean);
  const totals = order.reduce(
    (t, a) => {
      const s = acctSummary(a);
      t.saldo += s.saldo;
      t.vencido += s.vencido;
      if (s.status === "blocked") t.bloq++;
      if (s.vencido > 0) t.mora++;
      return t;
    },
    { saldo: 0, vencido: 0, bloq: 0, mora: 0 },
  );

  const applyPago = (id: string, monto: number, metodo: string, fecha: string) => {
    setAccts((prev) => {
      const a: LabAccount = {
        ...prev[id],
        facturas: prev[id].facturas.map((f) => ({ ...f })),
        pagos: [{ fecha, monto, metodo }, ...prev[id].pagos],
      };
      let rem = monto;
      const ordered = [...a.facturas].sort(
        (x, y) => BUCKET_ORDER.indexOf(x.bucket) - BUCKET_ORDER.indexOf(y.bucket),
      );
      ordered.forEach((f) => {
        if (rem <= 0) return;
        const pay = Math.min(rem, f.monto);
        f.monto -= pay;
        rem -= pay;
      });
      a.facturas = a.facturas.filter((f) => f.monto > 0);
      return { ...prev, [id]: a };
    });
    setPagoFor(null);
    onToast(`Pago de ${COP(monto)} registrado · ${opticaById(id).name}`);
  };

  const setCupo = (id: string, val: number) =>
    setAccts((prev) => ({ ...prev, [id]: { ...prev[id], cupo: val } }));

  const pad = mode === "desktop" ? 28 : 16;

  return (
    <div className="ls-scroll" style={{ height: "100%", paddingBottom: 28 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 0` }}>
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 14 }}>Cartera</h1>
        )}
        <div
          className="kpis"
          style={{ gridTemplateColumns: mode === "desktop" ? "repeat(4,1fr)" : "1fr 1fr" }}
        >
          <div className="kpi">
            <div className="lab">Total por cobrar</div>
            <div className="val">{COP(totals.saldo)}</div>
          </div>
          <div className="kpi">
            <div className="lab">Vencido</div>
            <div className="val" style={{ color: "var(--danger)" }}>{COP(totals.vencido)}</div>
            <div className="sub" style={{ color: "var(--muted)" }}>
              {totals.saldo > 0 ? Math.round((totals.vencido / totals.saldo) * 100) : 0}% de la cartera
            </div>
          </div>
          <div className="kpi">
            <div className="lab">En mora</div>
            <div className="val">{totals.mora}</div>
            <div className="sub" style={{ color: "var(--warn)" }}>
              {totals.mora === 1 ? "óptica con saldo vencido" : "ópticas con saldo vencido"}
            </div>
          </div>
          <div className="kpi">
            <div className="lab">Bloqueadas</div>
            <div className="val" style={{ color: totals.bloq ? "var(--danger)" : "var(--ink)" }}>
              {totals.bloq}
            </div>
            <div className="sub" style={{ color: "var(--muted)" }}>auto-bloqueo por mora</div>
          </div>
        </div>
      </div>

      <div style={{ padding: `18px ${pad}px 0` }}>
        {mode === "desktop" ? (
          <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="dtable-scroll">
              <table className="dtable" style={{ minWidth: 720 }}>
                <thead>
                  <tr>
                    <th>Óptica</th>
                    <th style={{ textAlign: "right" }}>Saldo</th>
                    <th style={{ textAlign: "right" }}>Vencido</th>
                    <th>Antigüedad</th>
                    <th>Cupo de crédito</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {order.map((a) => {
                    const s: AccountSummary = acctSummary(a);
                    const initials = a.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("");
                    return (
                      <tr key={a.id}>
                        <td>
                          <div className="ls-row" style={{ gap: 10 }}>
                            <span className="ls-avatar" style={{ width: 32, height: 32 }}>
                              {initials}
                            </span>
                            <div className="ls-col" style={{ gap: 0 }}>
                              <span
                                style={{
                                  fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap",
                                }}
                              >
                                {a.name}
                              </span>
                              <span
                                style={{
                                  fontSize: 11.5, color: "var(--muted)", whiteSpace: "nowrap",
                                }}
                              >
                                {opticaById(a.id).city} · {a.plazo}d
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="num">{COP(s.saldo)}</td>
                        <td
                          className="num"
                          style={{ color: s.vencido ? "var(--danger)" : "var(--faint)" }}
                        >
                          {s.vencido ? COP(s.vencido) : "—"}
                        </td>
                        <td><AgingMini aging={s.aging} saldo={s.saldo} /></td>
                        <td>
                          <input
                            className={"price-edit" + (s.usage > 1 ? " over" : "")}
                            style={{ width: 104 }}
                            value={COP(a.cupo)}
                            onChange={(e) =>
                              setCupo(a.id, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)
                            }
                          />
                        </td>
                        <td>
                          <span
                            className={"ls-badge " + STATUS_META[s.status].cls}
                            style={{ height: 24 }}
                          >
                            <i className="dot" />
                            {STATUS_META[s.status].label}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button
                            className="ls-btn ls-btn-soft ls-btn-sm"
                            onClick={() => setPagoFor(a.id)}
                            type="button"
                          >
                            <Icon name="check" size={15} />Registrar pago
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="ls-col" style={{ gap: 12 }}>
            {order.map((a) => {
              const s = acctSummary(a);
              const initials = a.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("");
              return (
                <div key={a.id} className="ls-card" style={{ padding: 14 }}>
                  <div className="ls-row" style={{ gap: 10, marginBottom: 10 }}>
                    <span className="ls-avatar" style={{ width: 34, height: 34 }}>
                      {initials}
                    </span>
                    <div className="ls-col" style={{ gap: 0 }}>
                      <span style={{ fontWeight: 700, color: "var(--ink)" }}>{a.name}</span>
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>
                        {opticaById(a.id).city}
                      </span>
                    </div>
                    <span className="ls-grow" />
                    <span
                      className={"ls-badge " + STATUS_META[s.status].cls}
                      style={{ height: 24 }}
                    >
                      <i className="dot" />
                      {STATUS_META[s.status].label}
                    </span>
                  </div>
                  <div className="ls-row" style={{ gap: 16, marginBottom: 10 }}>
                    <div className="ls-col" style={{ gap: 1 }}>
                      <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>
                        SALDO
                      </span>
                      <span className="ls-mono" style={{ fontWeight: 700, color: "var(--ink)" }}>
                        {COP(s.saldo)}
                      </span>
                    </div>
                    <div className="ls-col" style={{ gap: 1 }}>
                      <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>
                        VENCIDO
                      </span>
                      <span
                        className="ls-mono"
                        style={{
                          fontWeight: 700,
                          color: s.vencido ? "var(--danger)" : "var(--faint)",
                        }}
                      >
                        {s.vencido ? COP(s.vencido) : "—"}
                      </span>
                    </div>
                    <span className="ls-grow" />
                    <button
                      className="ls-btn ls-btn-soft ls-btn-sm"
                      onClick={() => setPagoFor(a.id)}
                      type="button"
                    >
                      <Icon name="check" size={15} />Pago
                    </button>
                  </div>
                  <AgingMini aging={s.aging} saldo={s.saldo} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {pagoFor && (
        <PagoModal
          acct={accts[pagoFor]}
          onClose={() => setPagoFor(null)}
          onConfirm={applyPago}
        />
      )}
    </div>
  );
}
