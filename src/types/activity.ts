export type ActivityType =
  | "inference"
  | "storage"
  | "storage_upload"
  | "storage_download"
  | "transfer"
  | "contract_call"
  | "mint"
  | "unknown";

export interface Activity {
  id: string;
  agentId: string;
  agentName: string;
  txHash: string;
  blockNumber: number;
  type: ActivityType;
  from?: string;
  to?: string;
  value?: string;
  gasUsed?: string;
  description?: string;
  status: "success" | "failed" | "pending";
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface ActivityFilters {
  type?: ActivityType;
  agentId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ActivityStats {
  total: number;
  last24h: number;
  byType: Record<ActivityType, number>;
}
