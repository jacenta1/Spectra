"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/common/stat-card";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ActivityChart } from "@/components/charts/activity-chart";
import { AgentList } from "@/components/agents/agent-list";
import { Bot, Activity, Zap, BarChart3, AlertTriangle } from "lucide-react";
import { useNetwork } from "@/lib/context/network-context";
import type { AgentSummary, AgentStats } from "@/types/agent";
import type { Activity as ActivityType } from "@/types/activity";

export function DashboardContent() {
  const { activeChain, isMainnet } = useNetwork();
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [agentsRes, activityRes] = await Promise.all([
          fetch("/api/agents"),
          fetch("/api/activity"),
        ]);

        const agentsData = await agentsRes.json();
        const activityData = await activityRes.json();

        setAgents(agentsData.agents || []);
        setStats(agentsData.stats || null);
        setActivities(activityData.activities || []);
        setIsDemo(agentsData.demo || false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[100px] rounded-lg skeleton" />
          ))}
        </div>
        <div className="h-[400px] rounded-lg skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live 0G Network Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22C55E]" />
          </span>
          <div>
            <span className="text-xs font-mono font-semibold text-foreground">
              0G Chain Live Indexer Connected
            </span>
            <p className="text-[11px] text-muted font-mono">
              Network: {activeChain.name} (Chain ID {activeChain.id}) • RPC: {activeChain.rpcUrl.replace("https://", "")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto text-xs font-mono">
          <span className="rounded bg-surface px-2.5 py-1 text-muted border border-border">
            Status: <span className="text-[#22C55E] font-semibold">Active</span>
          </span>
          <a
            href={activeChain.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded bg-accent/10 px-2.5 py-1 text-accent hover:bg-accent/20 transition-colors border border-accent/20"
          >
            0G {isMainnet ? "Mainnet" : "Newton"} Chainscan →
          </a>
        </div>
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">0G Agent Observability Dashboard</h1>
        <p className="text-sm text-muted mt-1">
          Real-time decentralized telemetry, memory inspection, and cryptographic verification for autonomous AI agents on 0G.
        </p>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Agents"
            value={stats.totalAgents}
            icon={<Bot className="h-4 w-4" />}
          />
          <StatCard
            label="Active Agents"
            value={stats.activeAgents}
            icon={<Activity className="h-4 w-4" />}
            change={`${Math.round((stats.activeAgents / Math.max(stats.totalAgents, 1)) * 100)}%`}
          />
          <StatCard
            label="Total Transactions"
            value={stats.totalTransactions.toLocaleString()}
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <StatCard
            label="Compute Calls"
            value={stats.totalComputeCalls.toLocaleString()}
            icon={<Zap className="h-4 w-4" />}
          />
        </div>
      )}

      {/* Network Activity Chart */}
      <ActivityChart />

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity feed -- 2 cols */}
        <div className="lg:col-span-2">
          <ActivityFeed
            activities={activities.slice(0, 15)}
            title="Recent Activity"
          />
        </div>

        {/* Top agents -- 1 col */}
        <div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="text-sm font-medium text-muted mb-4">
              Most Active Agents
            </h2>
            <div className="space-y-3">
              {agents
                .sort((a, b) => b.txCount - a.txCount)
                .slice(0, 5)
                .map((agent) => (
                  <a
                    key={agent.id}
                    href={`/agents/${agent.id}`}
                    className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-surface-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-muted font-mono">
                          {agent.txCount.toLocaleString()} txns
                        </p>
                      </div>
                    </div>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        agent.status === "active" ? "bg-success" : "bg-muted"
                      }`}
                    />
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
