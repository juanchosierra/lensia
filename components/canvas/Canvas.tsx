"use client";

import type { CSSProperties } from "react";
import { LensiaFront } from "../LensiaFront";
import { BrandMark } from "../ui/Brand";
import { ChromeWindow } from "./ChromeWindow";
import { IOSDevice } from "./IOSDevice";
import {
  TweakColor,
  TweakRadio,
  TweakSection,
  TweaksPanel,
  useTweaks,
  type TweakState,
} from "./Tweaks";

const BRANDS = [
  { name: "Lensia",         color: "#1166FF" },
  { name: "OptiLab",        color: "#0CA678" },
  { name: "Visión Andina",  color: "#6D4BE6" },
  { name: "Claros",         color: "#E0820E" },
];

const TWEAK_DEFAULTS: TweakState = {
  brand: "#1166FF",
  font: "Plus Jakarta Sans",
  corners: "Suaves",
};

const brandName = (c: string): string =>
  (BRANDS.find((b) => b.color.toLowerCase() === String(c).toLowerCase()) || BRANDS[0]).name;

function FrameLabel({ kicker, title, note }: { kicker: string; title: string; note: string }) {
  return (
    <div style={{ marginBottom: 14, maxWidth: 420 }}>
      <div
        style={{
          fontSize: 11, fontWeight: 800, letterSpacing: ".14em",
          textTransform: "uppercase", color: "#1166FF",
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontSize: 19, fontWeight: 800, color: "#0b1f3a",
          letterSpacing: "-.02em", marginTop: 3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13, color: "#64748b", marginTop: 3,
          fontWeight: 500, lineHeight: 1.45,
        }}
      >
        {note}
      </div>
    </div>
  );
}

