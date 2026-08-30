import { Bot } from "lucide-react";
import { AgentCard } from "@/components/agents/agent-card";
import { cn } from "@/lib/utils";
import type { AgentSummary } from "@/types/agent";

export interface AgentListProps {
  agents: AgentSummary[];
  className?: string;
}

export function AgentList({ agents, className }: AgentListProps) {
  if (!agents || agents.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-border border-dashed bg-surface/40 p-12 text-center",
          className
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover text-muted mb-4 border border-border">
          <Bot className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No agents found</h3>
        <p className="mt-1.5 text-sm text-muted max-w-sm">
          No registered agents match your current query or none have been deployed yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
