"use client";

import { Icon } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { COP, STATES, type Order } from "@/lib/data";
import { OPTICAS, opticaById } from "@/lib/back-data";
import { type Garantia } from "@/lib/garantia";

type Mode = "mobile" | "desktop";

type Props = {
  orders: Order[];
  garantias: Garantia[];
  mode: Mode;
};

function BarChart({
  data, height = 160, color = "var(--brand)",
}: {
  data: Array<{ label: string; value: number; sub?: string }>;
  height?: number;
  color?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${data.length}, 1fr)`,
        gap: 8,
        alignItems: "end",
        height,
      }}
    >
      {data.map((d) => {
        const h = max === 0 ? 0 : (d.value / max) * (height - 38);
        return (
          <div
            key={d.label}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <span
              className="ls-mono"
              style={{ fontSize: 11, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}
            >
              {d.value}
            </span>
            <div
              style={{
                width: "70%",
                height: Math.max(2, h),
                background: color,
                borderRadius: "6px 6px 0 0",
                transition: "height .35s",
              }}
            />
            <div
              style={{
                fontSize: 10.5, fontWeight: 700,
                color: "var(--muted)", marginTop: 6, textAlign: "center",
                whiteSpace: "nowrap", maxWidth: "100%",
                overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {d.label}
            </div>
            {d.sub && (
              <div style={{ fontSize: 9.5, color: "var(--faint)", fontWeight: 600 }}>
                {d.sub}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({
  segments, size = 130,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  size?: number;
}) {
  const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="ls-row" style={{ gap: 16, alignItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-sunken)"
          strokeWidth={14}
        />
        {segments.map((s) => {
          const frac = s.value / total;
          const len = frac * c;
          const dashOffset = offset;
          offset += len;
          return (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={14}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap="butt"
            />
          );
        })}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 18, fontWeight: 800,
            fill: "var(--ink)", fontFamily: "var(--mono)",
          }}
        >
          {total}
        </text>
      </svg>
      <div className="ls-col" style={{ gap: 6 }}>
        {segments.map((s) => (
          <div key={s.label} className="ls-row" style={{ gap: 8 }}>
            <span
              style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
              {s.label}
            </span>
            <span
              className="ls-mono"
              style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "var(--ink)" }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportesView({ orders, garantias, mode }: Props) {
  const total = orders.length;
  const enProceso = orders.filter((o) => o.estadoN < 7).length;
  const despachados = orders.filter((o) => o.estadoN === 7).length;
  const entregados = orders.filter((o) => o.estadoN >= 8).length;
  const conExcepcion = orders.filter((o) => !!o.exception).length;
  const revenue = orders.reduce((s, o) => s + o.precio, 0);

  // pedidos por estado
  const porEstado = STATES.map((s) => ({
    label: s.label.length > 12 ? s.label.slice(0, 10) + "…" : s.label,
    value: orders.filter((o) => o.estadoN === s.n).length,
    sub: "#" + s.n,
  }));

  // % reprocesos por óptica
  const reprocesoStats = OPTICAS.map((op) => {
    const orders_op = orders.filter((o) => o.optica === op.id);
    const reprocesos = garantias.filter((g) => g.optica === op.id);
    const pct =
      orders_op.length > 0
        ? Math.round((reprocesos.length / orders_op.length) * 1000) / 10
        : 0;
    return {
      label: op.name.split(" ").slice(0, 2).join(" "),
      value: pct,
      sub: `${reprocesos.length}/${orders_op.length}`,
    };
  });

  // pedidos por óptica (cantidad)
  const opticaSegs = OPTICAS.map((op, i) => ({
    label: op.name,
    value: orders.filter((o) => o.optica === op.id).length,
    color: ["var(--brand)", "#0CA678", "#6D4BE6", "#E0820E", "#F23F66"][i % 5],
  })).filter((s) => s.value > 0);

  // tiempo promedio de producción (simulado por la longitud de hist hasta estado 7)
  const tiemposByEstado = STATES.slice(0, 7).map((s) => {
    const tiempos: number[] = [];
    orders.forEach((o) => {
      const h = o.hist.find((x) => x.n === s.n + 1);
      const prev = o.hist.find((x) => x.n === s.n);
      if (h && prev) {
        tiempos.push(Math.max(2, Math.min(72, (s.n + 2) * 3 + (o.estadoN % 5))));
      }
    });
    const avg = tiempos.length
      ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
      : 0;
    return {
      label: s.label.length > 11 ? s.label.slice(0, 9) + "…" : s.label,
      value: avg,
      sub: "horas",
    };
  });

  const pad = mode === "desktop" ? 28 : 16;

  return (
    <div className="ls-scroll" style={{ paddingBottom: 32 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px` }}>
        {mode === "mobile" && (
          <h1 className="ls-h1" style={{ marginBottom: 10 }}>Reportes</h1>
        )}
        <SectionHead
          title="Resumen operativo"
          sub="Últimos 30 días · datos demo, en producción conectaríamos pedidos reales."
          icon="spark"
        />
      </div>

      <div style={{ padding: `0 ${pad}px` }}>
        <div
          className="kpis"
          style={{
            gridTemplateColumns: mode === "desktop" ? "repeat(4,1fr)" : "1fr 1fr",
          }}
        >
          <div className="kpi">
            <div className="lab">Total pedidos</div>
            <div className="val">{total}</div>
            <div className="sub" style={{ color: "var(--muted)" }}>
              {entregados} entregados · {despachados} en camino
            </div>
          </div>
          <div className="kpi">
            <div className="lab">Ingresos del mes</div>
            <div className="val">{COP(revenue)}</div>
            <div className="sub" style={{ color: "var(--ok)" }}>
              {Math.round((revenue / Math.max(1, total)) / 1000)}k promedio por pedido
            </div>
          </div>
          <div className="kpi">
            <div className="lab">En proceso</div>
            <div className="val" style={{ color: "var(--brand)" }}>{enProceso}</div>
            <div className="sub" style={{ color: "var(--muted)" }}>
              activos en el Kanban
            </div>
          </div>
          <div className="kpi">
            <div className="lab">Con excepción</div>
            <div
              className="val"
              style={{ color: conExcepcion ? "var(--warn)" : "var(--ink)" }}
            >
              {conExcepcion}
            </div>
            <div className="sub" style={{ color: "var(--muted)" }}>
              backorder o reproceso
            </div>
          </div>
        </div>
      </div>

      {/* charts */}
      <div
        style={{
          padding: `22px ${pad}px 0`,
          display: "grid",
          gap: 16,
          gridTemplateColumns: mode === "desktop" ? "1.4fr 1fr" : "1fr",
        }}
      >
        <div className="ls-card" style={{ padding: 18 }}>
          <SectionHead
            title="Pedidos por estado"
            sub="Distribución actual en el flujo de producción."
          />
          <div style={{ height: 16 }} />
          <BarChart data={porEstado} />
        </div>
        <div className="ls-card" style={{ padding: 18 }}>
          <SectionHead title="Pedidos por óptica" />
          <div style={{ height: 16 }} />
          {opticaSegs.length > 0 ? (
            <DonutChart segments={opticaSegs} />
          ) : (
            <div style={{ color: "var(--faint)" }}>Sin datos.</div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: `16px ${pad}px 0`,
          display: "grid",
          gap: 16,
          gridTemplateColumns: mode === "desktop" ? "1fr 1fr" : "1fr",
        }}
      >
        <div className="ls-card" style={{ padding: 18 }}>
          <SectionHead
            title="% reprocesos por óptica"
            sub="Oro puro — identifica fricciones recurrentes."
          />
          <div style={{ height: 16 }} />
          <BarChart data={reprocesoStats} color="var(--danger)" />
        </div>
        <div className="ls-card" style={{ padding: 18 }}>
          <SectionHead
            title="Tiempo promedio por etapa"
            sub="Horas entre paso y paso (estimado)."
          />
          <div style={{ height: 16 }} />
          <BarChart data={tiemposByEstado} color="var(--ok)" />
        </div>
      </div>

      <div style={{ padding: `16px ${pad}px 0` }}>
        <div className="ls-card" style={{ padding: 18 }}>
          <SectionHead
            title="Detalle por óptica"
            sub="Cartera, pedidos activos y reprocesos."
            icon="user"
          />
          <div style={{ height: 16 }} />
          <table className="dtable">
            <thead>
              <tr>
                <th>Óptica</th>
                <th style={{ textAlign: "right" }}>Pedidos</th>
                <th style={{ textAlign: "right" }}>Ingresos</th>
                <th style={{ textAlign: "right" }}>Reprocesos</th>
              </tr>
            </thead>
            <tbody>
              {OPTICAS.map((op) => {
                const ord = orders.filter((o) => o.optica === op.id);
                const rev = ord.reduce((s, o) => s + o.precio, 0);
                const rep = garantias.filter((g) => g.optica === op.id).length;
                return (
                  <tr key={op.id}>
                    <td>
                      <div className="ls-row" style={{ gap: 10 }}>
                        <span
                          className="ls-avatar"
                          style={{ width: 30, height: 30 }}
                        >
                          {op.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                        <div className="ls-col" style={{ gap: 0 }}>
                          <span style={{ fontWeight: 700, color: "var(--ink)" }}>
                            {op.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11, color: "var(--muted)", fontWeight: 500,
                            }}
                          >
                            {opticaById(op.id).city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="num">{ord.length}</td>
                    <td className="num">{COP(rev)}</td>
                    <td className="num" style={{ color: rep > 0 ? "var(--warn)" : "var(--faint)" }}>
                      {rep > 0 ? rep : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
