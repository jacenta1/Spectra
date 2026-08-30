import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded-[8px] bg-[var(--surface)]", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export interface CardSkeletonProps {
  className?: string;
}

export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-border bg-surface p-5 space-y-4",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3.5 w-20" />
    </div>
  );
}

export interface TableRowSkeletonProps {
  columns?: number;
  className?: string;
}

export function TableRowSkeleton({ columns = 5, className }: TableRowSkeletonProps) {
  return (
    <tr className={cn("border-b border-border/50", className)} aria-hidden="true">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <Skeleton
            className={cn(
              "h-4",
              index === 0 ? "w-24" : index === columns - 1 ? "w-16" : "w-3/4"
            )}
          />
        </td>
      ))}
    </tr>
  );
}
