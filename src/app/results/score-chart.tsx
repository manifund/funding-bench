'use client';

// Epoch-style scatter: FundingBench score (0–100) vs model release date.
// Single conceptual series → one accent hue, identity via direct labels
// (ink-colored text, never the mark color); no legend needed.

export interface ScorePoint {
  label: string;
  released: string; // ISO date
  score: number; // 0–100
  n: number;
}

const W = 640;
const H = 300;
const M = { top: 16, right: 24, bottom: 36, left: 40 };

export default function ScoreChart({ points }: { points: ScorePoint[] }) {
  if (points.length === 0) return null;
  const pts = [...points].sort(
    (a, b) => Date.parse(a.released) - Date.parse(b.released)
  );

  const t0 = Date.parse(pts[0].released);
  const t1 = Date.parse(pts[pts.length - 1].released);
  const pad = Math.max((t1 - t0) * 0.08, 90 * 86400e3);
  const xMin = t0 - pad;
  const xMax = t1 + pad;
  const x = (t: number) => M.left + ((t - xMin) / (xMax - xMin)) * (W - M.left - M.right);
  const y = (s: number) => M.top + (1 - s / 100) * (H - M.top - M.bottom);

  // half-year ticks across the domain
  const ticks: Date[] = [];
  const first = new Date(xMin);
  const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() < 6 ? 0 : 6, 1));
  if (d.getTime() < xMin) d.setUTCMonth(d.getUTCMonth() + 6);
  while (d.getTime() <= xMax) {
    ticks.push(new Date(d));
    d.setUTCMonth(d.getUTCMonth() + 6);
  }
  const fmtTick = (dt: Date) =>
    dt.getUTCMonth() === 0 ? String(dt.getUTCFullYear()) : `Jul ${dt.getUTCFullYear()}`;

  // direct labels: above-right by default; flip below when crowding the
  // previous label or the top edge
  const placed: { px: number; side: 'up' | 'down' }[] = [];
  const labelSide = (px: number, py: number): 'up' | 'down' => {
    const prev = placed[placed.length - 1];
    let side: 'up' | 'down' = py < M.top + 16 ? 'down' : 'up';
    if (prev && px - prev.px < 90 && prev.side === side)
      side = side === 'up' ? 'down' : 'up';
    placed.push({ px, side });
    return side;
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-2xl"
      role="img"
      aria-label="FundingBench score by model release date"
    >
      {/* gridlines + y labels */}
      {[0, 25, 50, 75, 100].map((s) => (
        <g key={s}>
          <line
            x1={M.left}
            x2={W - M.right}
            y1={y(s)}
            y2={y(s)}
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth={s === 0 ? 1.5 : 1}
          />
          <text
            x={M.left - 8}
            y={y(s) + 3}
            textAnchor="end"
            className="fill-neutral-500 text-[10px]"
          >
            {s}
          </text>
        </g>
      ))}
      {/* x ticks */}
      {ticks.map((dt) => (
        <g key={dt.toISOString()}>
          <line
            x1={x(dt.getTime())}
            x2={x(dt.getTime())}
            y1={H - M.bottom}
            y2={H - M.bottom + 4}
            className="stroke-neutral-400"
          />
          <text
            x={x(dt.getTime())}
            y={H - M.bottom + 16}
            textAnchor="middle"
            className="fill-neutral-500 text-[10px]"
          >
            {fmtTick(dt)}
          </text>
        </g>
      ))}
      {/* points + direct labels */}
      {pts.map((p) => {
        const px = x(Date.parse(p.released));
        const py = y(p.score);
        const side = labelSide(px, py);
        const ly = side === 'up' ? py - 10 : py + 18;
        const anchor: 'start' | 'middle' | 'end' =
          px > W - M.right - 90 ? 'end' : px < M.left + 60 ? 'start' : 'middle';
        return (
          <g key={p.label}>
            <circle
              cx={px}
              cy={py}
              r={5}
              className="fill-orange-600 dark:fill-orange-500 stroke-[var(--background)]"
              strokeWidth={2}
            />
            {/* larger invisible hit target with tooltip */}
            <circle cx={px} cy={py} r={14} fill="transparent">
              <title>
                {`${p.label} (${p.released}): ${p.score.toFixed(1)} across ${p.n} cells`}
              </title>
            </circle>
            <text
              x={px}
              y={ly}
              textAnchor={anchor}
              className="fill-neutral-700 dark:fill-neutral-300 text-[11px]"
            >
              {p.label}
            </text>
            <text
              x={px}
              y={ly + (side === 'up' ? -11 : 12)}
              textAnchor={anchor}
              className="fill-neutral-500 text-[10px]"
            >
              {p.score.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
