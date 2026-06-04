"use client";

import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { COP } from "@/lib/data";
import {
  ACCOUNTS, BUCKETS, STATUS_META, acctSummary,
  type Account, type AccountStatus, type AccountSummary, type Factura,
} from "@/lib/commercial-data";

type Mode = "mobile" | "desktop";

function CreditMeter({
  a, sum, status,
}: { a: Account; sum: AccountSummary; status: AccountStatus }) {
  const pct = Math.min(100, Math.round(sum.usage * 100));
  const cls = status === "blocked" ? "block" : status === "warning" ? "warn" : "";
  return (
    <div className="ls-card" style={{ padding: 18 }}>
      <div className="ls-row" style={{ marginBottom: 14 }}>
        <div className="ls-col" style={{ gap: 2 }}>
          <span className="ls-eyebrow">Cupo de crédito</span>
          <span
            className="ls-mono"
            style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", lineHeight: 1 }}
          >
            {COP(a.cupo)}
          </span>
        </div>
        <span className="ls-grow" />
        <span className={"ls-badge " + STATUS_META[status].cls}>
          <i className="dot" />
          {STATUS_META[status].label}
        </span>
      </div>
      <div className={"credit-bar " + cls}>
        <div className="used" style={{ width: pct + "%" }} />
      </div>
      <div className="ls-row" style={{ marginTop: 12, gap: 16 }}>
        <div className="ls-col" style={{ gap: 1 }}>
          <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>USADO</span>
          <span className="ls-mono" style={{ fontWeight: 700, color: "var(--ink)" }}>{COP(sum.saldo)}</span>
        </div>
        <div className="ls-col" style={{ gap: 1 }}>
          <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>DISPONIBLE</span>
          <span
            className="ls-mono"
            style={{ fontWeight: 700, color: status === "blocked" ? "var(--danger)" : "var(--ok)" }}
          >
            {COP(sum.disponible)}
          </span>
        </div>
        <span className="ls-grow" />
        <div className="ls-col" style={{ gap: 1, alignItems: "flex-end" }}>
          <span style={{ fontSize: 11, color: "var(--faint)", fontWeight: 700 }}>PLAZO</span>
          <span style={{ fontWeight: 700, color: "var(--ink)" }}>{a.plazo} días</span>
        </div>
      </div>
    </div>
  );
}

function FacturaEstado({ f }: { f: Factura }) {
  const cls =
    f.estado === "al-dia"
      ? "is-done"
      : f.bucket === "b90" || f.bucket === "b60"
        ? "is-alert"
        : "is-wait";
  const txt = f.estado === "al-dia" ? "Al día" : "Vencida";
  return (
    <span className={"ls-badge " + cls} style={{ height: 22 }}>{txt}</span>
  );
}

type Props = {
  mode: Mode;
  status: AccountStatus;
  setStatus: (s: AccountStatus) => void;
  onToast: (msg: string) => void;
};

