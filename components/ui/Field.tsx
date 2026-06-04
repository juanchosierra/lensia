"use client";

import type { ReactNode } from "react";

type FieldProps = {
  label?: string;
  opt?: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, opt, hint, children }: FieldProps) {
  return (
    <div className="ls-field">
      {label && (
        <label className="ls-label">
          {label}
          {opt && <span className="opt">{opt}</span>}
        </label>
      )}
      {children}
      {hint && (
        <span style={{ fontSize: 11.5, color: "var(--faint)", fontWeight: 500 }}>{hint}</span>
      )}
    </div>
  );
}
