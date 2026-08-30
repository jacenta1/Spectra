import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AgentsPageContent } from "@/components/agents/agents-page-content";

export default function AgentsPage() {
  return (
    <DashboardLayout>
      <AgentsPageContent />
    </DashboardLayout>
  );
}
