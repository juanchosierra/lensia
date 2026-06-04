"use client";

import { Fragment, useState, type DragEvent } from "react";
import { Brand } from "./ui/Brand";
import { Icon, type IconName } from "./ui/Icon";
import { AdvanceModal, type AdvanceExtra } from "./back/AdvanceModal";
import { Drawer } from "./back/Drawer";
import { KbCard } from "./back/KbCard";
import { CatalogoView } from "./back/CatalogoView";
import { CarteraView } from "./back/CarteraView";
import { STATES, type Order } from "@/lib/data";
import { COLUMNS, LAB, OPTICAS, ORDERS_LAB, opticaById } from "@/lib/back-data";

type Mode = "mobile" | "desktop";
type BView = "bandeja" | "catalogo" | "cartera";

type NavItem = {
  key: BView;
  label: string;
  icon: IconName;
  grp: "Operación" | "Comercial";
};

const NAV: NavItem[] = [
  { key: "bandeja",  label: "Bandeja",            icon: "list", grp: "Operación" },
  { key: "catalogo", label: "Catálogo y precios", icon: "tag",  grp: "Comercial" },
  { key: "cartera",  label: "Cartera",            icon: "doc",  grp: "Comercial" },
];

let toastTimer: ReturnType<typeof setTimeout> | null = null;

type Props = { mode: Mode; brandName?: string };

