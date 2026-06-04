"use client";

type BrandProps = {
  size?: number;
  color?: string;
  mono?: boolean;
  name?: string;
};

export function BrandMark({ size = 28, color }: { size?: number; color?: string }) {
  const c = color || "var(--brand)";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
      <path d="M14 9 V33 a4 4 0 0 0 4 4 H33"
        stroke={c} strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="27.5" cy="22.5" r="11" stroke={c} strokeWidth="3.4" />
    </svg>
  );
}

export function Brand({ size = 26, color, mono = false, name }: BrandProps) {
  return (
    <div className="ls-row" style={{ gap: 9 }}>
      <BrandMark size={size} color={color} />
      <span
        style={{
          fontSize: size * 0.72,
          fontWeight: 800,
          letterSpacing: "-.04em",
          color: mono ? "#fff" : "var(--ink)",
        }}
      >
        {name || "Lensia"}
      </span>
    </div>
  );
}
