import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  className,
}: StatCardProps) {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  return (
    <div
      className={cn(
        "rounded-[8px] border border-border bg-surface p-5 transition-colors hover:border-border-hover",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted truncate">{label}</span>
        {icon && (
          <div className="text-muted shrink-0 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {value}
      </div>

      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs font-medium">
          {isPositive ? (
            <>
              <TrendingUp className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
              <span className="text-success">{change}</span>
            </>
          ) : isNegative ? (
            <>
              <TrendingDown className="h-3.5 w-3.5 text-error shrink-0" aria-hidden="true" />
              <span className="text-error">{change}</span>
            </>
          ) : (
            <span className="text-muted">{change}</span>
          )}
        </div>
      )}
    </div>
  );
}
