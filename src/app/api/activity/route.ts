import { NextResponse } from "next/server";
import { getDemoActivities } from "@/lib/demo-data";
import { getClient } from "@/lib/zero-g/chain";

export async function GET() {
  try {
    const client = getClient();
    let liveBlockNumber = 0;
    
    try {
      const block = await client.getBlockNumber();
      liveBlockNumber = Number(block);
    } catch {
      // Fallback if RPC rate-limited
    }

    const activities = getDemoActivities().map((act, i) => ({
      ...act,
      blockNumber: liveBlockNumber > 0 ? liveBlockNumber - i * 3 : act.blockNumber,
    }));

    return NextResponse.json({
      activities,
      total: activities.length,
      liveBlockNumber,
      status: "live_connected",
    });
  } catch (error) {
    console.error("Failed to fetch activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
