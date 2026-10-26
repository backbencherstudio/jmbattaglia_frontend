"use client";

import React from "react";
import {
  TotalPackagesMetricIcon,
  LivePortalMetricIcon,
  InDraftMetricIcon,
  AddonServicesMetricIcon,
} from "@/components/icons/MetricIcons";
import type { DashboardCard } from "@/types/dashboard";
import type { MetricCardItem } from "@/types/metrics";

export type MetricCardUnifiedItem =
  | MetricCardItem
  | DashboardCard
  | (DashboardCard & { icon?: React.ComponentType<{ className?: string }> });

export interface MetricCardProps {
  item: MetricCardUnifiedItem;
}

function renderMetricIcon(
  explicitIcon: React.ComponentType<{ className?: string }> | undefined,
  iconKey: string | undefined,
  id: string,
  className: string,
) {
  if (explicitIcon) {
    const CustomIcon = explicitIcon;
    return <CustomIcon className={className} />;
  }

  const key = `${iconKey || ""} ${id || ""}`.toLowerCase();

  if (key.includes("live") || key.includes("portal")) {
    return <LivePortalMetricIcon className={className} />;
  }
  if (key.includes("draft")) {
    return <InDraftMetricIcon className={className} />;
  }
  if (key.includes("addon") || key.includes("add-on") || key.includes("service")) {
    return <AddonServicesMetricIcon className={className} />;
  }
  return <TotalPackagesMetricIcon className={className} />;
}

export function MetricCard({ item }: MetricCardProps) {
  const explicitIcon = "icon" in item ? item.icon : undefined;
  const iconKey = "iconKey" in item ? item.iconKey : undefined;

  const defaultBg =
    item.id === "live-on-portal"
      ? "bg-blue-100/70 border border-blue-200/50"
      : item.id === "in-draft"
      ? "bg-purple-100/70 border border-purple-200/50"
      : item.id === "add-on-services"
      ? "bg-lime-100/70 border border-lime-200/50"
      : "bg-orange-100/70 border border-orange-200/50";

  const defaultColor =
    item.id === "live-on-portal"
      ? "text-blue-600"
      : item.id === "in-draft"
      ? "text-purple-600"
      : item.id === "add-on-services"
      ? "text-lime-700"
      : "text-primary";

  const iconBgClass = item.iconBgClass || defaultBg;
  const iconColorClass = item.iconColorClass || defaultColor;

  return (
    <div className="flex-1 bg-canvas border border-hairline rounded-[0.5rem] p-4 sm:px-6 sm:py-[1.75rem] flex items-start justify-between gap-3 shadow-xs transition-all hover:border-brand-border/40">
      <div className="space-y-1.5">
        <p className="font-trade font-normal text-sub text-base sm:text-[1.125rem] leading-[132%]">
          {item.title}
        </p>
        <p className="font-trade font-bold text-2xl sm:text-[2rem] text-main leading-tight">
          {item.value}
        </p>
      </div>

      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[0.75rem] flex items-center justify-center shrink-0 ${iconBgClass}`}
      >
        {renderMetricIcon(
          explicitIcon,
          iconKey,
          item.id,
          `w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass}`,
        )}
      </div>
    </div>
  );
}

export default MetricCard;
