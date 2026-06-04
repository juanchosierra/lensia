"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { LensiaBack } from "../LensiaBack";
import { BrandMark } from "../ui/Brand";
import { ChromeWindow } from "./ChromeWindow";
import { IOSDevice } from "./IOSDevice";
import { Switch } from "./Switch";
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
    <div style={{ marginBottom: 14, maxWidth: 460 }}>
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

export function BackCanvas() {
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
      <div style={{ padding: "36px 44px 24px", maxWidth: 1760, margin: "0 auto" }}>
        <div className="ls-row" style={{ gap: 13, flexWrap: "wrap" }}>
          <BrandMark size={40} color={t.brand} />
          <div className="ls-col ls-grow">
            <div style={{ fontSize: 30, fontWeight: 800, color: "#051533", letterSpacing: "-.03em" }}>
              {bn} · Back
            </div>
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>
              Panel del laboratorio — Bandeja Kanban · Detalle · Avanzar estado
            </div>
          </div>
          <Switch brand={t.brand} active="back" />
        </div>
        <div className="ls-row" style={{ marginTop: 16, gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/lab"
            style={{
              textDecoration: "none", padding: "8px 14px", borderRadius: 999,
              fontSize: 12.5, fontWeight: 700, color: t.brand,
              background: "#fff", border: "1px solid #e2e8f2",
              letterSpacing: "-.01em",
            }}
          >
            Abrir Back standalone →
          </Link>
          <Link
            href="/app"
            style={{
              textDecoration: "none", padding: "8px 14px", borderRadius: 999,
              fontSize: 12.5, fontWeight: 700, color: "#475569",
              background: "#fff", border: "1px solid #e2e8f2",
              letterSpacing: "-.01em",
            }}
          >
            Abrir Front standalone →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 14, marginTop: 24,
          }}
        >
          {(
            [
              ["El tablero", "Una columna por etapa de producción. Cada tarjeta es un pedido entrante de una óptica. Arrastra una tarjeta a la siguiente columna para avanzarla."],
              ["Avanzar = informar", "Al avanzar, el lab agrega lo que la óptica verá en su seguimiento: fecha estimada, transportadora y # de guía, o el motivo de una demora."],
              ["Multi-tenant", "Pedidos de varias ópticas (clientes del lab), con su tier de precios. Filtra por óptica o por urgencia. White-label: el panel lleva la marca del lab."],
              ["Pruébalo", "Arrastra tarjetas entre columnas; abre cualquiera para su ficha; en Catálogo edita un precio especial por óptica; en Cartera registra un pago y mira el aging actualizarse."],
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

      {/* desktop board */}
      <div style={{ padding: "8px 44px 0", maxWidth: 1760, margin: "0 auto" }}>
        <FrameLabel
          kicker="Escritorio"
          title="Bandeja de pedidos — tablero Kanban"
          note="El lab opera en computador. Arrastra entre columnas; al soltar se pide la info que verá la óptica."
        />
        <div style={wrapVars}>
          <ChromeWindow
            width={1672}
            height={820}
            url={`lab.${bn.toLowerCase().replace(/[^a-z]/g, "")}.app/bandeja`}
            title={`${bn} Lab — Bandeja`}
          >
            <div style={{ height: "100%", ...wrapVars }}>
              <LensiaBack mode="desktop" brandName={bn} />
            </div>
          </ChromeWindow>
        </div>
      </div>

      {/* mobile consult + explanation card */}
      <div
        style={{
          padding: "40px 44px 0",
          maxWidth: 1760, margin: "0 auto",
          display: "flex", gap: 48, flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <FrameLabel
            kicker="Móvil"
            title="Consulta rápida — responsive"
            note="Para revisar y avanzar pedidos desde el celular. Mismo tablero apilado; toca una tarjeta para la ficha."
          />
          <div style={wrapVars}>
            <IOSDevice width={384} height={812}>
              <LensiaBack mode="mobile" brandName={bn} />
            </IOSDevice>
          </div>
        </div>
        <div
          style={{
            flex: 1, minWidth: 280, maxWidth: 520,
            background: "#fff", border: "1px solid #e2e8f2",
            borderRadius: 16, padding: 22,
          }}
        >
          <div
            style={{
              fontSize: 12.5, fontWeight: 800,
              color: "#1166FF", marginBottom: 10,
            }}
          >
            CÓMO ENCAJA CON EL FRONT
          </div>
          <div
            style={{
              fontSize: 14, color: "#334155",
              lineHeight: 1.6, fontWeight: 500,
            }}
          >
            Lo que el laboratorio hace aquí (avanzar estado, agregar guía o fecha) aparece{" "}
            <b>en tiempo real</b> en el seguimiento de la óptica en el Front. Es el mismo ciclo de 8 estados,
            visto desde los dos lados.
            <br /><br />
            Usa el selector <b>Front · óptica / Back · laboratorio</b> arriba para alternar entre los dos productos.
          </div>
        </div>
      </div>

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
          Marca activa: <b style={{ color: t.brand }}>{bn}</b>.
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
