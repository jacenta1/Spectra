"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityFilters as ActivityFiltersType, ActivityType } from "@/types/activity";

type FilterOptionValue = ActivityType | "all";

interface FilterOption {
  label: string;
  value: FilterOptionValue;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Inference", value: "inference" },
  { label: "Storage", value: "storage_upload" },
  { label: "Transfer", value: "transfer" },
  { label: "Contract Call", value: "contract_call" },
  { label: "Mint", value: "mint" },
];

interface ActivityFiltersProps {
  onFilterChange: (filters: ActivityFiltersType) => void;
  selectedType?: FilterOptionValue;
  className?: string;
}

export function ActivityFilters({
  onFilterChange,
  selectedType: externalSelectedType,
  className,
}: ActivityFiltersProps) {
  const [internalSelected, setInternalSelected] = useState<FilterOptionValue>("all");

  const activeValue = externalSelectedType !== undefined ? externalSelectedType : internalSelected;

  const handleSelect = (val: FilterOptionValue) => {
    setInternalSelected(val);
    if (val === "all") {
      onFilterChange({});
    } else {
      onFilterChange({ type: val });
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1 text-xs text-muted mr-1 hidden sm:flex">
        <Filter className="h-3.5 w-3.5" />
        <span>Filter:</span>
      </div>

      {/* Button pills group */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {FILTER_OPTIONS.map((option) => {
          const isActive = activeValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap border cursor-pointer",
                isActive
                  ? "border-accent bg-accent/10 text-foreground shadow-sm"
                  : "border-border bg-surface text-muted hover:text-foreground hover:bg-surface-hover hover:border-border-hover"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
