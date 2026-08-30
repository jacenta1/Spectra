"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { cn, truncateAddress } from "@/lib/utils";

export interface AddressProps {
  address: string;
  chars?: number;
  className?: string;
}

export function Address({ address, chars = 4, className }: AddressProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch {
      // Fallback for non-secure contexts or older browsers
      const textArea = document.createElement("textarea");
      textArea.value = address;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } catch {
        // Ignored
      }
      document.body.removeChild(textArea);
    }
  }, [address]);

  if (!address) return null;

  const displayAddress = truncateAddress(address, chars);

  return (
    <div className={cn("relative inline-flex items-center gap-1.5 font-mono text-sm", className)}>
      <span className="text-foreground select-all" title={address}>
        {displayAddress}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="relative inline-flex items-center justify-center p-1 rounded hover:bg-surface-hover text-muted hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
        title={copied ? "Copied!" : "Copy address"}
        aria-label={copied ? "Address copied" : `Copy address ${address}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-success animate-in zoom-in-50 duration-150" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5 transition-transform active:scale-90" aria-hidden="true" />
        )}
      </button>

      {/* Brief copied tooltip indicator */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[11px] font-sans font-medium text-foreground bg-surface border border-border rounded shadow-lg pointer-events-none z-50 whitespace-nowrap"
        >
          Copied
        </div>
      )}
    </div>
  );
}
