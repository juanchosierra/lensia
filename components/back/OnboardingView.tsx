"use client";

import { useState } from "react";
import { Icon } from "../ui/Icon";
import { Field } from "../ui/Field";
import { SectionHead } from "../ui/SectionHead";
import { COP } from "@/lib/data";

type Mode = "mobile" | "desktop";

type Invitacion = {
  id: string;
  email: string;
  optica: string;
  ciudad: string;
  tier: "Preferente" | "Estándar";
  cupo: number;
  plazo: number;
  estado: "pendiente" | "aceptada" | "expirada";
  enviada: string;
};

const INITIAL_INVITES: Invitacion[] = [
  {
    id: "INV-008", email: "gerente@opticaelroble.com",
    optica: "Óptica El Roble", ciudad: "Pereira",
    tier: "Estándar", cupo: 2000000, plazo: 30,
    estado: "pendiente", enviada: "1 Jun",
  },
  {
    id: "INV-007", email: "info@vistaclara.com",
    optica: "Vista Clara", ciudad: "Cartagena",
    tier: "Preferente", cupo: 4500000, plazo: 45,
    estado: "aceptada", enviada: "28 May",
  },
  {
    id: "INV-006", email: "compras@centroptica.com",
    optica: "Centróptica", ciudad: "Manizales",
    tier: "Estándar", cupo: 1500000, plazo: 30,
    estado: "expirada", enviada: "10 May",
  },
];

const TIER_META = {
  Preferente: { discount: "−12%", cls: "is-active" },
  Estándar:   { discount: "Lista", cls: "is-idle" },
} as const;

const ESTADO_META = {
  pendiente: { label: "Pendiente",       cls: "is-wait" },
  aceptada:  { label: "Aceptada",        cls: "is-done" },
  expirada:  { label: "Expirada",        cls: "is-alert" },
} as const;

function InviteForm({
  onClose, onSubmit,
}: { onClose: () => void; onSubmit: (i: Invitacion) => void }) {
  const [email, setEmail] = useState("");
  const [optica, setOptica] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tier, setTier] = useState<"Preferente" | "Estándar">("Estándar");
  const [cupo, setCupo] = useState(2000000);
  const [plazo, setPlazo] = useState(30);
  const valid =
    /\S+@\S+\.\S+/.test(email) && optica.trim().length > 1 && ciudad.trim().length > 1;

  const submit = () => {
    if (!valid) return;
    const id = "INV-" + Math.floor(100 + Math.random() * 900);
    onSubmit({
      id, email, optica, ciudad, tier,
      cupo, plazo, estado: "pendiente", enviada: "Hoy",
    });
  };

  return (
    <div className="modal-wrap" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="modal-head">
          <div className="ls-eyebrow" style={{ marginBottom: 6 }}>Invitar óptica</div>
          <div className="ls-h2">Nueva invitación</div>
          <div className="ls-sub" style={{ marginTop: 4 }}>
            Recibirá un correo con el link para activar su acceso.
          </div>
        </div>
        <div className="modal-body" style={{ overflow: "auto" }}>
          <Field label="Correo del responsable">
            <input
              className="ls-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ej. compras@laoptica.com"
            />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <Field label="Nombre comercial">
              <input
                className="ls-input"
                value={optica}
                onChange={(e) => setOptica(e.target.value)}
                placeholder="Razón social u óptica"
              />
            </Field>
            <Field label="Ciudad">
              <input
                className="ls-input"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Bogotá"
              />
            </Field>
          </div>
          <Field label="Lista de precios">
            <div className="ls-segment">
              {(["Estándar", "Preferente"] as const).map((t) => (
                <button
                  key={t}
                  className={tier === t ? "on" : ""}
                  onClick={() => setTier(t)}
                  type="button"
                >
                  {t} · {TIER_META[t].discount}
                </button>
              ))}
            </div>
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Cupo de crédito">
              <input
                className="ls-input ls-mono"
                value={COP(cupo)}
                onChange={(e) =>
                  setCupo(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)
                }
              />
            </Field>
            <Field label="Plazo (días)">
              <input
                className="ls-input ls-mono"
                value={String(plazo)}
                onChange={(e) =>
                  setPlazo(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)
                }
              />
            </Field>
          </div>
          <div className="vbanner info">
            <span style={{ flexShrink: 0, marginTop: 1 }}>
              <Icon name="shield" size={15} />
            </span>
            <span>
              Al enviar la invitación generamos un link único válido por <b>7 días</b>.
              La óptica firma su autorización de datos (Ley 1581) al activarse.
            </span>
          </div>
        </div>
        <div className="modal-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            disabled={!valid}
            onClick={submit}
            type="button"
          >
            <Icon name="check" size={17} sw={2.3} />Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}

