import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PlaygroundDashboard } from "@/components/playground/playground-dashboard";

export const metadata: Metadata = {
  title: "Simulator & Sandbox | Spectra",
  description: "Interactive live testing playground for 0G autonomous agents, memory commitments, and verifiable inferences.",
};

export default function PlaygroundPage() {
  return (
    <DashboardLayout>
      <PlaygroundDashboard />
    </DashboardLayout>
  );
}
