import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SwarmView } from "@/components/swarms/swarm-view";

export const metadata = {
  title: "Swarm Topology | Spectra",
  description: "Multi-agent coordination matrix, sub-agent communication topology, and collective capital routing across 0G.",
};

export default function SwarmsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <SwarmView />
      </div>
    </DashboardLayout>
  );
}
