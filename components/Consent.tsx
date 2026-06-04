"use client";

import { useState } from "react";
import { Icon } from "./ui/Icon";

const RESPONSABLE = {
  nombre: "URB Digital Thinking S.A.S.",
  nit: "NIT 901.234.567-8",
  contacto: "datos@urb.digital",
};

export function ConsentBanner({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="vbanner info"
      style={{
        margin: "0 0 14px",
        fontSize: 12.5,
        gap: 8,
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 1 }}>
        <Icon name="shield" size={15} />
      </span>
      <span>
        Estás capturando datos clínicos de un paciente. Confirmas que la óptica obtuvo su{" "}
        <b>autorización de tratamiento de datos sensibles</b> (Ley 1581 / GDPR){" "}
        para enviarlos al laboratorio.
      </span>
    </div>
  );
}

export function ConsentModal({
  open, onClose, onAccept,
}: { open: boolean; onClose: () => void; onAccept: () => void }) {
  const [scope, setScope] = useState<Record<string, boolean>>({
    tratamiento: true,
    transferencia: true,
    almacenamiento: true,
    contacto: false,
  });
  const ready = scope.tratamiento && scope.transferencia && scope.almacenamiento;
  if (!open) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 100%)", maxHeight: "92vh",
          display: "flex", flexDirection: "column",
        }}
      >
        <div className="modal-head">
          <div className="ls-eyebrow" style={{ marginBottom: 6 }}>Onboarding</div>
          <div className="ls-h2">Autorización de tratamiento de datos</div>
          <div className="ls-sub" style={{ marginTop: 4 }}>
            Ley 1581 de 2012 · Decreto 1377 · GDPR (UE)
          </div>
        </div>
        <div className="modal-body" style={{ overflow: "auto" }}>
          <p
            style={{
              fontSize: 13, color: "var(--text)", margin: 0,
              fontWeight: 500, lineHeight: 1.6,
            }}
          >
            En Lensia tratamos <b>datos personales sensibles</b> (nombre del paciente,
            fórmula óptica, observaciones clínicas) con la finalidad exclusiva de
            <b> fabricar el lente solicitado</b> y mantener su trazabilidad para garantía.
          </p>
          <div className="ls-divider" />
          <div className="ls-col" style={{ gap: 10 }}>
            {(
              [
                ["tratamiento", "Tratamiento de datos sensibles del paciente", "Captura, uso interno y conservación durante la vida del pedido."],
                ["transferencia", "Transferencia óptica ↔ laboratorio", "Sólo se comparte con el laboratorio que fabrica el lente."],
                ["almacenamiento", "Almacenamiento en servidores en Colombia / UE", "Hospedado en infraestructura con cifrado en reposo y en tránsito."],
                ["contacto", "Recibir comunicaciones comerciales", "Opcional — productos y mejoras de Lensia."],
              ] as Array<[string, string, string]>
            ).map(([k, t, d]) => (
              <label
                key={k}
                className="ls-card"
                style={{
                  padding: 13, display: "flex", gap: 12, cursor: "pointer",
                  alignItems: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!scope[k]}
                  onChange={(e) => setScope((p) => ({ ...p, [k]: e.target.checked }))}
                  style={{
                    width: 18, height: 18, accentColor: "var(--brand)",
                    marginTop: 2, flexShrink: 0,
                  }}
                />
                <div className="ls-col" style={{ gap: 2 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{t}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{d}</span>
                </div>
              </label>
            ))}
          </div>
          <div
            className="ls-card"
            style={{
              padding: 12, background: "var(--bg-sunken)",
              border: "1px solid var(--line)", fontSize: 11.5,
              color: "var(--muted)", lineHeight: 1.5,
            }}
          >
            <b style={{ color: "var(--ink)" }}>Responsable del tratamiento:</b>{" "}
            {RESPONSABLE.nombre} ({RESPONSABLE.nit}). Puedes ejercer tus derechos de acceso,
            rectificación, supresión y revocatoria escribiendo a{" "}
            <b style={{ color: "var(--brand-700)" }}>{RESPONSABLE.contacto}</b>.
          </div>
        </div>
        <div className="modal-foot">
          <button className="ls-btn ls-btn-ghost ls-grow" onClick={onClose} type="button">
            Más tarde
          </button>
          <button
            className="ls-btn ls-btn-primary ls-grow"
            disabled={!ready}
            onClick={onAccept}
            type="button"
          >
            <Icon name="check" size={17} sw={2.3} />Autorizar y continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export function PrivacyFooter({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        fontSize: compact ? 10 : 11,
        color: "var(--faint)",
        textAlign: "center",
        padding: compact ? "4px 12px" : "10px 12px",
        lineHeight: 1.5,
        fontWeight: 500,
      }}
    >
      Tus datos están protegidos por la <b style={{ color: "var(--muted)" }}>Ley 1581</b>.
      Responsable: {RESPONSABLE.nombre}. ·{" "}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: "var(--brand-700)", textDecoration: "underline", fontWeight: 600 }}
      >
        Política de privacidad
      </a>
    </div>
  );
}
