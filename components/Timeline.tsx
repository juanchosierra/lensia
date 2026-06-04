"use client";

import { Icon } from "./ui/Icon";
import { STATES, type Order } from "@/lib/data";

export function Timeline({ o }: { o: Order }) {
  const cur = o.estadoN;
  return (
    <div className="ls-timeline">
      {STATES.map((s) => {
        const done = s.n < cur;
        const current = s.n === cur;
        const h = o.hist.find((x) => x.n === s.n);
        const cls = ["ls-tl-step", s.key, done ? "done" : "", current ? "current" : ""].join(" ");
        const showException = current && !!o.exception;
        return (
          <div key={s.n} className={cls}>
            <div className="ls-tl-rail">
              <div className="ls-tl-node">
                {done
                  ? <Icon name="check" size={16} sw={2.6} />
                  : current
                    ? showException
                      ? <Icon name="alert" size={15} />
                      : <span style={{ fontSize: 12, fontWeight: 800 }}>{s.n}</span>
                    : <span style={{ fontSize: 12, fontWeight: 700 }}>{s.n}</span>}
              </div>
              {s.n < 8 && <div className="ls-tl-line" />}
            </div>
            <div className="ls-tl-body">
              <div className="ls-tl-title">
                {s.label}
                {current && !o.exception && s.key !== "entregado" && (
                  <span className="ls-badge is-active" style={{ height: 21, fontSize: 11 }}>
                    Aquí va tu pedido
                  </span>
                )}
              </div>
              {h && <div className="ls-tl-time">{h.ts}</div>}
              {!done && !current && <div className="ls-tl-desc">{s.desc}</div>}
              {h && h.info && (
                <div className={"ls-tl-info" + (h.ship ? " ship" : "")}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon name={h.ship ? "truck" : "check"} size={15} />
                  </span>
                  <span>{h.info}</span>
                </div>
              )}
              {showException && o.exception && (
                <div
                  className="ls-tl-info"
                  style={{ background: "var(--warn-bg)", color: "var(--warn)" }}
                >
                  <span style={{ flexShrink: 0, marginTop: 1 }}>
                    <Icon name="alert" size={15} />
                  </span>
                  <span>
                    <b>{o.exception.label}.</b> {o.exception.detail}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
