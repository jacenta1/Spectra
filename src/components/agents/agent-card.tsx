import Link from "next/link";
import { Bot, Clock, Activity, User } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { cn, truncateAddress, timeAgo } from "@/lib/utils";
import type { AgentSummary } from "@/types/agent";

export interface AgentCardProps {
  agent: AgentSummary;
  className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className={cn(
        "group block rounded-lg border border-border bg-surface p-5 transition-colors hover:border-[#3F3F46]",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header: Agent Bot icon, Name, Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3
                className="truncate text-base font-bold text-white group-hover:text-accent transition-colors"
                title={agent.name}
              >
                {agent.name}
              </h3>
              <div
                className="flex items-center gap-1.5 text-xs text-muted mt-0.5"
                title={`Owner: ${agent.owner}`}
              >
                <User className="h-3 w-3 shrink-0" />
                <span className="font-mono text-muted">
                  {truncateAddress(agent.owner)}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={agent.status} className="shrink-0" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border/60" />

        {/* Footer: Tx Count & Last Active Time */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted">
            <Activity className="h-3.5 w-3.5 text-muted shrink-0" />
            <span>
              <span className="font-mono font-medium text-foreground">
                {agent.txCount.toLocaleString()}
              </span>{" "}
              txs
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted">
            <Clock className="h-3.5 w-3.5 text-muted shrink-0" />
            <span className="font-mono">{timeAgo(agent.lastActiveAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
