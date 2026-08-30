"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChartDataPoint {
  time: string;
  transactions: number;
  computeCalls: number;
}

interface ActivityChartProps {
  data?: ChartDataPoint[];
  className?: string;
}

const DEFAULT_DATA: ChartDataPoint[] = [
  { time: "00:00", transactions: 24, computeCalls: 12 },
  { time: "03:00", transactions: 45, computeCalls: 28 },
  { time: "06:00", transactions: 18, computeCalls: 10 },
  { time: "09:00", transactions: 92, computeCalls: 65 },
  { time: "12:00", transactions: 148, computeCalls: 110 },
  { time: "15:00", transactions: 195, computeCalls: 142 },
  { time: "18:00", transactions: 160, computeCalls: 125 },
  { time: "21:00", transactions: 115, computeCalls: 84 },
];

export function ActivityChart({ data = DEFAULT_DATA, className }: ActivityChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.transactions, d.computeCalls)),
    10
  );

  const width = 700;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const pointsTx = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = height - paddingY - (d.transactions / maxVal) * chartH;
    return { x, y, val: d.transactions, time: d.time };
  });

  const pointsCompute = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = height - paddingY - (d.computeCalls / maxVal) * chartH;
    return { x, y, val: d.computeCalls, time: d.time };
  });

  const createAreaPath = (points: { x: number; y: number }[]) => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    let d = `M ${first.x} ${first.y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }
    d += ` L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;
    return d;
  };

  const createLinePath = (points: { x: number; y: number }[]) => {
    if (!points.length) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }
    return d;
  };

  return (
    <div className={cn("rounded-lg border border-border bg-surface p-5", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">24h Network Activity</h2>
          <p className="text-xs text-muted">Real-time throughput and verifiable compute requests</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-muted">Transactions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#A855F7]" />
            <span className="text-muted">Compute Calls</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[220px] overflow-visible"
        >
          <defs>
            <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="computeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingY + ratio * chartH;
            const val = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#27272A"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717A"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fills */}
          <path d={createAreaPath(pointsTx)} fill="url(#txGradient)" />
          <path d={createAreaPath(pointsCompute)} fill="url(#computeGradient)" />

          {/* Line paths */}
          <path
            d={createLinePath(pointsTx)}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={createLinePath(pointsCompute)}
            fill="none"
            stroke="#A855F7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive hover points and columns */}
          {data.map((d, i) => {
            const ptTx = pointsTx[i];
            const ptComp = pointsCompute[i];
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Column highlight */}
                {isHovered && (
                  <line
                    x1={ptTx.x}
                    y1={paddingY}
                    x2={ptTx.x}
                    y2={height - paddingY}
                    stroke="#3F3F46"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point dots */}
                <circle
                  cx={ptTx.x}
                  cy={ptTx.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#0A0A0B"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                <circle
                  cx={ptComp.x}
                  cy={ptComp.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#0A0A0B"
                  stroke="#A855F7"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* X Axis Time Labels */}
                <text
                  x={ptTx.x}
                  y={height - 6}
                  textAnchor="middle"
                  fill={isHovered ? "#FAFAFA" : "#71717A"}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isHovered ? "600" : "400"}
                >
                  {d.time}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div
            className="pointer-events-none absolute top-4 z-10 rounded-lg border border-border bg-[#141416] p-3 shadow-xl text-xs font-mono transition-all"
            style={{
              left: `${Math.min(
                Math.max((pointsTx[hoveredIdx].x / width) * 100, 15),
                80
              )}%`,
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-muted mb-1.5 font-sans font-medium">
              Time: {data[hoveredIdx].time}
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Transactions
                </span>
                <span className="font-semibold text-foreground">
                  {data[hoveredIdx].transactions}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-muted">
                  <span className="h-2 w-2 rounded-full bg-[#A855F7]" />
                  Compute Calls
                </span>
                <span className="font-semibold text-foreground">
                  {data[hoveredIdx].computeCalls}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
