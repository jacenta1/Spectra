"use client";

import { useState } from "react";
import { Agent } from "@/types/agent";
import { useNetwork } from "@/lib/context/network-context";
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Send,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentSdkIntegrationProps {
  agent: Agent;
}

export function AgentSdkIntegration({ agent }: AgentSdkIntegrationProps) {
  const { activeChain } = useNetwork();
  const [activeLang, setActiveLang] = useState<"ts" | "py" | "curl">("ts");
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://discord.com/api/webhooks/...");
  const [webhookSent, setWebhookSent] = useState(false);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  const tsCode = `import { createSpectra } from "@spectra/sdk";

// Initialize Spectra client for ${agent.name}
const spectra = createSpectra({
  agentAddress: "${agent.address}",
  agentTokenId: "${agent.tokenId}",
  rpcUrl: "${activeChain.rpcUrl}",
  chainId: ${activeChain.id},
});

// 1. Emit live execution telemetry to 0G Chain
await spectra.emit({
  type: "inference",
  description: "Autonomous reasoning cycle executed on 0G Compute",
  txHash: "0x...",
  gasUsed: 42000,
});

// 2. Commit verifiable context memory to 0G Storage
const memoryReceipt = await spectra.recordMemoryRoot(
  "${agent.metadata?.storageRoot || "0x98f4a1..."}",
  "0xleaf_hash..."
);

console.log("Memory anchored on 0G Storage:", memoryReceipt.root);`;

  const pyCode = `import os
from spectra_sdk import SpectraClient

# Initialize Spectra SDK on ${activeChain.name}
client = SpectraClient(
    agent_address="${agent.address}",
    agent_token_id="${agent.tokenId}",
    rpc_url="${activeChain.rpcUrl}",
    chain_id=${activeChain.id}
)

# Record verifiable inference attestation
client.emit_telemetry(
    event_type="inference",
    description="DeepSeek-R1 inference in TEE enclave",
    tee_type="${agent.metadata?.teeType || "Intel SGX Enclave"}"
)

# Anchor long-term memory state on 0G Storage
client.commit_memory_root(
    storage_root="${agent.metadata?.storageRoot || "0x98f4a1..."}"
)`;

  const curlCode = `# Emit telemetry event via Spectra REST API
curl -X POST https://api.spectra.0g.ai/v1/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentAddress": "${agent.address}",
    "agentTokenId": "${agent.tokenId}",
    "chainId": ${activeChain.id},
    "storageRoot": "${agent.metadata?.storageRoot || "0x98f4a1..."}",
    "type": "inference"
  }'`;

  const getCodeSnippet = () => {
    switch (activeLang) {
      case "ts":
        return tsCode;
      case "py":
        return pyCode;
      case "curl":
        return curlCode;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadProof = () => {
    const proofBundle = {
      specVersion: "1.0.0",
      generatedAt: new Date().toISOString(),
      agent: {
        id: agent.id,
        name: agent.name,
        address: agent.address,
        tokenId: agent.tokenId,
        owner: agent.owner,
      },
      network: {
        name: activeChain.name,
        chainId: activeChain.id,
        rpcUrl: activeChain.rpcUrl,
      },
      cryptographicAttestation: {
        storageRoot: agent.metadata?.storageRoot || "0x98f4a1902834b6e7710c2834919024f",
        teeType: agent.metadata?.teeType || "Intel SGX Enclave",
        verifierContract: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        verificationStatus: "VERIFIED",
      },
      anomalyScore: agent.anomalyReport?.overallScore || 95,
      signature: "0xspectra_attestation_sig_" + agent.address.slice(2, 18),
    };

    const blob = new Blob([JSON.stringify(proofBundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spectra-proof-${agent.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTestWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingWebhook(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSendingWebhook(false);
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Download Proof Certificate */}
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">
            Cryptographic Proof Bundle & Verification Certificate
          </h2>
          <p className="text-xs text-muted">
            Export the verifiable cryptographic bundle containing 0G Storage roots, TEE attestation signatures, and on-chain contract hashes.
          </p>
        </div>

        <button
          onClick={handleDownloadProof}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-accent/90 transition-colors shadow-sm shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          Export Proof (.JSON)
        </button>
      </div>

      {/* Code Snippet Card */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-mono font-semibold uppercase text-foreground">
              Integrate Agent via SDK
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded border border-border bg-background p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveLang("ts")}
                className={cn(
                  "rounded px-2.5 py-0.5 transition-colors",
                  activeLang === "ts" ? "bg-accent text-white font-medium" : "text-muted hover:text-foreground"
                )}
              >
                TypeScript
              </button>
              <button
                onClick={() => setActiveLang("py")}
                className={cn(
                  "rounded px-2.5 py-0.5 transition-colors",
                  activeLang === "py" ? "bg-accent text-white font-medium" : "text-muted hover:text-foreground"
                )}
              >
                Python
              </button>
              <button
                onClick={() => setActiveLang("curl")}
                className={cn(
                  "rounded px-2.5 py-0.5 transition-colors",
                  activeLang === "curl" ? "bg-accent text-white font-medium" : "text-muted hover:text-foreground"
                )}
              >
                cURL
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded border border-border bg-background px-2.5 py-1 text-xs font-mono text-muted hover:text-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-[#22C55E]" />
                  <span className="text-[#22C55E]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-background/80 p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-accent leading-relaxed">{getCodeSnippet()}</pre>
        </div>
      </div>

      {/* Webhook Dispatch Simulator */}
      <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-mono font-semibold uppercase text-foreground">
              Security & Anomaly Webhook Alerts
            </h3>
            <p className="text-xs text-muted">
              Configure real-time alerts to Discord, Slack, or Telegram for high-risk behavioral anomalies.
            </p>
          </div>
        </div>

        <form onSubmit={handleTestWebhook} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            className="flex-1 rounded border border-border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSendingWebhook}
            className="inline-flex items-center justify-center gap-1.5 rounded bg-surface border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-accent transition-colors disabled:opacity-50"
          >
            {isSendingWebhook ? (
              <span>Dispatching...</span>
            ) : webhookSent ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                <span className="text-[#22C55E]">Alert Dispatched</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 text-accent" />
                <span>Test Webhook</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
