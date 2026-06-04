"use client";

import { useState } from "react";
import { Brand, BrandMark } from "../ui/Brand";
import { Icon, type IconName } from "../ui/Icon";
import { SectionHead } from "../ui/SectionHead";
import { COP } from "@/lib/data";
import {
  FEATURES, PLANS, TENANTS, featureOn,
  type FeatureKey, type PlanKey, type Tenant,
} from "@/lib/plans";

type Mode = "mobile" | "desktop";
type View = "tenants" | "planes" | "feature-flags";

const NAV: Array<{ key: View; label: string; icon: IconName }> = [
  { key: "tenants",       label: "Tenants (labs)",   icon: "list" },
  { key: "planes",        label: "Planes",           icon: "tag" },
  { key: "feature-flags", label: "Feature flags",    icon: "settings" },
];

const PLAN_COLORS: Record<PlanKey, string> = {
  free: "var(--bg-sunken)",
  pro: "var(--brand-50)",
  business: "color-mix(in srgb, #6D4BE6 14%, #fff)",
};

const PLAN_TEXT: Record<PlanKey, string> = {
  free: "var(--muted)",
  pro: "var(--brand-700)",
  business: "#4a35a3",
};

function PlanBadge({ plan }: { plan: PlanKey }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 9px",
        borderRadius: 999,
        background: PLAN_COLORS[plan],
        color: PLAN_TEXT[plan],
        fontSize: 11, fontWeight: 800,
        letterSpacing: ".04em", textTransform: "uppercase",
      }}
    >
      {PLANS[plan].label}
    </span>
  );
}

function quotaText(q: { opticas: number; ordersPerMonth: number }) {
  const op = q.opticas === -1 ? "ilimitadas" : `${q.opticas} ópticas`;
  const ord =
    q.ordersPerMonth === -1
      ? "pedidos ilimitados"
      : `${q.ordersPerMonth} pedidos/mes`;
  return `${op} · ${ord}`;
}

