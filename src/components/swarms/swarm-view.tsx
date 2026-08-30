"use client";

import { useState } from "react";
import { DEMO_SWARM_NODES, DEMO_SWARM_LINKS, SwarmNode } from "@/lib/demo-data";
import { Address } from "@/components/common/address";
import { StatusBadge } from "@/components/common/status-badge";
import { Network, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SwarmView() {
  const [selectedNode, setSelectedNode] = useState<SwarmNode>(DEMO_SWARM_NODES[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Multi-Agent Swarm Topology</h1>
        <p className="text-xs text-muted">Coordination matrix, sub-agent communication topology, and collective capital routing across 0G DA and Chain.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded border border-border bg-surface p-3"><span className="text-[11px] font-mono text-muted uppercase">Coordinated Agents</span><p className="mt-0.5 text-xl font-bold font-mono text-foreground">{DEMO_SWARM_NODES.length}</p></div>
        <div className="rounded border border-border bg-surface p-3"><span className="text-[11px] font-mono text-muted uppercase">Inter-Agent Links</span><p className="mt-0.5 text-xl font-bold font-mono text-foreground">{DEMO_SWARM_LINKS.length}</p></div>
        <div className="rounded border border-border bg-surface p-3"><span className="text-[11px] font-mono text-muted uppercase">Total Throughput</span><p className="mt-0.5 text-xl font-bold font-mono text-accent">725 msg/min</p></div>
        <div className="rounded border border-border bg-surface p-3"><span className="text-[11px] font-mono text-muted uppercase">Mean Latency (0G DA)</span><p className="mt-0.5 text-xl font-bold font-mono text-[#22C55E]">38 ms</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 rounded-lg border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2"><Network className="h-4 w-4 text-accent" /><h3 className="text-xs font-semibold uppercase font-mono text-foreground">Swarm Agent Nodes</h3></div>
            <span className="text-[11px] font-mono text-muted">Click node to inspect</span>
          </div>

          <div className="space-y-2.5">
            {DEMO_SWARM_NODES.map(node => {
              const isSelected = selectedNode.id === node.id;
              const isCoordinator = node.role === "coordinator";
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={cn("cursor-pointer rounded border p-3 transition-all", isSelected ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-background hover:border-border/80", !isCoordinator && "ml-4 sm:ml-6")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{node.name}</span>
                        <span className={cn("rounded px-1.5 py-0.2 text-[10px] font-mono", node.role === "coordinator" && "bg-blue-500/10 text-blue-400 border border-blue-500/20", node.role === "executor" && "bg-purple-500/10 text-purple-400 border border-purple-500/20", node.role === "verifier" && "bg-green-500/10 text-green-400 border border-green-500/20", node.role === "storage_indexer" && "bg-amber-500/10 text-amber-400 border border-amber-500/20")}>{node.role.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-muted"><span>Tasks: {node.activeTasks} active</span><span>•</span><span>Heartbeat: {node.lastHeartbeat}</span></div>
                    </div>
                    <StatusBadge status={node.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase font-mono text-foreground">Node Details</h3>
            <div className="space-y-2.5 text-xs font-mono">
              <div><span className="text-muted block text-[11px] mb-0.5">Agent Address:</span><div className="rounded bg-background p-2 border border-border"><Address address={selectedNode.agentAddress} /></div></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-background p-2.5 border border-border"><span className="text-muted block text-[10px] uppercase">Lifetime Txns</span><span className="text-sm font-bold text-foreground mt-0.5 block">{selectedNode.txCount.toLocaleString()}</span></div>
                <div className="rounded bg-background p-2.5 border border-border"><span className="text-muted block text-[10px] uppercase">Active Queue</span><span className="text-sm font-bold text-accent mt-0.5 block">{selectedNode.activeTasks} tasks</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase font-mono text-foreground">Active 0G DA Message Pipes</h3>
            <div className="space-y-1.5">
              {DEMO_SWARM_LINKS.map((link, idx) => (
                <div key={idx} className="rounded border border-border/80 bg-background p-2 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><span className="text-foreground">{link.source}</span><ArrowRight className="h-3 w-3 text-muted" /><span className="text-foreground">{link.target}</span></div>
                  <div className="text-right"><span className="text-accent">{link.messagesPerMin} msg/m</span><span className="text-muted text-[10px] block">{link.avgLatencyMs}ms</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
