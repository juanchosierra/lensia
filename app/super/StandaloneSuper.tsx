"use client";

import { useEffect, useState } from "react";
import { Superadmin } from "@/components/super/Superadmin";

const BREAKPOINT = 900;

export function StandaloneSuper() {
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
      <Superadmin mode={mode} />
    </div>
  );
}