function FeatureRow({
  feature, enabledByPlan, overridden, onToggle,
}: {
  feature: typeof FEATURES[number];
  enabledByPlan: boolean;
  overridden: boolean | undefined;
  onToggle: (v: boolean) => void;
}) {
  const effective = overridden ?? enabledByPlan;
  return (
    <div
      className="ls-row"
      style={{
        gap: 12,
        padding: "12px 14px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="ls-col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
        <div className="ls-row" style={{ gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>
            {feature.label}
          </span>
          {overridden !== undefined && (
            <span
              style={{
                fontSize: 10, fontWeight: 800,
                letterSpacing: ".06em", textTransform: "uppercase",
                color: "var(--warn)",
                background: "var(--warn-bg)",
                padding: "2px 7px", borderRadius: 5,
              }}
            >
              Override
            </span>
          )}
        </div>
        <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
          {feature.desc}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onToggle(!effective)}
        style={{
          width: 46, height: 26, borderRadius: 999,
          background: effective ? "var(--brand)" : "var(--line)",
          border: "none", cursor: "pointer",
          position: "relative",
          transition: "background .15s",
        }}
        aria-label={effective ? "Activado" : "Desactivado"}
      >
        <span
          style={{
            position: "absolute",
            top: 3, left: effective ? 22 : 3,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 2px 4px rgba(8,22,51,.18)",
            transition: "left .18s",
          }}
        />
      </button>
    </div>
  );
}

function TenantDrawer({
  t, onClose, onUpdate,
}: {
  t: Tenant;
  onClose: () => void;
  onUpdate: (next: Tenant) => void;
}) {
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-head">
          <button className="iconbtn" onClick={onClose} type="button">
            <Icon name="chevron" size={18} />
          </button>
          <div className="ls-grow">
            <div className="ls-row" style={{ gap: 8 }}>
              <BrandMark size={20} color={t.brand} />
              <span className="ls-h2">{t.name}</span>
              <span className="ls-grow" />
              <PlanBadge plan={t.plan} />
            </div>
            <div className="ls-sub" style={{ marginTop: 2 }}>
              {t.city} · {t.ordersThisMonth} pedidos este mes · {t.opticasCount} ópticas
            </div>
          </div>
        </div>
        <div className="drawer-body ls-col" style={{ gap: 18 }}>
          <div className="ls-card" style={{ padding: 14 }}>
            <SectionHead title="Plan suscrito" icon="tag" />
            <div className="ls-segment" style={{ marginTop: 12 }}>
              {(["free", "pro", "business"] as PlanKey[]).map((k) => (
                <button
                  key={k}
                  className={t.plan === k ? "on" : ""}
                  onClick={() => onUpdate({ ...t, plan: k })}
                  type="button"
                >
                  {PLANS[k].label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="ls-sub">{PLANS[t.plan].description}</div>
              <div
                className="ls-row"
                style={{
                  marginTop: 10, gap: 12,
                  padding: 12, borderRadius: 10,
                  background: "var(--bg-sunken)",
                }}
              >
                <div className="ls-col" style={{ gap: 2 }}>
                  <span className="ls-eyebrow">Cuotas del plan</span>
                  <span style={{ fontSize: 13, color: "var(--ink)", fontWeight: 700 }}>
                    {quotaText(PLANS[t.plan].quota)}
                  </span>
                </div>
                <span className="ls-grow" />
                <div className="ls-col" style={{ alignItems: "flex-end", gap: 2 }}>
                  <span className="ls-eyebrow">Mensualidad</span>
                  <span
                    className="ls-mono"
                    style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}
                  >
                    {PLANS[t.plan].price === 0 ? "Gratis" : COP(PLANS[t.plan].price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 14 }}>
              <SectionHead
                title="Features activas para este tenant"
                sub="Override puntual sobre el plan. Cuidado: cambios aquí afectan al tenant en producción."
                icon="settings"
              />
            </div>
            {FEATURES.map((f) => {
              const base = PLANS[t.plan].features[f.key];
              const override = t.featureOverrides[f.key];
              return (
                <FeatureRow
                  key={f.key}
                  feature={f}
                  enabledByPlan={base}
                  overridden={override}
                  onToggle={(v) => {
                    const next = { ...t.featureOverrides };
                    if (v === base) delete next[f.key];
                    else next[f.key] = v;
                    onUpdate({ ...t, featureOverrides: next });
                  }}
                />
              );
            })}
          </div>

          <div className="ls-card" style={{ padding: 14 }}>
            <SectionHead title="White-label" icon="spark" />
            <div className="ls-row" style={{ gap: 14, marginTop: 12 }}>
              <BrandMark size={42} color={t.brand} />
              <div className="ls-col" style={{ gap: 2 }}>
                <span className="ls-eyebrow">Color de marca</span>
                <span
                  className="ls-mono"
                  style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}
                >
                  {t.brand.toUpperCase()}
                </span>
              </div>
              <span className="ls-grow" />
              <div className="ls-row" style={{ gap: 6 }}>
                {["#1166FF", "#0CA678", "#6D4BE6", "#E0820E", "#F23F66"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onUpdate({ ...t, brand: c })}
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: c,
                      border:
                        c.toLowerCase() === t.brand.toLowerCase()
                          ? "2px solid var(--ink)"
                          : "2px solid var(--line)",
                      cursor: "pointer",
                    }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
            {!featureOn(t.plan, "white-label", t.featureOverrides) && (
              <div className="vbanner warn" style={{ marginTop: 12 }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>
                  <Icon name="alert" size={15} />
                </span>
                <span>
                  White-label está apagado para este tenant — verá la marca <b>Lensia</b>{" "}
                  en sus pantallas hasta que actives la feature.
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="drawer-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Cerrar
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            type="button"
            onClick={() => onUpdate({ ...t, active: !t.active })}
            style={t.active ? { background: "var(--danger)" } : undefined}
          >
            <Icon name={t.active ? "x" : "check"} size={16} />
            {t.active ? "Desactivar tenant" : "Activar tenant"}
          </button>
        </div>
      </div>
    </>
  );
}

export function Superadmin({ mode }: { mode: Mode }) {
  const [view, setView] = useState<View>("tenants");
  const [tenants, setTenants] = useState<Tenant[]>(TENANTS);
  const [sel, setSel] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState<PlanKey>("pro");

  const updateTenant = (next: Tenant) =>
    setTenants((list) => list.map((t) => (t.id === next.id ? next : t)));

  const selectedTenant = tenants.find((t) => t.id === sel);

  const pad = mode === "desktop" ? 28 : 16;

  const tenantsView = (
    <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 28px` }}>
      <SectionHead
        title="Laboratorios suscritos"
        sub="Cada lab es un tenant aislado. Su plan determina qué features tiene activas."
        icon="user"
      />
      <div style={{ height: 14 }} />
      <div
        className="kpis"
        style={{
          gridTemplateColumns: mode === "desktop" ? "repeat(4,1fr)" : "1fr 1fr",
          marginBottom: 18,
        }}
      >
        <div className="kpi">
          <div className="lab">Tenants activos</div>
          <div className="val">{tenants.filter((t) => t.active).length}</div>
        </div>
        <div className="kpi">
          <div className="lab">Plan Business</div>
          <div className="val">{tenants.filter((t) => t.plan === "business").length}</div>
        </div>
        <div className="kpi">
          <div className="lab">Plan Pro</div>
          <div className="val">{tenants.filter((t) => t.plan === "pro").length}</div>
        </div>
        <div className="kpi">
          <div className="lab">Plan Free</div>
          <div className="val">{tenants.filter((t) => t.plan === "free").length}</div>
        </div>
      </div>
      <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="dtable-scroll">
          <table className="dtable" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Plan</th>
                <th>Cuota usada</th>
                <th>Ópticas</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => {
                const plan = PLANS[t.plan];
                const usagePct =
                  plan.quota.ordersPerMonth === -1
                    ? 0
                    : Math.round((t.ordersThisMonth / plan.quota.ordersPerMonth) * 100);
                return (
                  <tr key={t.id}>
                    <td>
                      <div className="ls-row" style={{ gap: 10 }}>
                        <BrandMark size={28} color={t.brand} />
                        <div className="ls-col" style={{ gap: 0 }}>
                          <span
                            style={{ fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}
                          >
                            {t.name}
                          </span>
                          <span
                            style={{
                              fontSize: 11.5, color: "var(--muted)",
                              fontWeight: 500, whiteSpace: "nowrap",
                            }}
                          >
                            {t.city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td><PlanBadge plan={t.plan} /></td>
                    <td>
                      <div className="ls-col" style={{ gap: 4, minWidth: 130 }}>
                        <div
                          style={{
                            height: 7, borderRadius: 999,
                            background: "var(--bg-sunken)",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: plan.quota.ordersPerMonth === -1 ? "8%" : Math.min(100, usagePct) + "%",
                              background: usagePct > 90 ? "var(--danger)" : "var(--brand)",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11, color: "var(--muted)",
                            fontWeight: 600,
                          }}
                        >
                          {t.ordersThisMonth} /{" "}
                          {plan.quota.ordersPerMonth === -1 ? "∞" : plan.quota.ordersPerMonth} pedidos
                        </span>
                      </div>
                    </td>
                    <td className="num">{t.opticasCount}</td>
                    <td>
                      <span
                        className={"ls-badge " + (t.active ? "is-done" : "is-alert")}
                        style={{ height: 22 }}
                      >
                        {t.active ? "Activo" : "Suspendido"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="ls-btn ls-btn-ghost ls-btn-sm"
                        onClick={() => setSel(t.id)}
                        type="button"
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedTenant && (
        <TenantDrawer
          t={selectedTenant}
          onClose={() => setSel(null)}
          onUpdate={updateTenant}
        />
      )}
    </div>
  );

  const planesView = (
    <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 28px` }}>
      <SectionHead
        title="Catálogo de planes"
        sub="Cambia lo que incluye cada plan. La toggle activa/desactiva la feature para todos los tenants en ese plan que no la tengan override."
        icon="tag"
      />
      <div style={{ height: 14 }} />
      <div
        className="ls-segment"
        style={{ maxWidth: 320, marginBottom: 18 }}
      >
        {(["free", "pro", "business"] as PlanKey[]).map((k) => (
          <button
            key={k}
            className={editPlan === k ? "on" : ""}
            onClick={() => setEditPlan(k)}
            type="button"
          >
            {PLANS[k].label}
          </button>
        ))}
      </div>
      <div
        className="ls-card"
        style={{ padding: 18, marginBottom: 16 }}
      >
        <div className="ls-row">
          <div className="ls-col">
            <span className="ls-eyebrow">Plan</span>
            <span
              className="ls-h2"
              style={{ marginTop: 2, color: PLAN_TEXT[editPlan] }}
            >
              {PLANS[editPlan].label}
            </span>
            <span
              className="ls-sub"
              style={{ marginTop: 4, maxWidth: 520 }}
            >
              {PLANS[editPlan].description}
            </span>
          </div>
          <span className="ls-grow" />
          <div className="ls-col" style={{ alignItems: "flex-end" }}>
            <span className="ls-eyebrow">Mensualidad</span>
            <span
              className="ls-mono"
              style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)" }}
            >
              {PLANS[editPlan].price === 0 ? "Gratis" : COP(PLANS[editPlan].price)}
            </span>
            <span className="ls-sub">{quotaText(PLANS[editPlan].quota)}</span>
          </div>
        </div>
      </div>
      {(["Operación", "Comercial", "Crecimiento"] as const).map((cat) => {
        const feats = FEATURES.filter((f) => f.category === cat);
        return (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 11, fontWeight: 800,
                letterSpacing: ".08em", textTransform: "uppercase",
                color: "var(--faint)", padding: "10px 4px 6px",
              }}
            >
              {cat}
            </div>
            <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
              {feats.map((f) => (
                <div
                  key={f.key}
                  className="ls-row"
                  style={{
                    gap: 12,
                    padding: "12px 14px",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <div className="ls-col" style={{ gap: 2, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>
                      {f.label}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                      {f.desc}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      // mutating PLANS in-memory for demo
                      PLANS[editPlan].features[f.key] = !PLANS[editPlan].features[f.key];
                      // force re-render
                      setEditPlan(editPlan);
                      setTenants((list) => [...list]);
                    }}
                    style={{
                      width: 46, height: 26, borderRadius: 999,
                      background: PLANS[editPlan].features[f.key] ? "var(--brand)" : "var(--line)",
                      border: "none", cursor: "pointer",
                      position: "relative",
                      transition: "background .15s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 3, left: PLANS[editPlan].features[f.key] ? 22 : 3,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 2px 4px rgba(8,22,51,.18)",
                        transition: "left .18s",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="vbanner info">
        <span style={{ flexShrink: 0, marginTop: 1 }}>
          <Icon name="shield" size={15} />
        </span>
        <span>
          Las toggles aquí <b>sí mueven la realidad</b>: este `featureOn(plan, key)` es el
          único gate en todo el código. Sin condicionales <code>plan === &quot;pro&quot;</code> regados.
        </span>
      </div>
    </div>
  );

  const featureFlagsView = (
    <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 28px` }}>
      <SectionHead
        title="Feature flags por tenant"
        sub="Override puntual: activa o apaga una feature para un tenant específico sin tocar su plan."
        icon="settings"
      />
      <div style={{ height: 14 }} />
      <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="dtable-scroll">
          <table className="dtable" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th>Tenant</th>
                {FEATURES.map((f) => (
                  <th key={f.key} style={{ textAlign: "center", minWidth: 90 }}>
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td style={{ position: "sticky", left: 0, background: "var(--card)" }}>
                    <div className="ls-row" style={{ gap: 8 }}>
                      <BrandMark size={20} color={t.brand} />
                      <div className="ls-col">
                        <span style={{ fontWeight: 700, color: "var(--ink)" }}>{t.name}</span>
                        <PlanBadge plan={t.plan} />
                      </div>
                    </div>
                  </td>
                  {FEATURES.map((f) => {
                    const enabled = featureOn(t.plan, f.key, t.featureOverrides);
                    const overridden = t.featureOverrides[f.key] !== undefined;
                    return (
                      <td key={f.key} style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          onClick={() => {
                            const next = { ...t.featureOverrides };
                            const baseValue = PLANS[t.plan].features[f.key];
                            const newValue = !enabled;
                            if (newValue === baseValue) delete next[f.key];
                            else next[f.key] = newValue;
                            updateTenant({ ...t, featureOverrides: next });
                          }}
                          style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: enabled ? "var(--brand-50)" : "var(--bg-sunken)",
                            color: enabled ? "var(--brand)" : "var(--faint)",
                            border: overridden
                              ? "1.5px dashed var(--warn)"
                              : "1px solid var(--line)",
                            cursor: "pointer",
                          }}
                          title={
                            overridden
                              ? "Override manual sobre el plan"
                              : enabled
                                ? "Incluido en el plan"
                                : "No incluido"
                          }
                        >
                          <Icon name={enabled ? "check" : "x"} size={14} sw={2.4} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const content =
    view === "tenants" ? tenantsView
      : view === "planes" ? planesView
        : featureFlagsView;

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
            background: "var(--ink)",
            color: "#fff", borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="ls-row" style={{ gap: 8 }}>
            <BrandMark size={20} color="#1166FF" />
            <div className="ls-col" style={{ gap: 0 }}>
              <span
                style={{
                  fontSize: 14, fontWeight: 800,
                  color: "#fff", letterSpacing: "-.02em",
                }}
              >
                Lensia · Superadmin
              </span>
              <span style={{ fontSize: 10.5, color: "#9aa8c2", fontWeight: 600 }}>
                Sobre todos los labs
              </span>
            </div>
          </div>
        </header>
        <div className="seg-nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={view === n.key ? "on" : ""}
              onClick={() => setView(n.key)}
              type="button"
            >
              <Icon name={n.icon} size={15} style={{ marginRight: 6, verticalAlign: "-2px" }} />
              {n.label}
            </button>
          ))}
        </div>
        <div
          className="ls-grow"
          style={{ overflow: "auto", position: "relative", minHeight: 0 }}
        >
          {content}
        </div>
      </div>
    );
  }

  // ---------- DESKTOP ----------
  return (
    <div
      className="ls-app ls-row"
      style={{ height: "100%", alignItems: "stretch", position: "relative" }}
    >
      <aside
        className="ls-side"
        style={{ background: "var(--ink)", color: "#fff", borderRight: "1px solid #213b66" }}
      >
        <div style={{ padding: "20px 18px 16px" }}>
          <div className="ls-row" style={{ gap: 9 }}>
            <BrandMark size={28} color="#fff" />
            <div className="ls-col">
              <span
                style={{
                  fontSize: 17, fontWeight: 800,
                  letterSpacing: "-.03em", color: "#fff",
                }}
              >
                Superadmin
              </span>
              <span style={{ fontSize: 11, color: "#9aa8c2", fontWeight: 600 }}>
                Sobre todos los labs
              </span>
            </div>
          </div>
        </div>
        <div
          className="ls-divider"
          style={{ margin: "0 14px", background: "#213b66" }}
        />
        <div className="ls-side-nav">
          {NAV.map((n) => {
            const active = view === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                type="button"
                style={{
                  background: active ? "rgba(255,255,255,.08)" : "transparent",
                  color: active ? "#fff" : "#9aa8c2",
                  fontWeight: active ? 800 : 600,
                }}
              >
                <Icon name={n.icon} size={20} />
                {n.label}
              </button>
            );
          })}
        </div>
        <span className="ls-grow" />
        <div
          style={{
            padding: "0 16px 14px",
            fontSize: 10.5,
            color: "#697aa3",
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "-.01em",
          }}
        >
          Hecho con <span style={{ color: "#fb7185" }}>❤</span> por{" "}
          <b style={{ color: "#cad4e4", fontWeight: 800 }}>Cuantium-Wibi ™</b>
        </div>
      </aside>
      <div
        className="ls-grow ls-col"
        style={{ minWidth: 0, position: "relative" }}
      >
        <header
          className="ls-row"
          style={{
            height: 62, padding: "0 28px", gap: 12, flexShrink: 0,
            borderBottom: "1px solid var(--line)",
            background: "rgba(255,255,255,.85)", backdropFilter: "blur(8px)",
            zIndex: 20,
          }}
        >
          <span className="ls-h2">
            {NAV.find((n) => n.key === view)?.label}
          </span>
          <span className="ls-grow" />
          <span
            className="ls-mono"
            style={{ fontSize: 11.5, color: "var(--faint)", fontWeight: 600 }}
          >
            URB Digital Thinking · responsable Lensia
          </span>
        </header>
        <div
          className="ls-grow"
          style={{ overflow: "auto", position: "relative", background: "var(--bg)" }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
