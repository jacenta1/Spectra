"use client";

import { useEffect, useState } from "react";
import { ActivityFeed } from "@/components/activity/activity-feed";
import { ActivityFilters } from "@/components/activity/activity-filters";
import type { Activity, ActivityFilters as Filters } from "@/types/activity";

export function ActivityPageContent() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, []);

  const filtered = activities.filter((a) => {
    if (filters.type && a.type !== filters.type) return false;
    if (filters.agentId && a.agentId !== filters.agentId) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 rounded-lg skeleton" />
        <div className="h-[500px] rounded-lg skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Activity</h1>
        <p className="text-sm text-muted mt-1">
          Real-time transaction stream from 0G Chain
        </p>
      </div>

      <ActivityFilters onFilterChange={setFilters} />

      <ActivityFeed activities={filtered} title={`${filtered.length} Transactions`} />
    </div>
  );
}