export function OnboardingView({
  mode, onToast,
}: { mode: Mode; onToast: (m: string) => void }) {
  const [invites, setInvites] = useState<Invitacion[]>(INITIAL_INVITES);
  const [formOpen, setFormOpen] = useState(false);

  const pad = mode === "desktop" ? 28 : 16;

  const send = (i: Invitacion) => {
    setInvites((list) => [i, ...list]);
    setFormOpen(false);
    onToast(`Invitación enviada a ${i.email}`);
  };

  const resend = (i: Invitacion) => {
    setInvites((list) =>
      list.map((x) => (x.id === i.id ? { ...x, estado: "pendiente", enviada: "Hoy" } : x)),
    );
    onToast(`Invitación reenviada a ${i.email}`);
  };

  return (
    <div className="ls-scroll" style={{ paddingBottom: 28 }}>
      <div style={{ padding: `${mode === "desktop" ? 22 : 14}px ${pad}px 14px` }}>
        {mode === "mobile" && <h1 className="ls-h1" style={{ marginBottom: 10 }}>Onboarding</h1>}
        <div className="ls-row" style={{ gap: 12 }}>
          <SectionHead
            title="Ópticas invitadas"
            sub="Gestiona invitaciones, lista de precios y cupo desde la creación."
            icon="user"
          />
          <span className="ls-grow" />
          <button
            className="ls-btn ls-btn-primary ls-btn-sm"
            onClick={() => setFormOpen(true)}
            type="button"
          >
            <Icon name="plus" size={15} />Invitar óptica
          </button>
        </div>
      </div>
      <div style={{ padding: `0 ${pad}px` }}>
        <div className="ls-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="dtable-scroll">
            <table className="dtable" style={{ minWidth: 720 }}>
              <thead>
                <tr>
                  <th>Óptica</th>
                  <th>Correo</th>
                  <th>Lista</th>
                  <th style={{ textAlign: "right" }}>Cupo</th>
                  <th>Plazo</th>
                  <th>Enviada</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id}>
                    <td style={{ fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap" }}>
                      {i.optica}
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>
                        {i.ciudad}
                      </div>
                    </td>
                    <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{i.email}</td>
                    <td>
                      <span className={"ls-badge " + TIER_META[i.tier].cls} style={{ height: 22 }}>
                        {i.tier} · {TIER_META[i.tier].discount}
                      </span>
                    </td>
                    <td className="num">{COP(i.cupo)}</td>
                    <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{i.plazo}d</td>
                    <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{i.enviada}</td>
                    <td>
                      <span
                        className={"ls-badge " + ESTADO_META[i.estado].cls}
                        style={{ height: 22 }}
                      >
                        {ESTADO_META[i.estado].label}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {i.estado !== "aceptada" && (
                        <button
                          className="ls-btn ls-btn-ghost ls-btn-sm"
                          onClick={() => resend(i)}
                          type="button"
                        >
                          <Icon name="repeat" size={14} />Reenviar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {formOpen && <InviteForm onClose={() => setFormOpen(false)} onSubmit={send} />}
    </div>
  );
}
