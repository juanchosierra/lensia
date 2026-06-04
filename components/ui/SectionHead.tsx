"use client";

import { Icon, type IconName } from "./Icon";

type Props = {
  n?: number | string;
  title: string;
  sub?: string;
  icon?: IconName;
};

export function SectionHead({ n, title, sub, icon }: Props) {
  return (
    <div className="ls-row" style={{ gap: 11, marginBottom: 2 }}>
      {n != null && (
        <div className="ls-sec">
          <div className="n">{n}</div>
        </div>
      )}
      {icon && (
        <div style={{ color: "var(--brand)" }}>
          <Icon name={icon} size={20} />
        </div>
      )}
      <div className="ls-col">
        <span className="ls-h3">{title}</span>
        {sub && (
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{sub}</span>
        )}
      </div>
    </div>
  );
}
