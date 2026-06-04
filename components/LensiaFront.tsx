"use client";

import { useState } from "react";
import { Brand } from "./ui/Brand";
import { Icon } from "./ui/Icon";
import { Notifications } from "./Notifications";
import { MisOrdenes } from "./screens/MisOrdenes";
import { NuevaOrden, blankForm, type NuevaOrdenForm } from "./screens/NuevaOrden";
import { Tracking } from "./screens/Tracking";
import { ListaPrecios } from "./screens/ListaPrecios";
import { EstadoCuenta } from "./screens/EstadoCuenta";
import {
  GarantiaDetail, GarantiaList, NuevaGarantiaForm,
} from "./screens/Garantia";
import { ConsentBanner, PrivacyFooter } from "./Consent";
import { ORDERS, type Order } from "@/lib/data";
import {
  ACCOUNTS, acctSummary, type AccountStatus, type Combo,
} from "@/lib/commercial-data";
import {
  MOCK_GARANTIAS, type Garantia, type MotivoGarantia,
} from "@/lib/garantia";
import { BRANCHES, type Branch } from "@/lib/branches";
import { BranchSelector } from "./BranchSelector";
import { RoleSwitcher } from "./RoleSwitcher";
import { can, type ShopRole } from "@/lib/roles";

type Mode = "mobile" | "desktop";

type View = "orders" | "new" | "tracking" | "precios" | "cuenta" | "garantias" | "garantia-detail";

const SHOP = { name: "Óptica Claridad", user: "Sara Restrepo", initials: "SR" };

