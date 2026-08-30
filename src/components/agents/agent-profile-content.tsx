"use client";

import { useEffect, useState } from "react";
import { AgentProfile } from "@/components/agents/agent-profile";
import type { Agent } from "@/types/agent";
import { getDemoAgent } from "@/lib/demo-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  agentId: string;
}

export function AgentProfileContent({ agentId }: Props) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgent() {
      try {
        const res = await fetch(`/api/agents?id=${agentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.agent) {
            setAgent(data.agent);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local demo data
      }
      const demoAgent = getDemoAgent(agentId);
      setAgent(demoAgent || null);
      setLoading(false);
    }
    loadAgent();
  }, [agentId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-lg skeleton" />
        <div className="h-[300px] rounded-lg skeleton" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Agent Not Found</h2>
        <p className="text-muted mb-4">
          No agent found with ID &quot;{agentId}&quot;
        </p>
        <Link
          href="/agents"
          className="flex items-center gap-2 text-sm text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Agents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/agents"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Agents
      </Link>
      <AgentProfile agent={agent} />
    </div>
  );
}
