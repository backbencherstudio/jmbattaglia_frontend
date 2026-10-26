"use client";

import { useRouter } from "next/navigation";
import { Plus, Eye } from "lucide-react";
import { metricsData } from "@/data/metricsData";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import { KeyMetricsSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";
import { useGetAdminDashboardQuery } from "@/redux/features/dashboard/dashboardApi";
import type { DashboardCard, DashboardActions } from "@/types/dashboard";

export interface KeyMetricsCardsProps {
  cards?: DashboardCard[];
  actions?: DashboardActions;
  isLoading?: boolean;
}

export function KeyMetricsCards({
  cards: propCards,
  actions: propActions,
  isLoading: propIsLoading,
}: KeyMetricsCardsProps = {}) {
  const router = useRouter();

  // If props are not passed from parent page, fetch independently from RTK Query
  const shouldFetch = propCards === undefined && propIsLoading === undefined;
  const { data: dashboardResponse, isLoading: queryLoading } =
    useGetAdminDashboardQuery(
      { page: 1, limit: 5 },
      { skip: !shouldFetch },
    );

  const isLoading = propIsLoading ?? (shouldFetch ? queryLoading : false);

  if (isLoading) {
    return <KeyMetricsSkeleton />;
  }

  const apiData = dashboardResponse?.data;
  const rawCards = propCards ?? apiData?.cards;
  const actions = propActions ?? apiData?.actions;

  // Use API cards if available, otherwise synthesize from summary or fallback to metricsData
  const displayCards: DashboardCard[] =
    rawCards && rawCards.length > 0
      ? rawCards
      : apiData?.summary
      ? [
          {
            id: "total-packages",
            title: "Total packages",
            value: apiData.summary.totalPackages ?? 0,
            iconKey: "packages",
            color: "orange",
            iconBgClass: "bg-orange-100/70 border border-orange-200/50",
            iconColorClass: "text-primary",
          },
          {
            id: "live-on-portal",
            title: "Live on portal",
            value: apiData.summary.livePackages ?? 0,
            iconKey: "live",
            color: "blue",
            iconBgClass: "bg-blue-100/70 border border-blue-200/50",
            iconColorClass: "text-blue-600",
          },
          {
            id: "in-draft",
            title: "In draft",
            value: apiData.summary.draftPackages ?? 0,
            iconKey: "draft",
            color: "purple",
            iconBgClass: "bg-purple-100/70 border border-purple-200/50",
            iconColorClass: "text-purple-600",
          },
          {
            id: "add-on-services",
            title: "Add on Services",
            value: apiData.summary.addOnServices ?? 0,
            iconKey: "addons",
            color: "lime",
            iconBgClass: "bg-lime-100/70 border border-lime-200/50",
            iconColorClass: "text-lime-700",
          },
        ]
      : (metricsData as unknown as DashboardCard[]);

  const newPackageUrl =
    actions?.newPackageUrl || "/admin/packages?tab=packages&view=create";
  const reviewDraftsUrl =
    actions?.reviewDraftsUrl || "/admin/packages?tab=packages&status=DRAFT";
  const draftCount = actions?.draftCount ?? 0;
  const reviewDraftText =
    actions?.reviewDraftText ||
    (draftCount > 0
      ? `Review ${draftCount} draft${draftCount === 1 ? "" : "s"}`
      : "Review drafts");

  return (
    <div className="space-y-4">
      {/* Key Metrics Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-trade font-bold text-lg sm:text-xl text-main">
          Key Metrics
        </h2>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            type="button"
            onClick={() => router.push(newPackageUrl)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New package</span>
          </button>

          <button
            type="button"
            onClick={() => router.push(reviewDraftsUrl)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-canvas border border-hairline hover:bg-canvas text-main text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-sub" />
            <span>{reviewDraftText}</span>
          </button>
        </div>
      </div>

      {/* Responsive Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {displayCards.map((item) => (
          <MetricCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default KeyMetricsCards;