export function LensiaBack({ mode, brandName }: Props) {
  const [orders, setOrders] = useState<Order[]>(() =>
    ORDERS_LAB.map((o) => ({ ...o })),
  );
  const [q, setQ] = useState("");
  const [optFilter, setOptFilter] = useState("todas");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sel, setSel] = useState<Order | null>(null);
  const [adv, setAdv] = useState<{ order: Order; toN: number } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [bview, setBview] = useState<BView>("bandeja");

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 2600);
  };

  const match = (o: Order) => {
    if (q) {
      const s = (o.paciente + " " + o.id + " " + opticaById(o.optica).name).toLowerCase();
      if (!s.includes(q.toLowerCase())) return false;
    }
    if (optFilter !== "todas" && o.optica !== optFilter) return false;
    if (urgentOnly && o.prioridad !== "Urgente") return false;
    return true;
  };
  const visible = orders.filter(match);

  const applyAdvance = (
    order: Order, toN: number, info: string, extra: AdvanceExtra,
  ) => {
    setOrders((list) =>
      list.map((o) => {
        if (o.id !== order.id) return o;
        const hist = o.hist.filter((h) => h.n < toN);
        for (let n = o.estadoN + 1; n < toN; n++) {
          if (!hist.find((h) => h.n === n)) hist.push({ n, ts: "Ahora" });
        }
        hist.push({
          n: toN,
          ts: "Ahora",
          info: info || undefined,
          ship: extra.ship,
        });
        hist.sort((a, b) => a.n - b.n);
        return {
          ...o,
          estadoN: toN,
          exception: null,
          eta: extra.eta || o.eta,
          hist,
        };
      }),
    );
    setAdv(null);
    setSel((s) => (s && s.id === order.id ? { ...s, estadoN: toN } : s));
    showToast(`#${order.id} → ${STATES[toN - 1].label}`);
  };

  const askAdvance = (order: Order, toN: number) => {
    if (toN === order.estadoN) return;
    setAdv({ order, toN });
  };

  const markException = (order: Order) => {
    const ex = {
      type: "backorder",
      label: "En espera de material",
      detail: "Pendiente insumo. Se reanuda al reabastecer.",
    };
    setOrders((list) =>
      list.map((o) => (o.id === order.id ? { ...o, exception: ex } : o)),
    );
    setSel((s) => (s && s.id === order.id ? { ...s, exception: ex } : s));
    showToast(`#${order.id} marcado en espera de material`);
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, o: Order) => {
    setDragId(o.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (col: typeof COLUMNS[number]) => {
    const o = orders.find((x) => x.id === dragId);
    setDragId(null);
    setOverCol(null);
    if (o && o.estadoN !== col.n) askAdvance(o, col.n);
  };

  const advOrder = adv
    ? orders.find((o) => o.id === adv.order.id) || adv.order
    : null;
  const selOrder = sel
    ? orders.find((o) => o.id === sel.id) || sel
    : null;

  const toolbar = (
    <div
      className="kb-toolbar"
      style={mode === "mobile" ? { padding: "12px 16px", flexWrap: "wrap" } : undefined}
    >
      {mode === "desktop" && (
        <span className="ls-h2" style={{ whiteSpace: "nowrap" }}>
          Bandeja de pedidos
        </span>
      )}
      {mode === "desktop" && (
        <div
          className="ls-divider"
          style={{ width: 1, height: 26, background: "var(--line)" }}
        />
      )}
      <div
        className="ls-search ls-grow"
        style={{ maxWidth: mode === "desktop" ? 320 : "none" }}
      >
        <Icon name="search" size={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar paciente, óptica o #…"
        />
      </div>
      <select
        className="ls-select"
        style={{ width: mode === "desktop" ? 190 : "100%", height: 44 }}
        value={optFilter}
        onChange={(e) => setOptFilter(e.target.value)}
      >
        <option value="todas">Todas las ópticas</option>
        {OPTICAS.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      <button
        className={"ls-filter" + (urgentOnly ? " on" : "")}
        style={{ height: 44 }}
        onClick={() => setUrgentOnly((v) => !v)}
        type="button"
      >
        <Icon name="spark" size={14} />Urgentes
      </button>
      <span className="ls-grow" />
      {mode === "desktop" && (
        <span className="ls-sub" style={{ fontWeight: 600 }}>
          {visible.length} pedidos activos
        </span>
      )}
    </div>
  );

  const board = (
    <div
      className="kb-wrap"
      style={
        mode === "mobile"
          ? {
              flexDirection: "column",
              padding: "14px 14px 28px",
              overflowX: "visible",
              height: "auto",
            }
          : undefined
      }
    >
      {COLUMNS.map((col) => {
        const cards = visible.filter((o) => o.estadoN === col.n);
        return (
          <div
            key={col.n}
            className={"kb-col" + (overCol === col.n ? " drag-over" : "")}
            style={mode === "mobile" ? { width: "100%" } : undefined}
            onDragOver={(e) => {
              if (mode === "desktop") {
                e.preventDefault();
                setOverCol(col.n);
              }
            }}
            onDragLeave={() => setOverCol((c) => (c === col.n ? null : c))}
            onDrop={() => onDrop(col)}
          >
            <div className="kb-col-head">
              <span className={"accent" + (col.accent === "ok" ? " ok" : "")} />
              <span className="nm">{col.label}</span>
              <span className="ls-grow" />
              <span className="ct">{cards.length}</span>
            </div>
            <div
              className="kb-list"
              style={mode === "mobile" ? { maxHeight: "none" } : undefined}
            >
              {cards.map((o) => (
                <KbCard
                  key={o.id}
                  o={o}
                  mode={mode}
                  onOpen={setSel}
                  onDragStart={onDragStart}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverCol(null);
                  }}
                  dragging={dragId === o.id}
                />
              ))}
              {cards.length === 0 && (
                <div className="kb-empty">
                  {mode === "desktop" ? "Arrastra aquí" : "Sin pedidos"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const bandeja = (
    <>
      {toolbar}
      <div
        className="ls-grow"
        style={{
          overflow: mode === "mobile" ? "auto" : "hidden",
          position: "relative",
        }}
      >
        {board}
        {selOrder && (
          <Drawer
            order={selOrder}
            mode={mode}
            onClose={() => setSel(null)}
            onAdvance={askAdvance}
            onException={markException}
          />
        )}
        {advOrder && adv && (
          <AdvanceModal
            order={advOrder}
            toN={adv.toN}
            onClose={() => setAdv(null)}
            onConfirm={applyAdvance}
          />
        )}
      </div>
    </>
  );

  const content =
    bview === "catalogo"
      ? <CatalogoView mode={mode} onToast={showToast} />
      : bview === "cartera"
        ? <CarteraView mode={mode} onToast={showToast} />
        : bandeja;

  // ---------- MOBILE ----------
  if (mode === "mobile") {
    return (
      <div
        className="ls-app ls-col"
        style={{ height: "100%", position: "relative", paddingTop: 50 }}
      >
        <header
          className="ls-row"
          style={{
            padding: "12px 16px", gap: 8, flexShrink: 0,
            background: "var(--card)", borderBottom: "1px solid var(--line)",
          }}
        >
          <Brand size={24} name={brandName} />
          <span className="ls-grow" />
          <span className="ls-sub" style={{ fontWeight: 700 }}>{LAB.name}</span>
        </header>
        <div className="seg-nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={bview === n.key ? "on" : ""}
              onClick={() => setBview(n.key)}
              type="button"
            >
              <Icon name={n.icon} size={15} style={{ marginRight: 6, verticalAlign: "-2px" }} />
              {n.label}
            </button>
          ))}
        </div>
        <div
          className="ls-grow ls-col"
          style={{ overflow: "hidden", position: "relative", minHeight: 0 }}
        >
          {content}
        </div>
        <div
          style={{
            flexShrink: 0,
            padding: "8px 16px calc(8px + env(safe-area-inset-bottom, 0px))",
            fontSize: 10,
            color: "var(--faint)",
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "-.01em",
            background: "rgba(255,255,255,.92)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid var(--line)",
          }}
        >
          Hecho con <span style={{ color: "#e11d48" }}>❤</span> por{" "}
          <b style={{ color: "var(--muted)", fontWeight: 800 }}>Cuantium-Wibi ™</b>
        </div>
        {toast && (
          <div className="ls-toast">
            <Icon name="check" size={18} sw={2.4} style={{ color: "#7ef0a8" }} />
            {toast}
          </div>
        )}
      </div>
    );
  }

  // ---------- DESKTOP ----------
  const grouped: Array<"Operación" | "Comercial"> = ["Operación", "Comercial"];
  return (
    <div
      className="ls-app ls-row"
      style={{ height: "100%", alignItems: "stretch", position: "relative" }}
    >
      <aside className="ls-side">
        <div style={{ padding: "20px 18px 16px" }}>
          <Brand size={28} name={brandName} />
          <div
            style={{
              marginTop: 4, fontSize: 11, color: "var(--faint)",
              fontWeight: 600, paddingLeft: 38,
            }}
          >
            Panel del laboratorio
          </div>
        </div>
        <div className="ls-divider" style={{ margin: "0 14px" }} />
        <div className="ls-side-nav">
          {grouped.map((grp) => (
            <Fragment key={grp}>
              <span className="ls-eyebrow" style={{ padding: "12px 13px 4px" }}>{grp}</span>
              {NAV.filter((n) => n.grp === grp).map((n) => (
                <button
                  key={n.key}
                  className={bview === n.key ? "on" : ""}
                  onClick={() => setBview(n.key)}
                  type="button"
                >
                  <Icon name={n.icon} size={20} />{n.label}
                  {n.key === "bandeja" && (
                    <>
                      <span className="ls-grow" />
                      <span
                        className="ct"
                        style={{
                          fontSize: 11, fontWeight: 800,
                          color: "var(--muted)", background: "var(--bg-sunken)",
                          borderRadius: 999, padding: "1px 8px",
                        }}
                      >
                        {orders.filter((o) => o.estadoN < 8).length}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </Fragment>
          ))}
        </div>
        <span className="ls-grow" />
        <div className="ls-divider" style={{ margin: "0 14px" }} />
        <div className="ls-row" style={{ gap: 11, padding: "14px 16px 10px" }}>
          <div className="ls-avatar" style={{ width: 38, height: 38 }}>{LAB.initials}</div>
          <div className="ls-col" style={{ gap: 1, minWidth: 0 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>
              {LAB.name}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{LAB.user}</span>
          </div>
        </div>
        <div
          style={{
            padding: "0 16px 14px",
            fontSize: 10.5,
            color: "var(--faint)",
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "-.01em",
          }}
        >
          Hecho con <span style={{ color: "#e11d48" }}>❤</span> por{" "}
          <b style={{ color: "var(--muted)", fontWeight: 800 }}>Cuantium-Wibi ™</b>
        </div>
      </aside>
      <div
        className="ls-grow ls-col"
        style={{ minWidth: 0, position: "relative" }}
      >
        {content}
        {toast && (
          <div className="ls-toast">
            <Icon name="check" size={18} sw={2.4} style={{ color: "#7ef0a8" }} />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
