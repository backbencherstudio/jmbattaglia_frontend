"use client";

import React, { useState } from "react";
import { KeyMetricsCards } from "@/components/admin/dashboard/KeyMetricsCards";
import { RecentPackagesTable } from "@/components/admin/dashboard/RecentPackagesTable";
import { DashboardSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";
import { useGetAdminDashboardQuery } from "@/redux/features/dashboard/dashboardApi";
import { AlertCircle, RefreshCw } from "lucide-react";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function AdminDashboardPage() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const {
    data: dashboardResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAdminDashboardQuery({ page, limit });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError && !dashboardResponse) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <p className="text-sm font-semibold text-red-900">
          {getErrorMessage(error, "Failed to load dashboard data.")}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const dashboardData = dashboardResponse?.data;

  return (
    <div className="space-y-6">
      <KeyMetricsCards
        cards={dashboardData?.cards}
        actions={dashboardData?.actions}
      />
      <RecentPackagesTable
        packages={dashboardData?.recentPackages}
        pagination={dashboardData?.pagination}
        page={page}
        limit={limit}
        onPageChange={setPage}
        isFetching={isFetching}
      />
    </div>
  );
}