type Props = { mode: Mode; brandName?: string };

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function LensiaFront({ mode, brandName }: Props) {
  const [orders, setOrders] = useState<Order[]>(() => ORDERS.map((o) => ({ ...o })));
  const [view, setView] = useState<View>("orders");
  const [sel, setSel] = useState<Order | null>(null);
  const [seed, setSeed] = useState<Partial<NuevaOrdenForm> | null>(null);
  const [notiOpen, setNotiOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [acct, setAcct] = useState<AccountStatus>(
    () => acctSummary(ACCOUNTS.claridad).status,
  );
  const [garantias, setGarantias] = useState<Garantia[]>(() =>
    MOCK_GARANTIAS.filter((g) => g.optica === "claridad").map((g) => ({ ...g })),
  );
  const [selGarantia, setSelGarantia] = useState<Garantia | null>(null);
  const [garantiaFor, setGarantiaFor] = useState<Order | null>(null);
  const [branch, setBranch] = useState<Branch>(() => BRANCHES.claridad[0]);
  const [shopRole, setShopRole] = useState<ShopRole>("duena");

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 2600);
  };

  const openOrder = (o: Order) => {
    setSel(o);
    setView("tracking");
    setNotiOpen(false);
  };

  const goNew = (s: Partial<NuevaOrdenForm> | null = null) => {
    setSeed(s);
    setFormKey((k) => k + 1);
    setView("new");
  };

  const createOrder = (form: NuevaOrdenForm & { precio: number }) => {
    const id = String(Math.max(...orders.map((o) => +o.id)) + 1);
    const o: Order = {
      ...form,
      id, fecha: "Hoy", eta: "—", estadoN: 1,
      hist: [{ n: 1, ts: "Ahora · recién creada" }],
      exception: null,
    };
    setOrders((list) => [o, ...list]);
    showToast(`Orden #${id} creada · enviada al laboratorio`);
    setSel(o);
    setView("tracking");
  };

  const repeat = (o: Order) => {
    const seedFromOrder: Partial<NuevaOrdenForm> = {
      paciente: o.paciente,
      solicitadoPor: o.solicitadoPor,
      telefono: o.telefono,
      prioridad: o.prioridad,
      tipo: o.tipo,
      mat: o.mat,
      trats: [...o.trats],
      rx: { od: { ...o.rx.od }, oi: { ...o.rx.oi } },
      montura: { ...o.montura },
      obs: o.obs,
    };
    goNew(seedFromOrder);
    showToast("Pedido clonado — ajusta la fórmula y crea la orden");
  };

  const openGarantia = (g: Garantia) => {
    setSelGarantia(g);
    setView("garantia-detail");
  };

  const startGarantia = (o: Order) => setGarantiaFor(o);

  const submitGarantia = (input: {
    orderId: string; paciente: string;
    motivo: MotivoGarantia; descripcion: string; foto: boolean;
  }) => {
    const id = "G-" + (411 + garantias.length + 1);
    const g: Garantia = {
      id, orderId: input.orderId, paciente: input.paciente,
      optica: "claridad", motivo: input.motivo,
      descripcion: input.descripcion, foto: input.foto,
      fecha: "Hoy", estado: "solicitada", estadoN: 1,
      hist: [{ n: 1, ts: "Ahora · recién reportada" }],
    };
    setGarantias((list) => [g, ...list]);
    setGarantiaFor(null);
    setSelGarantia(g);
    setView("garantia-detail");
    showToast(`Garantía ${id} enviada — el lab te responde pronto`);
  };

  const screen = (() => {
    if (view === "new") {
      return (
        <NuevaOrden
          key={formKey}
          mode={mode}
          seed={seed}
          onCreate={createOrder}
          acctStatus={acct}
          onGoCuenta={() => setView("cuenta")}
          branchName={branch.name}
          branchAddress={`${branch.direccion}, ${branch.ciudad}`}
        />
      );
    }
    if (view === "tracking" && sel) {
      const cur = orders.find((o) => o.id === sel.id) || sel;
      return (
        <Tracking
          o={cur}
          mode={mode}
          onBack={() => setView("orders")}
          onRepeat={repeat}
          onGarantia={startGarantia}
        />
      );
    }
    if (view === "precios") {
      return (
        <ListaPrecios
          mode={mode}
          brandName={brandName}
          onPedir={(combo: Combo) => goNew({ tipo: combo.tipo, mat: combo.mat })}
        />
      );
    }
    if (view === "cuenta") {
      return (
        <EstadoCuenta
          mode={mode}
          status={acct}
          setStatus={setAcct}
          onToast={showToast}
        />
      );
    }
    if (view === "garantias") {
      return (
        <GarantiaList
          garantias={garantias}
          mode={mode}
          onOpen={openGarantia}
        />
      );
    }
    if (view === "garantia-detail" && selGarantia) {
      const cur = garantias.find((g) => g.id === selGarantia.id) || selGarantia;
      return (
        <GarantiaDetail
          g={cur}
          mode={mode}
          onBack={() => setView("garantias")}
        />
      );
    }
    return <MisOrdenes orders={orders} mode={mode} onOpen={openOrder} />;
  })();

  const bell = (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setNotiOpen((v) => !v)}
        type="button"
        style={{
          width: 40, height: 40, borderRadius: 11,
          display: "grid", placeItems: "center",
          background: notiOpen ? "var(--brand-50)" : "transparent",
          color: notiOpen ? "var(--brand)" : "var(--muted)",
          position: "relative",
        }}
      >
        <Icon name="bell" size={20} />
        <span
          style={{
            position: "absolute", top: 8, right: 9,
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--danger)", border: "2px solid var(--card)",
          }}
        />
      </button>
    </div>
  );

  // MOBILE
  if (mode === "mobile") {
    const fullScreen = view === "new" || view === "tracking" || view === "garantia-detail";
    return (
      <div
        className="ls-app ls-col"
        style={{ height: "100%", paddingTop: 50 }}
        onClick={() => notiOpen && setNotiOpen(false)}
      >
        {!fullScreen && (
          <header
            className="ls-col"
            style={{ padding: "14px 16px 8px", gap: 8, flexShrink: 0, background: "var(--bg)" }}
          >
            <div className="ls-row" style={{ gap: 8 }}>
              <Brand size={26} name={brandName} />
              <span className="ls-grow" />
              <div onClick={(e) => e.stopPropagation()}>{bell}</div>
              <div className="ls-avatar">{SHOP.initials}</div>
            </div>
            <div
              className="ls-row"
              style={{ gap: 8, flexWrap: "wrap" }}
              onClick={(e) => e.stopPropagation()}
            >
              <BranchSelector
                opticaId="claridad"
                selected={branch.id}
                onSelect={setBranch}
                compact
              />
              <span className="ls-grow" />
              <RoleSwitcher
                side="shop"
                role={shopRole}
                setRole={(r) => setShopRole(r as ShopRole)}
                compact
              />
            </div>
          </header>
        )}
        {view === "new" && (
          <header
            className="ls-row"
            style={{
              padding: "14px 16px", gap: 10, flexShrink: 0,
              background: "var(--card)", borderBottom: "1px solid var(--line)",
            }}
          >
            <button
              className="ls-btn ls-btn-ghost ls-btn-sm"
              style={{ width: 36, padding: 0 }}
              onClick={() => setView("orders")}
              type="button"
            >
              <Icon name="x" size={17} />
            </button>
            <span className="ls-h2">Nueva Orden</span>
          </header>
        )}

        <div className="ls-grow" style={{ overflow: "hidden", position: "relative" }}>
          {screen}
          {notiOpen && (
            <Notifications orders={orders} onOpen={openOrder} mode="mobile" />
          )}
          {garantiaFor && (
            <NuevaGarantiaForm
              orderId={garantiaFor.id}
              paciente={garantiaFor.paciente}
              onClose={() => setGarantiaFor(null)}
              onSubmit={submitGarantia}
            />
          )}
        </div>

        {!fullScreen && (
          <div
            style={{
              flexShrink: 0,
              padding: "8px 16px 6px",
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
        )}
        {!fullScreen && (
          <nav
            className="ls-botnav"
            style={{
              flexShrink: 0,
              borderTop: "none",
              padding: "8px 8px calc(22px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <button
              className={view === "orders" ? "on" : ""}
              onClick={() => setView("orders")}
              type="button"
              style={{ fontSize: 10 }}
            >
              <Icon name="list" size={20} />Órdenes
            </button>
            <button
              onClick={() => goNew()}
              type="button"
              style={{ fontSize: 10 }}
            >
              <Icon name="plus" size={20} />Nueva
            </button>
            <button
              className={view === "precios" ? "on" : ""}
              onClick={() => setView("precios")}
              type="button"
              style={{ fontSize: 10 }}
            >
              <Icon name="tag" size={20} />Precios
            </button>
            <button
              className={view === "cuenta" ? "on" : ""}
              onClick={() => setView("cuenta")}
              type="button"
              style={{ fontSize: 10 }}
            >
              <Icon name="doc" size={20} />Cuenta
            </button>
            <button
              className={view === "garantias" ? "on" : ""}
              onClick={() => setView("garantias")}
              type="button"
              style={{ fontSize: 10 }}
            >
              <Icon name="shield" size={20} />Garantías
            </button>
          </nav>
        )}

        {toast && (
          <div className="ls-toast">
            <Icon name="check" size={18} sw={2.4} style={{ color: "#7ef0a8" }} />
            {toast}
          </div>
        )}
      </div>
    );
  }

  // DESKTOP
  const activeNav = view === "tracking" ? "orders" : view;
  const titles: Record<View, string> = {
    orders: "Mis Órdenes",
    new: "Nueva Orden",
    tracking: "Seguimiento",
    precios: "Lista de Precios",
    cuenta: "Estado de Cuenta",
    garantias: "Garantías",
    "garantia-detail": "Garantía",
  };
  const title = titles[view] || "Lensia";
  const activeNavDesktop = (view === "garantia-detail" ? "garantias" : activeNav) as
    | "orders" | "new" | "precios" | "cuenta" | "garantias";

  return (
    <div
      className="ls-app ls-row"
      style={{ height: "100%", alignItems: "stretch" }}
      onClick={() => notiOpen && setNotiOpen(false)}
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
            Laboratorio Óptico
          </div>
        </div>
        <div className="ls-divider" style={{ margin: "0 14px" }} />
        <div className="ls-side-nav">
          <span className="ls-eyebrow" style={{ padding: "10px 13px 4px" }}>Pedidos</span>
          {(
            [
              { key: "orders", label: "Mis Órdenes", icon: "list" as const },
              { key: "new", label: "Nueva Orden", icon: "plus" as const },
            ]
          ).map((n) => (
            <button
              key={n.key}
              className={activeNav === n.key ? "on" : ""}
              onClick={() => (n.key === "new" ? goNew() : setView(n.key as View))}
              type="button"
            >
              <Icon name={n.icon} size={20} />{n.label}
            </button>
          ))}
          <span className="ls-eyebrow" style={{ padding: "14px 13px 4px" }}>Comercial</span>
          {(
            [
              { key: "precios", label: "Lista de Precios", icon: "tag" as const, perm: "shop.precios.view" as const },
              { key: "cuenta", label: "Estado de Cuenta", icon: "doc" as const, perm: "shop.cuenta.view" as const },
            ]
          ).filter((n) => can(shopRole, n.perm)).map((n) => (
            <button
              key={n.key}
              className={activeNavDesktop === n.key ? "on" : ""}
              onClick={() => setView(n.key as View)}
              type="button"
            >
              <Icon name={n.icon} size={20} />{n.label}
              {n.key === "cuenta" && acct !== "ok" && <span className="ls-grow" />}
              {n.key === "cuenta" && acct !== "ok" && (
                <span
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: acct === "blocked" ? "var(--danger)" : "var(--warn)",
                  }}
                />
              )}
            </button>
          ))}
          <span className="ls-eyebrow" style={{ padding: "14px 13px 4px" }}>Post-venta</span>
          <button
            className={activeNavDesktop === "garantias" ? "on" : ""}
            onClick={() => setView("garantias")}
            type="button"
          >
            <Icon name="shield" size={20} />Garantías
            {garantias.some((g) => g.estado !== "rechazada" && g.estado !== "lista") && (
              <>
                <span className="ls-grow" />
                <span
                  className="ct"
                  style={{
                    fontSize: 11, fontWeight: 800,
                    color: "var(--brand-700)", background: "var(--brand-50)",
                    borderRadius: 999, padding: "1px 8px",
                  }}
                >
                  {garantias.filter(
                    (g) => g.estado !== "rechazada" && g.estado !== "lista",
                  ).length}
                </span>
              </>
            )}
          </button>
        </div>
        <span className="ls-grow" />
        <div className="ls-divider" style={{ margin: "0 14px" }} />
        <div className="ls-row" style={{ gap: 11, padding: "14px 16px 10px" }}>
          <div className="ls-avatar" style={{ width: 38, height: 38 }}>{SHOP.initials}</div>
          <div className="ls-col" style={{ gap: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: 13.5, fontWeight: 700, color: "var(--ink)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {SHOP.name}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{SHOP.user}</span>
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

      <div className="ls-grow ls-col" style={{ minWidth: 0 }}>
        <header
          className="ls-row"
          style={{
            height: 62, padding: "0 28px", gap: 12, flexShrink: 0,
            borderBottom: "1px solid var(--line)",
            background: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)",
            zIndex: 20,
          }}
        >
          <span className="ls-h2">{title}</span>
          <span className="ls-grow" />
          <div onClick={(e) => e.stopPropagation()}>
            <BranchSelector
              opticaId="claridad"
              selected={branch.id}
              onSelect={setBranch}
              compact
            />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <RoleSwitcher
              side="shop"
              role={shopRole}
              setRole={(r) => setShopRole(r as ShopRole)}
              compact
            />
          </div>
          {view === "orders" && can(shopRole, "shop.orders.create") && (
            <button
              className="ls-btn ls-btn-primary ls-btn-sm"
              onClick={() => goNew()}
              type="button"
            >
              <Icon name="plus" size={17} sw={2.2} />Nueva orden
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative" }}>
            {bell}
            {notiOpen && (
              <Notifications orders={orders} onOpen={openOrder} mode="desktop" />
            )}
          </div>
        </header>
        <div
          className="ls-grow"
          style={{ overflow: "hidden", position: "relative", background: "var(--bg)" }}
        >
          {screen}
          {garantiaFor && (
            <NuevaGarantiaForm
              orderId={garantiaFor.id}
              paciente={garantiaFor.paciente}
              onClose={() => setGarantiaFor(null)}
              onSubmit={submitGarantia}
            />
          )}
          {toast && (
            <div className="ls-toast">
              <Icon name="check" size={18} sw={2.4} style={{ color: "#7ef0a8" }} />
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
