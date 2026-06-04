"use client";

import { STATES, type Order } from "@/lib/data";

export function StatusBadge({ order, withDot = true }: { order: Order; withDot?: boolean }) {
  if (order.exception) {
    return (
      <span className="ls-badge is-alert">
        {withDot && <i className="dot" />}
        {order.exception.label}
      </span>
    );
  }
  const st = STATES[order.estadoN - 1];
  const kind = order.estadoN >= 8 ? "is-done" : "is-active";
  return (
    <span className={"ls-badge " + kind}>
      {withDot && <i className="dot" />}
      {st.label}
    </span>
  );
}
