import React from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

type StatusVariant = "green" | "red" | "yellow" | "gray";

const STATUS_MAP: Record<string, { variant: StatusVariant; label: string }> = {
  active: { variant: "green", label: "Active" },
  success: { variant: "green", label: "Success" },
  inactive: { variant: "red", label: "Inactive" },
  failed: { variant: "red", label: "Failed" },
  error: { variant: "red", label: "Error" },
  paused: { variant: "yellow", label: "Paused" },
  pending: { variant: "yellow", label: "Pending" },
  transferred: { variant: "gray", label: "Transferred" },
  unknown: { variant: "gray", label: "Unknown" },
};

const VARIANT_STYLES: Record<StatusVariant, { badge: string; dot: string }> = {
  green: {
    badge: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
    dot: "bg-[#22C55E]",
  },
  red: {
    badge: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    dot: "bg-[#EF4444]",
  },
  yellow: {
    badge: "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20",
    dot: "bg-[#EAB308]",
  },
  gray: {
    badge: "bg-[#71717A]/10 text-[#71717A] border-[#71717A]/20",
    dot: "bg-[#71717A]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null;

  const normalized = status.toLowerCase().trim();
  const matched = STATUS_MAP[normalized];

  const variant = matched?.variant ?? "gray";
  const label = matched?.label ?? (status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "));
  const style = VARIANT_STYLES[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", style.dot)} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
