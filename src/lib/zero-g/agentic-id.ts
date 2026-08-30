/**
 * Agentic ID (ERC-7857) resolver.
 * Reads agent identity data from 0G Chain's Agentic ID contracts.
 */

import { getClient } from "./chain";
import { AGENTIC_ID_CONTRACTS, AGENTIC_ID_ABI } from "./constants";
import type { Agent } from "@/types/agent";

/**
 * Get total supply of Agentic IDs (total agents deployed).
 */
export async function getTotalAgents(): Promise<number> {
  const registryAddress = AGENTIC_ID_CONTRACTS.registry as `0x${string}`;
  if (registryAddress === "0x0000000000000000000000000000000000000000") {
    return 0;
  }

  try {
    const client = getClient();
    const result = await client.readContract({
      address: registryAddress,
      abi: AGENTIC_ID_ABI,
      functionName: "totalSupply",
    });
    return Number(result);
  } catch {
    console.error("Failed to read totalSupply");
    return 0;
  }
}

/**
 * Get owner of a specific Agentic ID token.
 */
export async function getAgentOwner(tokenId: bigint): Promise<string | null> {
  const registryAddress = AGENTIC_ID_CONTRACTS.registry as `0x${string}`;
  if (registryAddress === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  try {
    const client = getClient();
    const result = await client.readContract({
      address: registryAddress,
      abi: AGENTIC_ID_ABI,
      functionName: "ownerOf",
      args: [tokenId],
    });
    return result as string;
  } catch {
    return null;
  }
}

/**
 * Get token URI (metadata location) for an Agentic ID.
 */
export async function getAgentTokenURI(tokenId: bigint): Promise<string | null> {
  const registryAddress = AGENTIC_ID_CONTRACTS.registry as `0x${string}`;
  if (registryAddress === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  try {
    const client = getClient();
    const result = await client.readContract({
      address: registryAddress,
      abi: AGENTIC_ID_ABI,
      functionName: "tokenURI",
      args: [tokenId],
    });
    return result as string;
  } catch {
    return null;
  }
}
