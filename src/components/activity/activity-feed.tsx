import { Activity as ActivityIcon, Inbox } from "lucide-react";
import { ActivityItem } from "@/components/activity/activity-item";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types/activity";

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  className?: string;
  emptyMessage?: string;
  headerAction?: React.ReactNode;
}

export function ActivityFeed({
  activities,
  title = "Activity Feed",
  className,
  emptyMessage = "No activity found",
  headerAction,
}: ActivityFeedProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <ActivityIcon className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <span className="rounded-full border border-border bg-surface-hover px-2 py-0.5 font-mono text-xs text-muted">
            {activities.length}
          </span>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Content / List */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-hover text-muted mb-3 border border-border">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">{emptyMessage}</p>
          <p className="mt-1 text-xs text-muted">
            No on-chain activity has been recorded yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
