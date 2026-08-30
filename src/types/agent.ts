export type AgentStatus = "active" | "idle" | "error" | "paused";

export interface AgentMetadata {
  description?: string;
  model?: string;
  creator?: string;
  framework?: string;
  capabilities?: string[];
  version?: string;
  storageRoot?: string;
  memoryRoot?: string;
  computeNode?: string;
  teeType?: string;
  [key: string]: unknown;
}

export interface AnomalyReport {
  overallScore: number;
  status: "nominal" | "low_risk" | "high_risk" | "quarantined";
  lastScanned: string;
  risks: {
    reentrancyRisk: number;
    capitalOutflowRisk: number;
    memoryCorruptionRisk: number;
    promptInjectionRisk: number;
  };
  detectedAnomalies: {
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    timestamp: string;
    txHash?: string;
  }[];
}

export interface Agent {
  id: string;
  tokenId: string;
  address: string;
  owner: string;
  name: string;
  status: AgentStatus;
  createdAt: string;
  lastActive: string;
  txCount: number;
  computeCalls: number;
  storageUsageBytes: number;
  metadataUri: string;
  metadata?: AgentMetadata;
  anomalyReport?: AnomalyReport;
}

export interface AgentSummary {
  id: string;
  tokenId: string;
  address: string;
  owner: string;
  name: string;
  status: AgentStatus;
  txCount: number;
  lastActiveAt: string;
  metadataUri?: string;
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  totalTransactions: number;
  totalComputeCalls: number;
  totalStorageBytes?: number;
  lastUpdated?: string;
}
