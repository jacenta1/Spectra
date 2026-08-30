/**
 * @spectra/sdk - Official TypeScript SDK for 0G Agent Observability & Telemetry
 */

export interface SpectraConfig {
  apiKey?: string;
  agentAddress: string;
  agentTokenId?: string;
  rpcUrl?: string;
  storageIndexerUrl?: string;
  endpoint?: string;
}

export interface EmitEventParams {
  type: "inference" | "storage" | "contract_call" | "transfer" | "custom";
  txHash?: string;
  description: string;
  value?: string;
  storageRoot?: string;
  metadata?: Record<string, unknown>;
}

export class SpectraClient {
  private config: SpectraConfig;
  private endpoint: string;

  constructor(config: SpectraConfig) {
    this.config = config;
    this.endpoint = config.endpoint || "https://spectra-0g.vercel.app/api";
  }

  /**
   * Emits execution telemetry for an autonomous agent action to Spectra.
   */
  async emit(event: EmitEventParams): Promise<{ success: boolean; eventId?: string }> {
    try {
      const payload = {
        agentAddress: this.config.agentAddress,
        agentTokenId: this.config.agentTokenId,
        timestamp: new Date().toISOString(),
        ...event,
      };

      const res = await fetch(`${this.endpoint}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return { success: false };
      }

      const data = await res.json();
      return { success: true, eventId: data.id };
    } catch {
      return { success: false };
    }
  }

  /**
   * Registers decentralized memory root with 0G Storage and notifies Spectra indexer.
   */
  async recordMemoryRoot(storageRoot: string, leafHash: string): Promise<boolean> {
    const res = await this.emit({
      type: "storage",
      description: "Updated agent memory state root on 0G Storage",
      storageRoot,
      metadata: { leafHash },
    });
    return res.success;
  }
}

export function createSpectra(config: SpectraConfig): SpectraClient {
  return new SpectraClient(config);
}
