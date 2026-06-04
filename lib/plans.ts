// lib/plans.ts — feature entitlements per plan (Fase 2 · Superadmin)
//
// Architecture: ALL gates derive from PLANS[plan].features at runtime.
// No `if (plan === "pro")` scattered in components — they call featureOn(plan, key).

export type PlanKey = "free" | "pro" | "business";

export type FeatureKey =
  | "white-label"
  | "kanban-drag"
  | "tracking-realtime"
  | "wa-notifications"
  | "reprocesos"
  | "rbac"
  | "reportes"
  | "onboarding-bulk"
  | "multi-sucursal"
  | "api-publica";

export type FeatureMeta = {
  key: FeatureKey;
  label: string;
  desc: string;
  category: "Operación" | "Comercial" | "Crecimiento";
};

export const FEATURES: FeatureMeta[] = [
  { key: "white-label",        label: "White-label",            desc: "Marca, dominio y colores propios para el lab.",          category: "Comercial" },
  { key: "kanban-drag",        label: "Kanban drag-and-drop",   desc: "Arrastrar tarjetas entre estados (escritorio).",         category: "Operación" },
  { key: "tracking-realtime",  label: "Tracking en tiempo real",desc: "La óptica ve los cambios al instante.",                  category: "Operación" },
  { key: "wa-notifications",   label: "Notificaciones WhatsApp",desc: "Plantillas automáticas por cambio de estado.",           category: "Operación" },
  { key: "reprocesos",         label: "Reprocesos / garantía",  desc: "Flujo completo de reportes y reproceso ligado.",         category: "Operación" },
  { key: "rbac",               label: "Roles y permisos (RBAC)",desc: "Recepción, producción, despacho, admin.",                category: "Operación" },
  { key: "reportes",           label: "Reportes y analítica",   desc: "KPIs, tiempos por etapa, % reprocesos.",                 category: "Crecimiento" },
  { key: "onboarding-bulk",    label: "Onboarding de ópticas",  desc: "Invitación con cupo y lista de precios.",                category: "Crecimiento" },
  { key: "multi-sucursal",     label: "Multi-sucursal",         desc: "Óptica con varias tiendas y dirección de despacho.",     category: "Crecimiento" },
  { key: "api-publica",        label: "API pública",            desc: "Webhooks y endpoints para integrar el ERP del lab.",     category: "Crecimiento" },
];

export type Quota = {
  opticas: number;        // -1 = unlimited
  ordersPerMonth: number; // -1 = unlimited
};

export type Plan = {
  key: PlanKey;
  label: string;
  price: number; // COP/month
  description: string;
  features: Record<FeatureKey, boolean>;
  quota: Quota;
};

const allFeatures = (overrides: Partial<Record<FeatureKey, boolean>> = {}): Record<FeatureKey, boolean> => {
  const base = Object.fromEntries(
    FEATURES.map((f) => [f.key, false]),
  ) as Record<FeatureKey, boolean>;
  return { ...base, ...overrides };
};

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    key: "free",
    label: "Free",
    price: 0,
    description: "Para probar el producto. Limitado y con marca Lensia.",
    quota: { opticas: 3, ordersPerMonth: 30 },
    features: allFeatures({
      "kanban-drag": true,
      "tracking-realtime": true,
    }),
  },
  pro: {
    key: "pro",
    label: "Pro",
    price: 199000,
    description: "Para laboratorios en operación. Reduce errores y deja el WhatsApp manual.",
    quota: { opticas: 15, ordersPerMonth: 400 },
    features: allFeatures({
      "white-label": true,
      "kanban-drag": true,
      "tracking-realtime": true,
      "wa-notifications": true,
      "reprocesos": true,
      "rbac": true,
      "reportes": true,
      "onboarding-bulk": true,
    }),
  },
  business: {
    key: "business",
    label: "Business",
    price: 549000,
    description: "Para laboratorios consolidados con varias ópticas multi-sucursal.",
    quota: { opticas: -1, ordersPerMonth: -1 },
    features: allFeatures({
      "white-label": true,
      "kanban-drag": true,
      "tracking-realtime": true,
      "wa-notifications": true,
      "reprocesos": true,
      "rbac": true,
      "reportes": true,
      "onboarding-bulk": true,
      "multi-sucursal": true,
      "api-publica": true,
    }),
  },
};

export function featureOn(plan: PlanKey, key: FeatureKey, overrides?: Partial<Record<FeatureKey, boolean>>): boolean {
  if (overrides && overrides[key] !== undefined) return overrides[key]!;
  return PLANS[plan].features[key];
}

// ---- tenants (labs) ----
export type Tenant = {
  id: string;
  name: string;
  brand: string;
  city: string;
  plan: PlanKey;
  active: boolean;
  ordersThisMonth: number;
  opticasCount: number;
  featureOverrides: Partial<Record<FeatureKey, boolean>>;
};

export const TENANTS: Tenant[] = [
  {
    id: "lensia-lab", name: "Lensia Lab (demo)", brand: "#1166FF",
    city: "Medellín", plan: "business", active: true,
    ordersThisMonth: 128, opticasCount: 12, featureOverrides: {},
  },
  {
    id: "optilab", name: "OptiLab", brand: "#0CA678",
    city: "Bogotá", plan: "pro", active: true,
    ordersThisMonth: 76, opticasCount: 8, featureOverrides: {},
  },
  {
    id: "vision-andina", name: "Visión Andina", brand: "#6D4BE6",
    city: "Cali", plan: "pro", active: true,
    ordersThisMonth: 54, opticasCount: 6, featureOverrides: { "wa-notifications": false },
  },
  {
    id: "claros-lab", name: "Claros Laboratorios", brand: "#E0820E",
    city: "Barranquilla", plan: "free", active: true,
    ordersThisMonth: 21, opticasCount: 3, featureOverrides: {},
  },
  {
    id: "horizonte", name: "Lab Horizonte", brand: "#F23F66",
    city: "Bucaramanga", plan: "free", active: false,
    ordersThisMonth: 0, opticasCount: 1, featureOverrides: {},
  },
];
