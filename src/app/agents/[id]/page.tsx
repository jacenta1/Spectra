import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AgentProfileContent } from "@/components/agents/agent-profile-content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <DashboardLayout>
      <AgentProfileContent agentId={id} />
    </DashboardLayout>
  );
}
