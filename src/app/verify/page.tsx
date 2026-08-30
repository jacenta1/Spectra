import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { VerifyDashboard } from "@/components/verify/verify-dashboard";

export const metadata = {
  title: "Verifiable Execution | Spectra",
  description: "Cryptographically verify autonomous AI agent transactions against 0G Chain, TEE signatures, and 0G Storage Merkle roots.",
};

export default function VerifyPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <VerifyDashboard />
      </div>
    </DashboardLayout>
  );
}
