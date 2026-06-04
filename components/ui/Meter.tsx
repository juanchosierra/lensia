"use client";

type Props = { n: number; total?: number; done?: boolean };

export function Meter({ n, total = 8, done = false }: Props) {
  return (
    <div className="ls-meter">
      {Array.from({ length: total }).map((_, i) => (
        <i key={i} className={i < n ? (done ? "done" : "fill") : ""} />
      ))}
    </div>
  );
}
