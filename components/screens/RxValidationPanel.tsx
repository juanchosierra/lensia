"use client";

import { Icon } from "../ui/Icon";
import type { ValidationIssue } from "@/lib/rx-validation";

type Props = { issues: ValidationIssue[] };

export function RxValidationPanel({ issues }: Props) {
  if (issues.length === 0) {
    return (
      <div className="vbanner ok">
        <span style={{ flexShrink: 0, marginTop: 1 }}>
          <Icon name="check" size={17} sw={2.3} />
        </span>
        <span>
          <b>Fórmula consistente.</b> Sin errores ni advertencias.
        </span>
      </div>
    );
  }
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  const infos = issues.filter((i) => i.level === "info");

  return (
    <div className="ls-col" style={{ gap: 8 }}>
      {errors.map((i) => (
        <div key={i.id} className="vbanner err">
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <Icon name="alert" size={17} />
          </span>
          <span>
            <b>{i.message}.</b> {i.detail}
          </span>
        </div>
      ))}
      {warns.map((i) => (
        <div key={i.id} className="vbanner warn">
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <Icon name="alert" size={17} />
          </span>
          <span>
            <b>{i.message}.</b> {i.detail}
          </span>
        </div>
      ))}
      {infos.map((i) => (
        <div key={i.id} className="vbanner info">
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <Icon name="spark" size={17} />
          </span>
          <span>
            <b>{i.message}.</b> {i.detail}
          </span>
        </div>
      ))}
    </div>
  );
}