export function EstadoCuenta({ mode, status, setStatus, onToast }: Props) {
  const a = ACCOUNTS.claridad;
  const sum = acctSummary(a);
  const pad = mode === "desktop" ? 28 : 18;

  return (
    <div className="ls-scroll" style={{ paddingBottom: mode === "desktop" ? 36 : 96 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 6px` }}>
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 8 }}>Estado de Cuenta</h1>
        )}
      </div>
      <div
        style={{
          padding: `4px ${pad}px 0`, display: "grid", gap: 18,
          maxWidth: mode === "desktop" ? 860 : "none",
          margin: mode === "desktop" ? "0 auto" : 0,
        }}
      >
        <CreditMeter a={a} sum={sum} status={status} />

        {status === "blocked" && (
          <div className="vbanner err">
            <span style={{ flexShrink: 0, marginTop: 1 }}>
              <Icon name="alert" size={17} />
            </span>
            <span>
              <b>Tu cuenta está en pausa.</b> Tienes saldo vencido o sobre el cupo. Ponte al día y podrás
              seguir pidiendo — escríbenos si necesitas un acuerdo, con gusto te ayudamos.
            </span>
          </div>
        )}
        {status === "warning" && (
          <div className="vbanner warn">
            <span style={{ flexShrink: 0, marginTop: 1 }}>
              <Icon name="clock" size={17} />
            </span>
            <span>
              Tienes <b>{COP(sum.vencido)}</b> por ponerte al día. Aún puedes pedir; te avisamos para
              evitar bloqueos.
            </span>
          </div>
        )}

        <div className="ls-col" style={{ gap: 10 }}>
          <div className="ls-row">
            <SectionHead title="Facturas y pedidos" icon="doc" />
            <span className="ls-grow" />
            <button
              className="ls-btn ls-btn-ghost ls-btn-sm"
              onClick={() => onToast("Estado de cuenta descargado (PDF)")}
              type="button"
            >
              <Icon name="doc" size={15} />Descargar
            </button>
          </div>
          <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="dtable">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Emitida</th>
                  <th>Vence</th>
                  <th style={{ textAlign: "right" }}>Monto</th>
                  <th style={{ textAlign: "right" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {a.facturas.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span className="ls-mono" style={{ fontWeight: 700, color: "var(--brand)" }}>
                        {f.id}
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{f.fecha}</td>
                    <td
                      style={{
                        color: f.estado === "vencida" ? "var(--danger)" : "var(--muted)",
                        fontWeight: f.estado === "vencida" ? 700 : 500,
                      }}
                    >
                      {f.vence}
                    </td>
                    <td className="num">{COP(f.monto)}</td>
                    <td style={{ textAlign: "right" }}><FacturaEstado f={f} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ls-card" style={{ padding: 15 }}>
            <span className="ls-eyebrow">Antigüedad del saldo</span>
            <div className="aging" style={{ margin: "10px 0" }}>
              {BUCKETS.map((b) => {
                const v = sum.aging[b.key];
                return v > 0
                  ? <i key={b.key} style={{ width: (v / sum.saldo * 100) + "%", background: b.color }} />
                  : null;
              })}
            </div>
            <div className="aging-legend">
              {BUCKETS.map((b) => (
                <div key={b.key} className="it">
                  <span className="sw" style={{ background: b.color }} />
                  {b.label} días ·{" "}
                  <span className="ls-mono" style={{ color: "var(--ink)" }}>
                    {COP(sum.aging[b.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ls-col" style={{ gap: 10 }}>
          <SectionHead title="Historial de pagos" icon="check" />
          <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="dtable">
              <tbody>
                {a.pagos.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div className="ls-row" style={{ gap: 10 }}>
                        <span
                          className="ls-avatar"
                          style={{ width: 30, height: 30, background: "var(--ok-bg)", color: "var(--ok)" }}
                        >
                          <Icon name="check" size={15} />
                        </span>
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{p.metodo}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--muted)" }}>{p.fecha}</td>
                    <td className="num" style={{ color: "var(--ok)" }}>− {COP(p.monto)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="ls-card"
          style={{
            padding: 14, background: "var(--bg-sunken)",
            border: "1px dashed var(--line-2)",
          }}
        >
          <div className="ls-row" style={{ gap: 8, marginBottom: 10 }}>
            <Icon name="settings" size={15} style={{ color: "var(--faint)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>
              Demo · simular estado de la cuenta
            </span>
          </div>
          <div className="ls-segment" style={{ background: "var(--card)" }}>
            {(
              [
                ["ok", "Al día"],
                ["warning", "Por vencer"],
                ["blocked", "Bloqueada"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                className={status === k ? "on" : ""}
                onClick={() => setStatus(k)}
                type="button"
              >
                {l}
              </button>
            ))}
          </div>
          <p
            style={{
              fontSize: 11.5, color: "var(--faint)",
              margin: "9px 2px 0", lineHeight: 1.4,
            }}
          >
            Cambia el estado para ver cómo reacciona <b>Nueva Orden</b> cuando la cuenta está bloqueada.
          </p>
        </div>
      </div>
    </div>
  );
}
