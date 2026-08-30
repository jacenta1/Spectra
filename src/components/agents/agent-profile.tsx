"use client";

import { useState } from "react";
import { Agent } from "@/types/agent";
import { Activity } from "@/types/activity";
import { Address } from "@/components/common/address";
import { TxLink } from "@/components/common/tx-link";
import { StatusBadge } from "@/components/common/status-badge";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { AgentMemoryInspector } from "./agent-memory-inspector";
import { AnomalyScanner } from "./anomaly-scanner";
import { AgentSdkIntegration } from "./agent-sdk-integration";
import {
  Cpu,
  Layers,
  Clock,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  Code2,
  HardDrive,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNetwork } from "@/lib/context/network-context";

interface AgentProfileProps {
  agent: Agent;
  activities?: Activity[];
}

type TabType = "overview" | "memory" | "anomaly" | "sdk";

export function AgentProfile({ agent, activities = [] }: AgentProfileProps) {
  const { getExplorerAddressUrl } = useNetwork();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copied, setCopied] = useState(false);

  const copyMetadata = () => {
    if (!agent.metadata) return;
    navigator.clipboard.writeText(JSON.stringify(agent.metadata, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Agent Identity Header Card */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{agent.name}</h1>
              <StatusBadge status={agent.status} />
              <span className="rounded bg-border/60 px-2 py-0.5 text-xs font-mono text-muted">
                ERC-7857 #{agent.tokenId}
              </span>
            </div>
            {agent.metadata?.description && (
              <p className="text-sm text-muted max-w-2xl">{agent.metadata.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getExplorerAddressUrl(agent.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-mono text-muted hover:border-accent/40 hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              0G Explorer
            </a>
          </div>
        </div>

        {/* Multi-Tab Switcher */}
        <div className="mt-6 flex border-b border-border gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-2 pb-3 text-xs font-medium transition-colors relative",
              activeTab === "overview"
                ? "text-accent font-semibold border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            )}
          >
            <Cpu className="h-4 w-4" />
            Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab("memory")}
            className={cn(
              "flex items-center gap-2 pb-3 text-xs font-medium transition-colors relative",
              activeTab === "memory"
                ? "text-accent font-semibold border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            )}
          >
            <HardDrive className="h-4 w-4" />
            0G Storage Memory
          </button>
          <button
            onClick={() => setActiveTab("anomaly")}
            className={cn(
              "flex items-center gap-2 pb-3 text-xs font-medium transition-colors relative",
              activeTab === "anomaly"
                ? "text-accent font-semibold border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            )}
          >
            <ShieldAlert className="h-4 w-4" />
            AI Anomaly Audit
          </button>
          <button
            onClick={() => setActiveTab("sdk")}
            className={cn(
              "flex items-center gap-2 pb-3 text-xs font-medium transition-colors relative",
              activeTab === "sdk"
                ? "text-accent font-semibold border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            )}
          >
            <Terminal className="h-4 w-4" />
            SDK & Integration
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <span className="text-xs font-mono text-muted uppercase">Contract Address</span>
              <div className="mt-1">
                <Address address={agent.address} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <span className="text-xs font-mono text-muted uppercase">Owner / Controller</span>
              <div className="mt-1">
                <Address address={agent.owner} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <span className="text-xs font-mono text-muted uppercase">Total Transactions</span>
              <p className="mt-1 text-lg font-bold font-mono text-foreground">
                {agent.txCount.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <span className="text-xs font-mono text-muted uppercase">Compute Inferences</span>
              <p className="mt-1 text-lg font-bold font-mono text-foreground">
                {agent.computeCalls.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metadata Inspector (Left 2 cols) */}
            <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-semibold text-foreground">ERC-7857 On-Chain Metadata</h2>
                </div>
                {agent.metadata && (
                  <button
                    onClick={copyMetadata}
                    className="inline-flex items-center gap-1.5 rounded border border-border bg-background px-2.5 py-1 text-xs font-mono text-muted hover:text-foreground transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-[#22C55E]" />
                        <span className="text-[#22C55E]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {agent.metadata ? (
                <div className="rounded-md border border-border/80 bg-background/80 p-4 font-mono text-xs overflow-x-auto max-h-[380px]">
                  <pre className="text-foreground/90 leading-relaxed">
                    {JSON.stringify(agent.metadata, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-muted">
                  No extended on-chain metadata registered for this agent.
                </div>
              )}
            </div>

            {/* Execution Provenance (Right 1 col) */}
            <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold text-foreground">Execution Provenance</h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded border border-border/80 bg-background/50 p-3 space-y-1">
                  <span className="text-muted block text-[11px] uppercase font-mono">Model Engine</span>
                  <span className="font-mono text-foreground">{agent.metadata?.model || "Standard EVM Agent"}</span>
                </div>

                <div className="rounded border border-border/80 bg-background/50 p-3 space-y-1">
                  <span className="text-muted block text-[11px] uppercase font-mono">TEE Environment</span>
                  <span className="font-mono text-foreground">{agent.metadata?.teeType || "Intel SGX Enclave"}</span>
                </div>

                <div className="rounded border border-border/80 bg-background/50 p-3 space-y-1">
                  <span className="text-muted block text-[11px] uppercase font-mono">Agent Framework</span>
                  <span className="font-mono text-foreground">{agent.metadata?.framework || "0G Native"}</span>
                </div>

                <div className="rounded border border-border/80 bg-background/50 p-3 space-y-1">
                  <span className="text-muted block text-[11px] uppercase font-mono">Registered On</span>
                  <span className="font-mono text-foreground">
                    {new Date(agent.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed for this Agent */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Agent Transaction History</h2>
            <ActivityFeed activities={activities} emptyMessage="No transactions found for this agent." />
          </div>
        </div>
      )}

      {/* Tab 2: 0G Storage Memory */}
      {activeTab === "memory" && (
        <AgentMemoryInspector
          agentId={agent.id}
          storageRoot={agent.metadata?.storageRoot}
        />
      )}

      {/* Tab 3: AI Anomaly Audit */}
      {activeTab === "anomaly" && (
        <AnomalyScanner
          agentId={agent.id}
          agentName={agent.name}
          anomalyReport={agent.anomalyReport}
        />
      )}

      {/* Tab 4: SDK & Integration */}
      {activeTab === "sdk" && (
        <AgentSdkIntegration agent={agent} />
      )}
    </div>
  );
}
