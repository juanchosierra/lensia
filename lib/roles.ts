// lib/roles.ts — RBAC roles + permissions (Fase 2)

export type LabRole = "admin-lab" | "recepcion" | "produccion" | "despacho";
export type ShopRole = "duena" | "vendedora";
export type Role = LabRole | ShopRole;

export type Permission =
  | "lab.bandeja.view"
  | "lab.bandeja.advance"
  | "lab.bandeja.exception"
  | "lab.reprocesos.decide"
  | "lab.catalogo.edit"
  | "lab.cartera.view"
  | "lab.cartera.pago"
  | "lab.cartera.cupo"
  | "lab.onboarding.invite"
  | "lab.reportes.view"
  | "lab.plantillas.edit"
  | "shop.orders.create"
  | "shop.orders.view"
  | "shop.precios.view"
  | "shop.cuenta.view"
  | "shop.garantias.create";

const PERMS: Record<Role, Permission[]> = {
  "admin-lab": [
    "lab.bandeja.view", "lab.bandeja.advance", "lab.bandeja.exception",
    "lab.reprocesos.decide", "lab.catalogo.edit",
    "lab.cartera.view", "lab.cartera.pago", "lab.cartera.cupo",
    "lab.onboarding.invite", "lab.reportes.view", "lab.plantillas.edit",
  ],
  recepcion: [
    "lab.bandeja.view", "lab.bandeja.advance", "lab.bandeja.exception",
    "lab.reprocesos.decide",
  ],
  produccion: [
    "lab.bandeja.view", "lab.bandeja.advance", "lab.bandeja.exception",
  ],
  despacho: [
    "lab.bandeja.view", "lab.bandeja.advance",
  ],
  duena: [
    "shop.orders.create", "shop.orders.view",
    "shop.precios.view", "shop.cuenta.view", "shop.garantias.create",
  ],
  vendedora: [
    "shop.orders.create", "shop.orders.view",
    "shop.precios.view", "shop.garantias.create",
  ],
};

export function can(role: Role, perm: Permission): boolean {
  return PERMS[role]?.includes(perm) ?? false;
}

export const ROLE_META: Record<Role, { label: string; sub: string; side: "lab" | "shop" }> = {
  "admin-lab":  { label: "Admin lab",   sub: "Acceso total al panel del laboratorio", side: "lab" },
  recepcion:    { label: "Recepción",   sub: "Recibe pedidos, abre reprocesos",       side: "lab" },
  produccion:   { label: "Producción",  sub: "Mueve pedidos por el Kanban",           side: "lab" },
  despacho:     { label: "Despacho",    sub: "Sólo avanza despachos y entregas",      side: "lab" },
  duena:        { label: "Dueña",       sub: "Ve cuenta, autoriza pedidos",           side: "shop" },
  vendedora:    { label: "Vendedora",   sub: "Crea pedidos, sin ver cartera",         side: "shop" },
};

export const LAB_ROLES: LabRole[] = ["admin-lab", "recepcion", "produccion", "despacho"];
export const SHOP_ROLES: ShopRole[] = ["duena", "vendedora"];
