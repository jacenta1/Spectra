import { Agent, AgentSummary, AgentStats } from "@/types/agent";
import { Activity } from "@/types/activity";
import { AgentMemoryBlock } from "./zero-g/storage";

export interface VerificationProofItem {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  txHash: string;
  blockNumber: number;
  teeType: string;
  enclaveSignature: string;
  storageRoot: string;
  dataHash: string;
  leafIndex: number;
  merkleProof: string[];
  status: "verified" | "invalid_signature" | "merkle_mismatch";
  verifiedAt: string;
  executionTrace: {
    step: string;
    target: string;
    gasUsed: number;
    status: "success" | "reverted";
  }[];
}

export interface SwarmNode {
  id: string;
  name: string;
  role: "coordinator" | "executor" | "verifier" | "storage_indexer";
  agentAddress: string;
  status: "active" | "idle" | "error";
  parentAgentId?: string;
  txCount: number;
  activeTasks: number;
  lastHeartbeat: string;
}

export interface SwarmLink {
  source: string;
  target: string;
  protocol: "grpc" | "0g_da" | "on_chain_event";
  messagesPerMin: number;
  avgLatencyMs: number;
}

export const DEMO_AGENTS: Agent[] = [
  {
    id: "agent-001",
    tokenId: "1",
    address: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    owner: "0x71C84183E3462b79b096E8729541DF2A3c29994E",
    name: "Sentinel Alpha",
    status: "active",
    createdAt: "2026-08-15T10:30:00Z",
    lastActive: "2026-08-23T14:15:00Z",
    txCount: 1420,
    computeCalls: 890,
    storageUsageBytes: 48500000,
    metadataUri: "https://indexer-storage-testnet-turbo.0g.ai/inspect/0x3a4f89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    metadata: {
      description: "Autonomous liquidity management agent executing verifiable delta-neutral strategies on 0G DEXs.",
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
      creator: "Spectra Labs",
      framework: "ElizaOS / 0G Compute",
      version: "2.4.0",
      capabilities: ["defi_execution", "verifiable_inference", "storage_persistence"],
      storageRoot: "0x3a4f89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
      memoryRoot: "0x7b1c4e2a9d8f3e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f0a",
      computeNode: "0g-node-sg-04",
      teeType: "Intel SGX / Gramine",
    },
    anomalyReport: {
      overallScore: 8,
      status: "nominal",
      lastScanned: "2026-08-23T14:10:00Z",
      risks: {
        reentrancyRisk: 4,
        capitalOutflowRisk: 9,
        memoryCorruptionRisk: 3,
        promptInjectionRisk: 12,
      },
      detectedAnomalies: [
        {
          severity: "low",
          title: "Slight Slippage Variance",
          description: "Execution slippage exceeded historical 5m median by 0.18% during swap routing.",
          timestamp: "2026-08-23T13:42:00Z",
          txHash: "0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
        },
      ],
    },
  },
  {
    id: "agent-002",
    tokenId: "2",
    address: "0x2e987A656a7c1A541b632924A23467B92A2810C2",
    owner: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    name: "Nexus Oracle",
    status: "active",
    createdAt: "2026-08-16T14:20:00Z",
    lastActive: "2026-08-23T14:30:00Z",
    txCount: 3840,
    computeCalls: 2150,
    storageUsageBytes: 124000000,
    metadataUri: "https://indexer-storage-testnet-turbo.0g.ai/inspect/0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
    metadata: {
      description: "Verifiable multi-source data aggregation oracle pushing verified price feeds to 0G Chain.",
      model: "meta-llama/Llama-3.3-70B-Instruct",
      creator: "Nexus Protocol",
      framework: "LangChain / 0G Storage",
      version: "1.8.2",
      capabilities: ["oracle_feeds", "cryptographic_attestation", "storage_archival"],
      storageRoot: "0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
      memoryRoot: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      computeNode: "0g-node-us-01",
      teeType: "AMD SEV-SNP",
    },
    anomalyReport: {
      overallScore: 14,
      status: "nominal",
      lastScanned: "2026-08-23T14:25:00Z",
      risks: {
        reentrancyRisk: 2,
        capitalOutflowRisk: 5,
        memoryCorruptionRisk: 8,
        promptInjectionRisk: 21,
      },
      detectedAnomalies: [],
    },
  },
  {
    id: "agent-003",
    tokenId: "3",
    address: "0x5a1B68b0c8d19F86aE421153835698b6A18d96fE",
    owner: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    name: "Aether Auditor",
    status: "idle",
    createdAt: "2026-08-18T09:00:00Z",
    lastActive: "2026-08-23T11:45:00Z",
    txCount: 412,
    computeCalls: 310,
    storageUsageBytes: 18200000,
    metadataUri: "https://indexer-storage-testnet-turbo.0g.ai/inspect/0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    metadata: {
      description: "Continuous on-chain smart contract security scanner and invariant validator on 0G.",
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      creator: "Aether Sec",
      framework: "Rig / 0G Chain",
      version: "3.1.0",
      capabilities: ["security_scanning", "bytecode_decompilation", "invariant_testing"],
      storageRoot: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      memoryRoot: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
      computeNode: "0g-node-eu-02",
      teeType: "Intel SGX",
    },
    anomalyReport: {
      overallScore: 3,
      status: "nominal",
      lastScanned: "2026-08-23T11:40:00Z",
      risks: {
        reentrancyRisk: 1,
        capitalOutflowRisk: 1,
        memoryCorruptionRisk: 2,
        promptInjectionRisk: 5,
      },
      detectedAnomalies: [],
    },
  },
  {
    id: "agent-004",
    tokenId: "4",
    address: "0x9A48888b135f6064f2F43f5244F7499f57E52516",
    owner: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    name: "Cipher Swarm Executor",
    status: "active",
    createdAt: "2026-08-20T16:45:00Z",
    lastActive: "2026-08-23T14:32:00Z",
    txCount: 5210,
    computeCalls: 3410,
    storageUsageBytes: 98400000,
    metadataUri: "https://indexer-storage-testnet-turbo.0g.ai/inspect/0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e",
    metadata: {
      description: "Sub-second autonomous execution agent coordinating multi-agent tasks on 0G DA.",
      model: "mistralai/Mistral-Small-24B-Instruct-2501",
      creator: "Cipher Labs",
      framework: "CrewAI / 0G Storage",
      version: "0.9.4",
      capabilities: ["swarm_execution", "parallel_routing", "storage_indexer"],
      storageRoot: "0x4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e",
      memoryRoot: "0x5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d",
      computeNode: "0g-node-ap-03",
      teeType: "NVIDIA H100 Confidential Compute",
    },
    anomalyReport: {
      overallScore: 28,
      status: "low_risk",
      lastScanned: "2026-08-23T14:30:00Z",
      risks: {
        reentrancyRisk: 14,
        capitalOutflowRisk: 34,
        memoryCorruptionRisk: 18,
        promptInjectionRisk: 22,
      },
      detectedAnomalies: [
        {
          severity: "medium",
          title: "High Frequency Gas Burst",
          description: "Executed 48 sub-agent coordination calls in under 12 seconds.",
          timestamp: "2026-08-23T14:18:00Z",
          txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        },
      ],
    },
  },
];

