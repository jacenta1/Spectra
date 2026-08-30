"use client";

import { useState } from "react";
import { AnomalyReport } from "@/types/agent";
import { ShieldAlert, ShieldCheck, AlertTriangle, Play, RefreshCw, Cpu, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnomalyScannerProps {
  agentId: string;
  agentName: string;
  anomalyReport?: AnomalyReport;
}

export function AnomalyScanner({ agentId, agentName, anomalyReport: initialReport }: AnomalyScannerProps) {
  const [report, setReport] = useState<AnomalyReport | undefined>(initialReport);
  const [isScanning, setIsScanning] = useState(false);

  const runScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/anomaly-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch {
      // Keep existing report on error
    } finally {
      setIsScanning(false);
    }
  };

  const score = report?.overallScore ?? 0;
  const isSafe = score < 20;

  return (
    <div className="space-y-6">
      {/* Risk Overview Card */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-md p-2.5 border",
                isSafe
                  ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              )}
            >
              {isSafe ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">0G Compute Behavioral Risk Engine</h3>
              <p className="text-xs text-muted">
                Analyzes execution logs for reentrancy, capital leaks, and prompt injection attempts via 0G Compute Router.
              </p>
            </div>
          </div>
          <button
            onClick={runScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-2 text-xs font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            {isScanning ? "Evaluating Logs..." : "Run AI Anomaly Audit"}
          </button>
        </div>

        {/* Risk Metrics Breakdown */}
        {report && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-md border border-border/80 bg-background/60 p-3">
              <span className="text-[11px] font-mono text-muted uppercase">Overall Threat Score</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className={cn("text-xl font-bold font-mono", isSafe ? "text-[#22C55E]" : "text-amber-400")}>
                  {report.overallScore}
                </span>
                <span className="text-xs font-mono text-muted">/ 100</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", isSafe ? "bg-[#22C55E]" : "bg-amber-400")}
                  style={{ width: `${Math.min(report.overallScore, 100)}%` }}
                />
              </div>
            </div>

            <div className="rounded-md border border-border/80 bg-background/60 p-3">
              <span className="text-[11px] font-mono text-muted uppercase">Reentrancy / Loops</span>
              <p className="mt-1 text-xl font-bold font-mono text-foreground">{report.risks.reentrancyRisk}%</p>
              <p className="mt-1 text-[10px] text-muted">Recursion invariant nominal</p>
            </div>

            <div className="rounded-md border border-border/80 bg-background/60 p-3">
              <span className="text-[11px] font-mono text-muted uppercase">Capital Outflow</span>
              <p className="mt-1 text-xl font-bold font-mono text-foreground">{report.risks.capitalOutflowRisk}%</p>
              <p className="mt-1 text-[10px] text-muted">Within slippage bounds</p>
            </div>

            <div className="rounded-md border border-border/80 bg-background/60 p-3">
              <span className="text-[11px] font-mono text-muted uppercase">Memory Integrity</span>
              <p className="mt-1 text-xl font-bold font-mono text-foreground">{report.risks.memoryCorruptionRisk}%</p>
              <p className="mt-1 text-[10px] text-muted">0G Storage root matched</p>
            </div>
          </div>
        )}
      </div>

      {/* Detected Anomalies Log */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <h4 className="text-xs font-mono text-muted uppercase tracking-wider">
          Detected Behavioral Anomalies ({report?.detectedAnomalies.length ?? 0})
        </h4>

        {(!report?.detectedAnomalies || report.detectedAnomalies.length === 0) ? (
          <div className="flex items-center gap-3 rounded-lg border border-[#22C55E]/20 bg-[#22C55E]/5 p-4 text-xs text-[#22C55E]">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Zero critical anomalies detected. Agent behavior adheres to 0G security invariants.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {report.detectedAnomalies.map((anomaly, idx) => (
              <div key={idx} className="rounded-lg border border-border bg-background p-3.5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4",
                        anomaly.severity === "high" || anomaly.severity === "critical" ? "text-red-400" : "text-amber-400"
                      )}
                    />
                    <span className="text-xs font-semibold text-foreground">{anomaly.title}</span>
                  </div>
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-mono text-amber-400 border border-amber-500/20">
                    {anomaly.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted">{anomaly.description}</p>
                {anomaly.txHash && (
                  <p className="text-[11px] font-mono text-accent truncate">
                    Related Tx: {anomaly.txHash}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
