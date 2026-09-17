import React from "react";
import { KeyMetricsCards } from "@/components/admin/dashboard/KeyMetricsCards";
import { RecentPackagesTable } from "@/components/admin/dashboard/RecentPackagesTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <KeyMetricsCards />
      <RecentPackagesTable />
    </div>
  );
}
