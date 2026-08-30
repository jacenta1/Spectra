"use client";

import { useState } from "react";
import { AgentMemoryBlock, zeroGStorage } from "@/lib/zero-g/storage";
import { DEMO_MEMORY_BLOCKS } from "@/lib/demo-data";
import { StatusBadge } from "@/components/common/status-badge";
import { HardDrive, Database, ShieldCheck, FileCode, CheckCircle2, ChevronRight, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentMemoryInspectorProps {
  agentId: string;
  storageRoot?: string;
  memoryBlocks?: AgentMemoryBlock[];
}

export function AgentMemoryInspector({
  agentId,
  storageRoot,
  memoryBlocks: initialBlocks,
}: AgentMemoryInspectorProps) {
  const blocks = initialBlocks || DEMO_MEMORY_BLOCKS[agentId] || [];
  const [selectedBlock, setSelectedBlock] = useState<AgentMemoryBlock | null>(blocks[0] || null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verifyingMerkle, setVerifyingMerkle] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerifyMerkle = async () => {
    if (!selectedBlock) return;
    setVerifyingMerkle(true);
    setVerificationResult(null);

    // Call real client-side Merkle inclusion proof logic
    const isValid = await zeroGStorage.verifyMerkleInclusion(
      selectedBlock.dataHash,
      selectedBlock.merkleProof,
      selectedBlock.storageRoot,
      selectedBlock.leafIndex
    );

    // Demo realistic delay
    setTimeout(() => {
      setVerifyingMerkle(false);
      setVerificationResult(isValid);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 0G Storage Summary Header */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-accent/10 p-2.5 text-accent border border-accent/20">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">0G Decentralized Memory Store</h3>
              <p className="text-xs text-muted">
                Inspect Merkle-proven vector embeddings, RAM contexts, and archival state roots.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2.5 py-1 text-xs font-mono text-[#22C55E]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Merkle Root Anchored
            </span>
          </div>
        </div>

        {storageRoot && (
          <div className="mt-4 rounded-md border border-border/80 bg-background/80 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <span className="text-muted">Global 0G Storage Root:</span>
              <div className="flex items-center gap-2">
                <span className="text-accent truncate max-w-[280px] sm:max-w-md">{storageRoot}</span>
                <button
                  onClick={() => copyToClipboard(storageRoot, "root")}
                  className="text-muted hover:text-foreground transition-colors p-1"
                  title="Copy Root Hash"
                >
                  {copiedHash === "root" ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory Blocks Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Block Selection List */}
        <div className="lg:col-span-5 space-y-2.5">
          <h4 className="text-xs font-mono text-muted uppercase tracking-wider px-1">Memory Segments ({blocks.length})</h4>
          {blocks.length === 0 ? (
            <div className="rounded-lg border border-border bg-surface p-6 text-center text-xs text-muted">
              No memory blocks recorded on 0G Storage for this agent yet.
            </div>
          ) : (
            blocks.map((block) => {
              const isSelected = selectedBlock?.id === block.id;
              return (
                <div
                  key={block.id}
                  onClick={() => {
                    setSelectedBlock(block);
                    setVerificationResult(null);
                  }}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3.5 transition-all",
                    isSelected
                      ? "border-accent bg-accent/5 shadow-sm"
                      : "border-border bg-surface hover:border-border/80 hover:bg-surface/80"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{block.title}</span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-mono",
                            block.type === "vector_context" && "bg-purple-500/10 text-purple-400 border border-purple-500/20",
                            block.type === "long_term" && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                            block.type === "short_term" && "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}
                        >
                          {block.type.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-1">{block.description}</p>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 text-muted shrink-0 transition-transform", isSelected && "text-accent translate-x-0.5")} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted">
                    <span>Size: {(block.sizeBytes / 1024).toFixed(1)} KB</span>
                    <span>Leaf #{block.leafIndex}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Block Deep Inspector & Merkle Proof */}
        <div className="lg:col-span-7">
          {selectedBlock ? (
            <div className="rounded-lg border border-border bg-surface p-5 space-y-5">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{selectedBlock.title}</h4>
                  <p className="text-xs text-muted mt-0.5">{selectedBlock.description}</p>
                </div>
                <StatusBadge status={selectedBlock.verified ? "active" : "idle"} />
              </div>

              {/* Cryptographic Hashes */}
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-muted block text-[11px] mb-1">Data Leaf Hash (SHA-256):</span>
                  <div className="flex items-center justify-between gap-2 rounded bg-background p-2 border border-border">
                    <span className="text-foreground truncate">{selectedBlock.dataHash}</span>
                    <button onClick={() => copyToClipboard(selectedBlock.dataHash, "dataHash")} className="text-muted hover:text-foreground">
                      {copiedHash === "dataHash" ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-muted block text-[11px] mb-1">0G Storage Root Hash:</span>
                  <div className="flex items-center justify-between gap-2 rounded bg-background p-2 border border-border">
                    <span className="text-accent truncate">{selectedBlock.storageRoot}</span>
                    <button onClick={() => copyToClipboard(selectedBlock.storageRoot, "storageRoot")} className="text-muted hover:text-foreground">
                      {copiedHash === "storageRoot" ? <Check className="h-3.5 w-3.5 text-[#22C55E]" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Merkle Proof Tree Breakdown */}
              <div className="rounded-md border border-border/80 bg-background/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-foreground flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-accent" />
                    Merkle Inclusion Proof ({selectedBlock.merkleProof.length} sibling hashes)
                  </span>
                  <button
                    onClick={handleVerifyMerkle}
                    disabled={verifyingMerkle}
                    className="inline-flex items-center gap-1.5 rounded bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    {verifyingMerkle ? "Verifying..." : "Validate Merkle Proof"}
                  </button>
                </div>

                <div className="space-y-1.5">
                  {selectedBlock.merkleProof.map((proofHash, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-mono bg-surface p-1.5 rounded border border-border/60">
                      <span className="text-muted shrink-0">L{i + 1}:</span>
                      <span className="text-muted truncate">{proofHash}</span>
                    </div>
                  ))}
                </div>

                {verificationResult !== null && (
                  <div
                    className={cn(
                      "mt-2 rounded p-2.5 text-xs font-mono flex items-center gap-2 border",
                      verificationResult
                        ? "border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      {verificationResult
                        ? "Merkle Proof Verified: Leaf is cryptographically anchored in 0G Storage Root."
                        : "Merkle Root Mismatch."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-12 text-center text-xs text-muted">
              Select a memory segment on the left to inspect its cryptographic proof.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