export const DEMO_MEMORY_BLOCKS: Record<string, AgentMemoryBlock[]> = {
  "agent-001": [
    {
      id: "mem-001",
      agentId: "agent-001",
      type: "vector_context",
      title: "DEX Pool Liquidity Depth Vector",
      description: "High-dimensional embedding representation of Uniswap V3 on 0G tick liquidity distribution.",
      dataHash: "0x98a7b6c5d4e3f2a10b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a",
      storageRoot: "0x3a4f89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
      sizeBytes: 1048576,
      leafIndex: 0,
      merkleProof: [
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      ],
      timestamp: "2026-08-23T14:05:00Z",
      verified: true,
    },
    {
      id: "mem-002",
      agentId: "agent-001",
      type: "long_term",
      title: "Historical Strategy Parameter State",
      description: "Optimized volatility bounds and target rebalance triggers across 4,200 past epochs.",
      dataHash: "0x87b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6",
      storageRoot: "0x3a4f89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
      sizeBytes: 4194304,
      leafIndex: 1,
      merkleProof: [
        "0x98a7b6c5d4e3f2a10b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a",
        "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
      ],
      timestamp: "2026-08-23T12:00:00Z",
      verified: true,
    },
    {
      id: "mem-003",
      agentId: "agent-001",
      type: "short_term",
      title: "Current Epoch Working Context",
      description: "Active slippage allowance (0.5%), Gas price budget (2.5 Gwei), Target Pair (A0GI/USDT).",
      dataHash: "0x76a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a10b9c8d7e6f5a",
      storageRoot: "0x3a4f89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
      sizeBytes: 16384,
      leafIndex: 2,
      merkleProof: [
        "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
        "0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      ],
      timestamp: "2026-08-23T14:14:00Z",
      verified: true,
    },
  ],
};

export const DEMO_VERIFICATION_PROOFS: VerificationProofItem[] = [
  {
    id: "proof-001",
    title: "Arbitrage Execution Proof #4892",
    agentId: "agent-001",
    agentName: "Sentinel Alpha",
    txHash: "0xe89ab463a367aee4a5419fcca3f2a5c916365a69926898b7f2507a5a24657845",
    blockNumber: 43064773,
    teeType: "Intel SGX (v2.8) / Gramine",
    enclaveSignature: "0x89ab45cd67ef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01231c",
    storageRoot: "0x3a4f89b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    dataHash: "0x98a7b6c5d4e3f2a10b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a",
    leafIndex: 0,
    merkleProof: [
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
    ],
    status: "verified",
    verifiedAt: "2026-08-30T14:15:22Z",
    executionTrace: [
      { step: "Read DEX Reserve Quotes", target: "0xRouter0G", gasUsed: 42000, status: "success" },
      { step: "Run Off-Chain Optimization in TEE", target: "0g-compute-node-sg-04", gasUsed: 0, status: "success" },
      { step: "Execute Atomic Flash Swap", target: "0xPool0G", gasUsed: 148000, status: "success" },
      { step: "Persist State to 0G Storage", target: "0xStorageIndexer", gasUsed: 31000, status: "success" },
    ],
  },
  {
    id: "proof-002",
    title: "Oracle Multi-Feed Attestation #10842",
    agentId: "agent-002",
    agentName: "Nexus Oracle",
    txHash: "0x3eee7ff7625f47ba4e014e9ecf8e2b1091c276610fe6b725c91f094ac23b10c1",
    blockNumber: 43064773,
    teeType: "AMD SEV-SNP",
    enclaveSignature: "0x45cd67ef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345671b",
    storageRoot: "0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d",
    dataHash: "0x87b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6",
    leafIndex: 3,
    merkleProof: [
      "0x67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345",
      "0xbcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890a",
    ],
    status: "verified",
    verifiedAt: "2026-08-30T14:02:10Z",
    executionTrace: [
      { step: "Aggregate 8 CEX/DEX Feeds", target: "0xOracleAggregator", gasUsed: 65000, status: "success" },
      { step: "Compute Consensus Weighted Median", target: "0xOracleAggregator", gasUsed: 28000, status: "success" },
      { step: "Push On-Chain Checkpoint", target: "0xPriceFeed0G", gasUsed: 52000, status: "success" },
    ],
  },
];

export const DEMO_SWARM_NODES: SwarmNode[] = [
  {
    id: "node-01",
    name: "Sentinel Alpha (Coordinator)",
    role: "coordinator",
    agentAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
    status: "active",
    txCount: 1420,
    activeTasks: 4,
    lastHeartbeat: "10s ago",
  },
  {
    id: "node-02",
    name: "Nexus Oracle (Data Provider)",
    role: "verifier",
    agentAddress: "0x2e987A656a7c1A541b632924A23467B92A2810C2",
    status: "active",
    parentAgentId: "node-01",
    txCount: 3840,
    activeTasks: 2,
    lastHeartbeat: "4s ago",
  },
  {
    id: "node-03",
    name: "Cipher Swarm Executor (Sub-Worker A)",
    role: "executor",
    agentAddress: "0x9A48888b135f6064f2F43f5244F7499f57E52516",
    status: "active",
    parentAgentId: "node-01",
    txCount: 5210,
    activeTasks: 8,
    lastHeartbeat: "1s ago",
  },
  {
    id: "node-04",
    name: "0G Storage Persistence Worker",
    role: "storage_indexer",
    agentAddress: "0x5a1B68b0c8d19F86aE421153835698b6A18d96fE",
    status: "idle",
    parentAgentId: "node-01",
    txCount: 412,
    activeTasks: 0,
    lastHeartbeat: "2m ago",
  },
];

export const DEMO_SWARM_LINKS: SwarmLink[] = [
  { source: "node-01", target: "node-02", protocol: "0g_da", messagesPerMin: 180, avgLatencyMs: 42 },
  { source: "node-01", target: "node-03", protocol: "grpc", messagesPerMin: 420, avgLatencyMs: 18 },
  { source: "node-01", target: "node-04", protocol: "on_chain_event", messagesPerMin: 35, avgLatencyMs: 110 },
  { source: "node-03", target: "node-04", protocol: "0g_da", messagesPerMin: 90, avgLatencyMs: 55 },
];

export const DEMO_ACTIVITIES: Activity[] = [
  {
    id: "act-001",
    txHash: "0xe89ab463a367aee4a5419fcca3f2a5c916365a69926898b7f2507a5a24657845",
    blockNumber: 43064773,
    timestamp: "2026-08-30T14:15:00Z",
    agentId: "agent-001",
    agentName: "Sentinel Alpha",
    type: "inference",
    description: "DeepSeek-R1-Distill-Qwen inference executed on 0G Compute Router (TEE Attested)",
    value: "0 A0GI",
    gasUsed: "148,290",
    status: "success",
  },
  {
    id: "act-002",
    txHash: "0x3eee7ff7625f47ba4e014e9ecf8e2b1091c276610fe6b725c91f094ac23b10c1",
    blockNumber: 43064773,
    timestamp: "2026-08-30T14:02:00Z",
    agentId: "agent-002",
    agentName: "Nexus Oracle",
    type: "storage",
    description: "Uploaded verified oracle state root to 0G Storage Indexer",
    value: "0.02 A0GI",
    gasUsed: "89,140",
    status: "success",
  },
  {
    id: "act-003",
    txHash: "0x6e1bfce583082e020f6adddce402c28fb98ca1a0441b12dbea9cafcdf93f9ead",
    blockNumber: 43064773,
    timestamp: "2026-08-30T13:45:00Z",
    agentId: "agent-004",
    agentName: "Cipher Swarm Executor",
    type: "contract_call",
    description: "Multi-agent coordinator dispatch on 0G Chain",
    value: "0.15 A0GI",
    gasUsed: "230,450",
    status: "success",
  },
  {
    id: "act-004",
    txHash: "0xd5bacbb15233e69432c1daa208f16c6396008721ff92e43b06d164633c50c59f",
    blockNumber: 43064773,
    timestamp: "2026-08-30T13:20:00Z",
    agentId: "agent-001",
    agentName: "Sentinel Alpha",
    type: "transfer",
    description: "Settled automated yield to treasury contract",
    value: "1.45 A0GI",
    gasUsed: "21,000",
    status: "success",
  },
  {
    id: "act-005",
    txHash: "0x196d4f8804842c96c150e367c2a8c1545e77c55a5fc48d28634c41edd59b586f",
    blockNumber: 43064771,
    timestamp: "2026-08-30T12:55:00Z",
    agentId: "agent-003",
    agentName: "Aether Auditor",
    type: "mint",
    description: "Registered ERC-7857 Agentic ID token #4 on 0G Registry",
    value: "0.05 A0GI",
    gasUsed: "185,600",
    status: "success",
  },
];

export const DEMO_SUMMARY: AgentStats = {
  totalAgents: 4,
  activeAgents: 3,
  totalTransactions: 10882,
  totalComputeCalls: 6760,
  totalStorageBytes: 289100000,
  lastUpdated: new Date().toISOString(),
};

export function isDemoMode(): boolean {
  return true;
}

export function getDemoAgents(): Agent[] {
  return DEMO_AGENTS;
}

export function getDemoAgent(idOrTokenId: string): Agent | null {
  return DEMO_AGENTS.find((a) => a.id === idOrTokenId || a.tokenId === idOrTokenId) || null;
}

export function getDemoAgentSummaries(): AgentSummary[] {
  return DEMO_AGENTS.map((a) => ({
    id: a.id,
    tokenId: a.tokenId,
    address: a.address,
    owner: a.owner,
    name: a.name,
    status: a.status,
    txCount: a.txCount,
    lastActiveAt: a.lastActive,
    metadataUri: a.metadataUri,
  }));
}

export function getDemoStats(): AgentStats {
  return DEMO_SUMMARY;
}

export function getDemoActivities(): Activity[] {
  return DEMO_ACTIVITIES;
}
