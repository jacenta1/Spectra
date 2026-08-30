"use client";

import { useState } from "react";
import { Play, Terminal, HardDrive, Cpu, ShieldCheck, Network, CheckCircle2, RotateCw, Copy, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNetwork } from "@/lib/context/network-context";

type SimAction = "storage" | "inference" | "anomaly" | "swarm";
interface SimLog {
  time: string;
  lvl: "info" | "success" | "warn" | "error";
  mod: "0G CHAIN" | "0G STORAGE" | "0G COMPUTE" | "0G DA SWARM";
  msg: string;
}

export function PlaygroundDashboard() {
  const { activeChain } = useNetwork();
  const [action, setAction] = useState<SimAction>("storage");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [logs, setLogs] = useState<SimLog[]>([
    { time: new Date().toLocaleTimeString(), lvl: "info", mod: "0G CHAIN", msg: `Simulator ready on ${activeChain.name} (Chain ID: ${activeChain.id})` }
  ]);
  const [result, setResult] = useState<Record<string, any> | null>(null);

  const [agentAddr, setAgentAddr] = useState("0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");
  const [agentId, setAgentId] = useState("1");
  const [memContext, setMemContext] = useState("AlphaTrade alpha strategy v3 - target pool ETH/USDT on 0G DEX");
  const [prompt, setPrompt] = useState("Optimize execution routing for arbitrage swap across 0G liquidity pairs");
  const [risk, setRisk] = useState<"low" | "medium" | "high">("low");

  const addLog = (log: SimLog) => setLogs(p => [log, ...p]);
  const randHex = (len: number) => "0x" + Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join("");

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = async () => {
    setRunning(true);
    const t = new Date().toLocaleTimeString();

    if (action === "storage") {
      addLog({ time: t, lvl: "info", mod: "0G STORAGE", msg: "Encoding context payload into 256-bit leaf hashes..." });
      await new Promise(r => setTimeout(r, 400));
      const sRoot = randHex(64), lHash = randHex(64), tx = randHex(64);
      addLog({ time: new Date().toLocaleTimeString(), lvl: "success", mod: "0G STORAGE", msg: `Memory block committed to 0G Storage Indexer. Root: ${sRoot.slice(0, 14)}...` });
      setResult({ action: "0G Storage Memory Commit", status: "COMMITTED", network: activeChain.name, chainId: activeChain.id, agentAddr, agentId, storageRoot: sRoot, leafHash: lHash, proofPath: ["0x1f92...a8c2", "0x89b1...440e"], leafIndex: 2, timestamp: new Date().toISOString() });
    } else if (action === "inference") {
      addLog({ time: t, lvl: "info", mod: "0G COMPUTE", msg: "Routing inference to 0G Compute Router (DeepSeek-R1 / Qwen-2.5)..." });
      await new Promise(r => setTimeout(r, 500));
      addLog({ time: new Date().toLocaleTimeString(), lvl: "success", mod: "0G COMPUTE", msg: "TEE Intel SGX enclave quote verified. Settlement tx confirmed." });
      setResult({ action: "0G Verifiable Compute Inference", status: "VERIFIED", model: "DeepSeek-R1-Distill-Qwen-32B", tee: "Intel SGX / Gramine", teeSignature: randHex(48), settlementTx: randHex(64), latencyMs: 380, timestamp: new Date().toISOString() });
    } else if (action === "anomaly") {
      addLog({ time: t, lvl: "info", mod: "0G COMPUTE", msg: "Initiating agent behavioral anomaly safety scan..." });
      await new Promise(r => setTimeout(r, 400));
      const score = risk === "low" ? 96 : risk === "medium" ? 72 : 38;
      addLog({ time: new Date().toLocaleTimeString(), lvl: risk === "high" ? "error" : "success", mod: "0G COMPUTE", msg: risk === "high" ? "ALERT: Capital slippage anomaly detected (>4.5%)" : `Safety audit passed. Score: ${score}/100` });
      setResult({ action: "AI Safety & Anomaly Audit", status: risk === "low" ? "SAFE" : risk === "medium" ? "WARNING" : "CRITICAL", safetyScore: score, riskLevel: risk.toUpperCase(), findings: risk === "high" ? ["High slippage tolerance detected", "Potential reentrancy loop"] : ["Invariants nominal"], timestamp: new Date().toISOString() });
    } else {
      addLog({ time: t, lvl: "info", mod: "0G DA SWARM", msg: "Broadcasting coordination packet across 0G DA layer..." });
      await new Promise(r => setTimeout(r, 400));
      addLog({ time: new Date().toLocaleTimeString(), lvl: "success", mod: "0G DA SWARM", msg: "3 sub-agents synchronized state root via 0G DA blob." });
      setResult({ action: "0G DA Swarm Coordination", status: "SYNCHRONIZED", parent: agentAddr, topology: "Hierarchical Mesh", nodes: 4, daBlobId: "0xda_" + randHex(32), timestamp: new Date().toISOString() });
    }
    setRunning(false);
  };

  const tabs: { key: SimAction; label: string; icon: any }[] = [
    { key: "storage", label: "1. 0G Storage Memory", icon: HardDrive },
    { key: "inference", label: "2. 0G Compute TEE", icon: Cpu },
    { key: "anomaly", label: "3. Safety & Anomaly Audit", icon: ShieldCheck },
    { key: "swarm", label: "4. 0G DA Swarm Sync", icon: Network },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-accent/20 text-accent"><Zap className="h-4 w-4" /></div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">0G Agent Sandbox & Interactive Simulator</h1>
            </div>
            <p className="text-xs text-muted">Simulate autonomous agent memory commitments, verifiable compute inferences, and real-time safety scans.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-mono text-muted self-start">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />{activeChain.name}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setAction(t.key)}
              className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors", action === t.key ? "bg-accent text-white font-semibold shadow-sm" : "text-muted hover:bg-background hover:text-foreground")}
            >
              <t.icon className="h-3.5 w-3.5" />{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-lg border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-xs font-mono font-semibold uppercase text-foreground">Simulation Parameters</h2>
            <span className="text-[11px] font-mono text-muted">Mode: {action.toUpperCase()}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted block text-[11px] mb-1 font-mono">Agent Contract Address</label>
              <input type="text" value={agentAddr} onChange={e => setAgentAddr(e.target.value)} className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-foreground focus:border-accent focus:outline-none" />
            </div>
            <div>
              <label className="text-muted block text-[11px] mb-1 font-mono">ERC-7857 Token ID</label>
              <input type="text" value={agentId} onChange={e => setAgentId(e.target.value)} className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-foreground focus:border-accent focus:outline-none" />
            </div>

            {action === "storage" && (
              <div>
                <label className="text-muted block text-[11px] mb-1 font-mono">Context Payload</label>
                <textarea rows={3} value={memContext} onChange={e => setMemContext(e.target.value)} className="w-full rounded border border-border bg-background p-2.5 font-mono text-foreground focus:border-accent focus:outline-none text-xs" />
              </div>
            )}
            {action === "inference" && (
              <div>
                <label className="text-muted block text-[11px] mb-1 font-mono">Prompt for 0G Compute</label>
                <textarea rows={3} value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full rounded border border-border bg-background p-2.5 font-mono text-foreground focus:border-accent focus:outline-none text-xs" />
              </div>
            )}
            {action === "anomaly" && (
              <div>
                <label className="text-muted block text-[11px] mb-1 font-mono">Simulate Risk Scenario</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setRisk(l)}
                      className={cn("rounded border py-1.5 text-xs font-mono uppercase transition-colors", risk === l ? (l === "high" ? "border-[#EF4444] bg-[#EF4444]/20 text-[#EF4444] font-bold" : l === "medium" ? "border-[#F59E0B] bg-[#F59E0B]/20 text-[#F59E0B] font-bold" : "border-[#22C55E] bg-[#22C55E]/20 text-[#22C55E] font-bold") : "border-border bg-background text-muted hover:text-foreground")}
                    >
                      {l} Risk
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleSimulate}
              disabled={running}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-medium text-white shadow hover:bg-accent/90 transition-all disabled:opacity-50"
            >
              {running ? <><RotateCw className="h-4 w-4 animate-spin" /><span>Executing...</span></> : <><Play className="h-4 w-4 fill-white" /><span>Run Live Simulation</span></>}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-lg border border-border bg-[#0D0E11] p-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-muted"><Terminal className="h-3.5 w-3.5 text-accent" /><span>0G Simulator Logs</span></div>
              <button onClick={() => { setLogs([]); setResult(null); }} className="text-[10px] font-mono text-muted hover:text-foreground">Clear</button>
            </div>
            <div className="h-44 overflow-y-auto space-y-1.5 font-mono text-xs pr-2 scrollbar-thin">
              {logs.map((l, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-muted/60 text-[10px] select-none">{l.time}</span>
                  <span className={cn("px-1 rounded text-[10px] font-semibold select-none shrink-0", l.mod === "0G CHAIN" && "bg-blue-500/20 text-blue-400", l.mod === "0G STORAGE" && "bg-purple-500/20 text-purple-400", l.mod === "0G COMPUTE" && "bg-emerald-500/20 text-emerald-400", l.mod === "0G DA SWARM" && "bg-amber-500/20 text-amber-400")}>{l.mod}</span>
                  <span className={cn("text-xs break-all", l.lvl === "info" && "text-foreground/80", l.lvl === "success" && "text-[#22C55E]", l.lvl === "warn" && "text-[#F59E0B]", l.lvl === "error" && "text-[#EF4444]")}>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {result && (
            <div className="rounded-lg border border-accent/40 bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#22C55E]" /><h3 className="text-xs font-semibold text-foreground">Verified Simulation Artifact</h3></div>
                <button onClick={handleCopy} className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-0.5 text-[11px] font-mono text-muted hover:text-foreground">
                  {copied ? <><Check className="h-3 w-3 text-[#22C55E]" /><span className="text-[#22C55E]">Copied</span></> : <><Copy className="h-3 w-3" /><span>Copy JSON</span></>}
                </button>
              </div>
              <div className="rounded bg-background p-3 font-mono text-xs max-h-48 overflow-y-auto">
                <pre className="text-accent leading-relaxed">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
