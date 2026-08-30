"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { cn, truncateAddress } from "@/lib/utils";
import { useNetwork } from "@/lib/context/network-context";

export interface TxLinkProps {
  txHash: string;
  chars?: number;
  className?: string;
  showIcon?: boolean;
}

export function TxLink({
  txHash,
  chars = 4,
  className,
  showIcon = true,
}: TxLinkProps) {
  const { getExplorerTxUrl, activeChain } = useNetwork();
  if (!txHash) return null;

  const url = getExplorerTxUrl(txHash);
  const displayHash = truncateAddress(txHash, chars);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${txHash} (${activeChain.name})`}
      aria-label={`View transaction ${txHash} on ${activeChain.name} Explorer`}
      className={cn(
        "inline-flex items-center gap-1 font-mono text-sm text-accent hover:text-accent-hover transition-colors underline-offset-4 hover:underline",
        className
      )}
    >
      <span>{displayHash}</span>
      {showIcon && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
      )}
    </a>
  );
}