export function Canvas() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const radii: CSSProperties =
    t.corners === "Marcadas"
      ? ({
          ["--r-sm" as string]: "5px",
          ["--r-md" as string]: "8px",
          ["--r-lg" as string]: "10px",
          ["--r-xl" as string]: "13px",
        } as CSSProperties)
      : {};

  const wrapVars: CSSProperties = {
    ["--brand" as string]: t.brand,
    ["--ui" as string]: `"${t.font}", system-ui, sans-serif`,
    ...radii,
  } as CSSProperties;

  const bn = brandName(t.brand);

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#e9eef5",
        padding: "0 0 80px",
        fontFamily: `"${t.font}", system-ui, sans-serif`,
        ...wrapVars,
      }}
    >
      {/* page header */}
      <div style={{ padding: "40px 44px 26px", maxWidth: 1700, margin: "0 auto" }}>
        <div className="ls-row" style={{ gap: 13, flexWrap: "wrap" }}>
          <BrandMark size={40} color={t.brand} />
          <div className="ls-col ls-grow">
            <div
              style={{
                fontSize: 30, fontWeight: 800, color: "#051533",
                letterSpacing: "-.03em",
              }}
            >
              {bn} · Front
            </div>
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              App de la óptica — Nueva Orden · Mis Órdenes · Seguimiento
            </div>
          </div>
          <div
            style={{
              display: "inline-flex", gap: 3, background: "#fff",
              border: "1px solid #e2e8f2", borderRadius: 999, padding: 3,
            }}
          >
            <span
              style={{
                padding: "8px 16px", borderRadius: 999,
                fontSize: 13, fontWeight: 800,
                background: t.brand, color: "#fff", letterSpacing: "-.01em",
              }}
            >
              Front · óptica
            </span>
            <a
              href="/app"
              style={{
                textDecoration: "none", padding: "8px 16px", borderRadius: 999,
                fontSize: 13, fontWeight: 800,
                background: "transparent", color: "#475569", letterSpacing: "-.01em",
              }}
            >
              Abrir app standalone →
            </a>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 14, marginTop: 26,
          }}
        >
          {(
            [
              ["El encargo", "Front responsive (móvil + escritorio) con los 3 flujos clave. Pensado mostrador-primero: la óptica pide desde el celular, pero también sirve completo en computador."],
              ["El diferenciador", "El Seguimiento: línea de tiempo vertical estilo paquete con el detalle que agrega el lab en cada paso (ETA, transportadora, guía). Reemplaza el WhatsApp/teléfono."],
              ["El sistema", "Azul de marca #1166FF + navy #051533. Plus Jakarta para UI, JetBrains Mono para la fórmula (datos tabulares precisos). White-label: el color es del lab."],
              ["Pruébalo", "Crea una orden y mira su tracking; repite un pedido; abre Lista de Precios (tus precios) y pide directo; en Estado de Cuenta simula 'Bloqueada' y mira cómo reacciona Nueva Orden."],
            ] as Array<[string, string]>
          ).map(([h, b]) => (
            <div
              key={h}
              style={{
                background: "#fff", border: "1px solid #e2e8f2",
                borderRadius: 14, padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#1166FF", marginBottom: 5 }}>
                {h}
              </div>
              <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5, fontWeight: 500 }}>
                {b}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* frames */}
      <div
        style={{
          display: "flex", flexWrap: "wrap", gap: 40,
          justifyContent: "center", alignItems: "flex-start",
          padding: "14px 36px 0",
        }}
      >
        <div>
          <FrameLabel
            kicker="Escritorio"
            title="Responsive — el lab opera en computador"
            note="Sidebar de navegación, tracking a dos columnas (línea de tiempo + ficha de la orden)."
          />
          <ChromeWindow
            width={1108}
            height={812}
            url={`claridad.${bn.toLowerCase().replace(/[^a-z]/g, "")}.app/ordenes`}
            title={`${bn} — Mis Órdenes`}
          >
            <div style={{ height: "100%", ...wrapVars }}>
              <LensiaFront mode="desktop" brandName={bn} />
            </div>
          </ChromeWindow>
        </div>

        <div>
          <FrameLabel
            kicker="Móvil"
            title="Mobile-first — desde el mostrador"
            note="Nueva Orden a pantalla completa, fórmula Rx por ojo, navegación inferior."
          />
          <div style={wrapVars}>
            <IOSDevice width={384} height={812}>
              <LensiaFront mode="mobile" brandName={bn} />
            </IOSDevice>
          </div>
        </div>
      </div>

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="White-label (marca del laboratorio)" />
        <TweakColor
          label="Color de marca"
          value={t.brand}
          options={BRANDS.map((b) => b.color)}
          onChange={(v) => setTweak("brand", v)}
        />
        <div
          style={{
            fontSize: 11.5, color: "#94a3b8",
            padding: "2px 2px 8px", lineHeight: 1.4,
          }}
        >
          Cada lab ve su propia marca. Activa:{" "}
          <b style={{ color: t.brand }}>{bn}</b>.
        </div>
        <TweakSection label="Tipografía" />
        <TweakRadio
          label="Fuente UI"
          value={t.font}
          options={["Plus Jakarta Sans", "Manrope", "Space Grotesk"]}
          onChange={(v) => setTweak("font", v)}
        />
        <TweakSection label="Forma" />
        <TweakRadio
          label="Esquinas"
          value={t.corners}
          options={["Suaves", "Marcadas"]}
          onChange={(v) => setTweak("corners", v as TweakState["corners"])}
        />
      </TweaksPanel>

      {/* credits */}
      <div
        style={{
          textAlign: "center",
          marginTop: 56,
          padding: "0 36px",
          fontSize: 13,
          color: "#94a3b8",
          fontWeight: 500,
          letterSpacing: "-.01em",
        }}
      >
        Hecho con <span style={{ color: "#e11d48" }}>❤</span> por{" "}
        <b style={{ color: "#475569", fontWeight: 800 }}>Cuantium-Wibi ™</b>
      </div>
    </div>
  );
}
