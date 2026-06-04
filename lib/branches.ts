// lib/branches.ts — multi-branch optic shops (Fase 2)

export type Branch = {
  id: string;
  name: string;
  direccion: string;
  ciudad: string;
};

export const BRANCHES: Record<string, Branch[]> = {
  claridad: [
    { id: "claridad-cc",  name: "Sede Principal · Centro", direccion: "Cra. 50 # 52-21, local 104", ciudad: "Medellín" },
    { id: "claridad-pob", name: "El Poblado",              direccion: "Cl. 10 # 36-15, Edificio Plaza, oficina 305", ciudad: "Medellín" },
    { id: "claridad-env", name: "Envigado",                direccion: "Cl. 39 Sur # 41-44, local 12",        ciudad: "Envigado" },
  ],
  vision2020: [
    { id: "v2020-cha", name: "Chapinero",  direccion: "Cra. 13 # 60-30",  ciudad: "Bogotá" },
    { id: "v2020-coll", name: "Colina",    direccion: "Av. 19 # 138-72", ciudad: "Bogotá" },
  ],
};
