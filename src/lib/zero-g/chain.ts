/**
 * 0G Chain client using viem.
 * Reads agent data directly from 0G Chain -- no wrappers, genuine on-chain queries.
 */

import { createPublicClient, http, type PublicClient, type Log } from "viem";
import { ACTIVE_CHAIN, AGENTIC_ID_ABI, AGENTIC_ID_CONTRACTS, SCAN_CONFIG } from "./constants";
import type { Agent, AgentSummary } from "@/types/agent";
import type { Activity, ActivityType } from "@/types/activity";

// Define 0G Chain for viem
const zeroGChain = {
  id: ACTIVE_CHAIN.id,
  name: ACTIVE_CHAIN.name,
  nativeCurrency: ACTIVE_CHAIN.nativeCurrency,
  rpcUrls: {
    default: { http: [ACTIVE_CHAIN.rpcUrl] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: ACTIVE_CHAIN.explorerUrl },
  },
} as const;

/** Create a viem public client for 0G Chain */
export function createZeroGClient(): PublicClient {
  return createPublicClient({
    chain: zeroGChain,
    transport: http(ACTIVE_CHAIN.rpcUrl),
  }) as PublicClient;
}

// Singleton client
let client: PublicClient | null = null;
export function getClient(): PublicClient {
  if (!client) {
    client = createZeroGClient();
  }
  return client;
}

/**
 * Get the current block number on 0G Chain.
 */
export async function getCurrentBlock(): Promise<bigint> {
  const c = getClient();
  return c.getBlockNumber();
}

/**
 * Scan for Agentic ID mint events (Transfer from 0x0).
 * Each mint = a new agent deployed on 0G.
 */
export async function scanAgentMints(
  fromBlock: bigint,
  toBlock: bigint
): Promise<Log[]> {
  const c = getClient();
  const registryAddress = AGENTIC_ID_CONTRACTS.registry as `0x${string}`;
  
  if (registryAddress === "0x0000000000000000000000000000000000000000") {
    // Registry not configured -- return empty (will use demo data)
    return [];
  }

  try {
    const logs = await c.getLogs({
      address: registryAddress,
      event: {
        type: "event",
        name: "Transfer",
        inputs: [
          { name: "from", type: "address", indexed: true },
          { name: "to", type: "address", indexed: true },
          { name: "tokenId", type: "uint256", indexed: true },
        ],
      },
      args: {
        from: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      },
      fromBlock,
      toBlock,
    });
    return logs;
  } catch {
    console.error("Failed to scan agent mints");
    return [];
  }
}

/**
 * Get recent transactions for a specific address.
 */
export async function getRecentTransactions(
  address: string,
  blockCount = 1000n
): Promise<Activity[]> {
  const c = getClient();
  const currentBlock = await c.getBlockNumber();
  const fromBlock = currentBlock > blockCount ? currentBlock - blockCount : 0n;

  try {
    const block = await c.getBlock({ blockNumber: currentBlock, includeTransactions: true });
    const txs = (block.transactions || [])
      .filter(
        (tx: any) =>
          typeof tx === "object" &&
          (tx.from?.toLowerCase() === address.toLowerCase() ||
            tx.to?.toLowerCase() === address.toLowerCase())
      )
      .map((tx: any) => {
        if (typeof tx === "string") return null;
        return {
          id: tx.hash,
          agentId: address,
          agentName: "",
          txHash: tx.hash,
          blockNumber: Number(tx.blockNumber || currentBlock),
          type: classifyTransaction(tx.input || "0x", tx.to || ""),
          from: tx.from,
          to: tx.to || "",
          value: tx.value?.toString() || "0",
          status: "success" as const,
          data: {},
          timestamp: new Date().toISOString(),
        };
      })
      .filter(Boolean) as Activity[];

    return txs;
  } catch {
    console.error("Failed to get recent transactions for", address);
    return [];
  }
}

/**
 * Get chain statistics: block number, gas price, etc.
 */
export async function getChainStats() {
  const c = getClient();
  try {
    const [blockNumber, gasPrice] = await Promise.all([
      c.getBlockNumber(),
      c.getGasPrice(),
    ]);
    return {
      blockNumber: Number(blockNumber),
      gasPrice: gasPrice.toString(),
      chainId: ACTIVE_CHAIN.id,
      chainName: ACTIVE_CHAIN.name,
    };
  } catch {
    return {
      blockNumber: 0,
      gasPrice: "0",
      chainId: ACTIVE_CHAIN.id,
      chainName: ACTIVE_CHAIN.name,
    };
  }
}

/**
 * Classify a transaction by its input data / target contract.
 */
function classifyTransaction(input: string, to: string): ActivityType {
  if (input === "0x" || input.length <= 2) return "transfer";
  
  // Common function signatures
  const sig = input.slice(0, 10).toLowerCase();
  
  // ERC-721 transferFrom / safeTransferFrom
  if (sig === "0x23b872dd" || sig === "0x42842e0e") return "transfer";
  // Mint signatures
  if (sig === "0x40c10f19" || sig === "0xa0712d68") return "mint";
  
  // If interacting with known compute/storage contracts, classify accordingly
  // This will be expanded as we discover actual contract signatures
  return "contract_call";
}
