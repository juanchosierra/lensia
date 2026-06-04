"use client";

import { useEffect, useState } from "react";
import { LensiaBack } from "@/components/LensiaBack";

const BREAKPOINT = 900;

export function StandaloneLab() {
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const apply = () => setMode(mql.matches ? "mobile" : "desktop");
    apply();
    setReady(true);
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  if (!ready) {
    return <div style={{ background: "#f4f7fb", height: "100vh" }} />;
  }

  return (
    <div style={{ height: "100vh", background: "var(--bg)" }}>
      <LensiaBack mode={mode} brandName="Lensia" />
    </div>
  );
}
