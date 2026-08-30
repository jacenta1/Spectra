import Link from "next/link";
import { TxLink } from "@/components/common/tx-link";
import { cn, timeAgo } from "@/lib/utils";
import type { Activity, ActivityType } from "@/types/activity";

interface ActivityItemProps {
  activity: Activity;
  className?: string;
}

const TYPE_CONFIG: Record<
  ActivityType,
  { label: string; className: string }
> = {
  inference: {
    label: "Inference",
    className: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
  },
  storage: {
    label: "Storage",
    className: "bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20",
  },
  storage_upload: {
    label: "Storage Upload",
    className: "bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20",
  },
  storage_download: {
    label: "Storage Download",
    className: "bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/20",
  },
  transfer: {
    label: "Transfer",
    className: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  },
  contract_call: {
    label: "Contract Call",
    className: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
  },
  mint: {
    label: "Mint",
    className: "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20",
  },
  unknown: {
    label: "Unknown",
    className: "bg-[#71717A]/10 text-[#71717A] border-[#71717A]/20",
  },
};

export function ActivityItem({ activity, className }: ActivityItemProps) {
  const typeConfig = TYPE_CONFIG[activity.type] || TYPE_CONFIG.unknown;

  const isSuccess = activity.status === "success";
  const isFailed = activity.status === "failed";

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 border-b border-border/50 last:border-b-0 hover:bg-surface-hover/50 transition-colors",
        className
      )}
    >
      {/* Left side: Type Badge and Agent Name */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Type Badge */}
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium shrink-0",
            typeConfig.className
          )}
        >
          {typeConfig.label}
        </span>

        {/* Agent Name */}
        <div className="min-w-0 flex items-center gap-1.5">
          {activity.agentId ? (
            <Link
              href={`/agents/${activity.agentId}`}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors truncate"
              title={activity.agentName}
            >
              {activity.agentName || "Unnamed Agent"}
            </Link>
          ) : (
            <span
              className="text-sm font-medium text-foreground truncate"
              title={activity.agentName}
            >
              {activity.agentName || "Unnamed Agent"}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Tx Hash, Status Dot, and Timestamp */}
      <div className="flex items-center justify-between sm:justify-end gap-4 text-xs shrink-0">
        {/* Transaction Link */}
        <div className="flex items-center">
          <TxLink txHash={activity.txHash} chars={4} />
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5" title={`Status: ${activity.status}`}>
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isSuccess && "bg-success",
              isFailed && "bg-error",
              !isSuccess && !isFailed && "bg-warning animate-pulse"
            )}
          />
          <span className="text-muted capitalize text-xs hidden md:inline-block">
            {activity.status}
          </span>
        </div>

        {/* Timestamp */}
        <span className="font-mono text-muted text-xs shrink-0" title={activity.timestamp}>
          {timeAgo(activity.timestamp)}
        </span>
      </div>
    </div>
  );
}
