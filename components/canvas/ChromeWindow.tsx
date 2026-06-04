"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  width?: number;
  height?: number;
  url?: string;
  title?: string;
};

const C = {
  barBg: "#202124",
  tabBg: "#35363a",
  text: "#e8eaed",
  dim: "#9aa0a6",
  urlBg: "#282a2d",
};

function TrafficLights() {
  return (
    <div style={{ display: "flex", gap: 8, padding: "0 14px" }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
    </div>
  );
}

export function ChromeWindow({
  children, width = 1108, height = 812, url = "lensia.app", title = "Lensia",
}: Props) {
  return (
    <div
      style={{
        width, height, borderRadius: 12, overflow: "hidden",
        background: C.barBg, color: C.text,
        boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10)",
        fontFamily: "-apple-system, system-ui, sans-serif",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* tab bar */}
      <div
        style={{
          display: "flex", alignItems: "center",
          padding: "10px 0 0", background: C.barBg, flexShrink: 0,
        }}
      >
        <TrafficLights />
        <div
          style={{
            display: "flex", alignItems: "center",
            padding: "8px 14px", margin: "0 4px 0 12px",
            background: C.tabBg, borderRadius: "8px 8px 0 0",
            fontSize: 13, gap: 8, maxWidth: 280, minWidth: 180,
          }}
        >
          <div
            style={{
              width: 14, height: 14, borderRadius: 3, background: "#fff",
              display: "grid", placeItems: "center",
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 800, color: "#1166FF" }}>L</span>
          </div>
          <span
            style={{
              whiteSpace: "nowrap", overflow: "hidden",
              textOverflow: "ellipsis", color: C.text, flex: 1,
            }}
          >
            {title}
          </span>
        </div>
        <div style={{ flex: 1 }} />
      </div>
      {/* url bar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 14px 10px", background: C.tabBg,
        }}
      >
        <div style={{ display: "flex", gap: 6, color: C.dim }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
          </svg>
        </div>
        <div
          style={{
            flex: 1, background: C.urlBg, borderRadius: 999,
            padding: "6px 14px", display: "flex",
            alignItems: "center", gap: 8, fontSize: 13, color: C.dim,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>{url}</span>
        </div>
      </div>
      {/* viewport */}
      <div style={{ flex: 1, overflow: "hidden", background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}
