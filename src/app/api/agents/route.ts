import { NextRequest, NextResponse } from "next/server";
import { getDemoAgentSummaries, getDemoStats, getDemoAgent } from "@/lib/demo-data";
import { getChainStats } from "@/lib/zero-g/chain";
import { getTotalAgents } from "@/lib/zero-g/agentic-id";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("id");

    if (agentId) {
      const agent = getDemoAgent(agentId);
      if (!agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }
      return NextResponse.json({ agent });
    }

    const chainStats = await getChainStats();
    const onChainAgentCount = await getTotalAgents();

    const agents = getDemoAgentSummaries();
    const stats = getDemoStats();

    return NextResponse.json({
      agents,
      stats: {
        ...stats,
        totalAgents: onChainAgentCount > 0 ? onChainAgentCount : stats.totalAgents,
      },
      chain: chainStats,
      liveOnChain: chainStats.blockNumber > 0,
    });
  } catch (error) {
    console.error("Failed to fetch agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}
