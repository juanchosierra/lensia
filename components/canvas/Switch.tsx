"use client";

import Link from "next/link";

type Props = { brand: string; active: "front" | "back" };

export function Switch({ brand, active }: Props) {
  const base = {
    padding: "8px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "-.01em",
    textDecoration: "none",
  } as const;
  const on = { ...base, background: brand, color: "#fff" };
  const off = { ...base, background: "transparent", color: "#475569" };
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 3,
        background: "#fff",
        border: "1px solid #e2e8f2",
        borderRadius: 999,
        padding: 3,
      }}
    >
      <Link href="/" style={active === "front" ? on : off}>
        Front · óptica
      </Link>
      <Link href="/back" style={active === "back" ? on : off}>
        Back · laboratorio
      </Link>
    </div>
  );
}
