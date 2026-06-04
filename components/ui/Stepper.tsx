"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  step?: number;
  decimals?: number;
  signed?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  placeholder?: string;
};

export function Stepper({
  value, onChange, step = 0.25, decimals = 2,
  signed = true, min = -30, max = 30, disabled = false, placeholder = "—",
}: Props) {
  const parse = (s: string): number | null => {
    const v = parseFloat(s);
    return isNaN(v) ? null : v;
  };
  const fmt = (v: number | null): string => {
    if (v === null || isNaN(v)) return "";
    const f = v.toFixed(decimals);
    return signed && v > 0 ? "+" + f : f;
  };
  const bump = (dir: 1 | -1) => {
    if (disabled) return;
    const base = parse(value) ?? 0;
    let nv = Math.round((base + dir * step) / step) * step;
    nv = Math.max(min, Math.min(max, nv));
    onChange(fmt(nv));
  };
  return (
    <div className="ls-step" style={disabled ? { opacity: 0.45, pointerEvents: "none" } : undefined}>
      <button onClick={() => bump(-1)} tabIndex={-1} disabled={disabled} type="button">−</button>
      <input
        value={value ?? ""}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9+\-.]/g, ""))}
        onBlur={(e) => {
          const v = parse(e.target.value);
          onChange(v === null ? "" : fmt(v));
        }}
      />
      <button onClick={() => bump(1)} tabIndex={-1} disabled={disabled} type="button">+</button>
    </div>
  );
}
