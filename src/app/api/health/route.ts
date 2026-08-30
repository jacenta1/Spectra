import { NextResponse } from "next/server";
import { getChainStats } from "@/lib/zero-g/chain";
import { checkComputeStatus } from "@/lib/zero-g/compute";
import { checkStorageStatus } from "@/lib/zero-g/storage";

export async function GET() {
  try {
    const [chain, compute, storage] = await Promise.all([
      getChainStats(),
      checkComputeStatus(),
      checkStorageStatus(),
    ]);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        chain: {
          connected: chain.blockNumber > 0,
          blockNumber: chain.blockNumber,
          chainName: chain.chainName,
        },
        compute: {
          configured: compute.configured,
          reachable: compute.reachable,
        },
        storage: {
          configured: !!storage.status,
          reachable: storage.connected,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: String(error) },
      { status: 500 }
    );
  }
}
