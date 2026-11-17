"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
  href?: string;
  onClick?: () => void;
}

function resolveCardHref(
  item: MetricCardUnifiedItem,
  explicitHref?: string,
): string {
  if (explicitHref) return explicitHref;
  if ("href" in item && typeof item.href === "string" && item.href) {
    return item.href;
  }
  const id = (item.id || "").toLowerCase();
  const title = (item.title || "").toLowerCase();

  if (id.includes("live") || title.includes("live") || title.includes("portal")) {
    return "/admin/packages?tab=packages&status=PUBLISHED";
  }
  if (id.includes("draft") || title.includes("draft")) {
    return "/admin/packages?tab=packages&status=DRAFT";
  }
  if (id.includes("addon") || id.includes("add-on") || title.includes("add on") || title.includes("addon")) {
    return "/admin/packages?tab=addons";
  }
  return "/admin/packages?tab=packages";
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

export function MetricCard({ item, href, onClick }: MetricCardProps) {
  const router = useRouter();
  const explicitIcon = "icon" in item ? item.icon : undefined;
  const iconKey = "iconKey" in item ? item.iconKey : undefined;

  const targetHref = resolveCardHref(item, href);
  const isClickable = Boolean(onClick || targetHref);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (targetHref) {
      router.push(targetHref);
    }
  };

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
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      aria-label={`${item.title}: ${item.value}. Click to view details.`}
      className={`group relative flex-1 bg-canvas border border-hairline rounded-[0.5rem] p-4 sm:px-6 sm:py-[1.75rem] flex items-start justify-between gap-3 shadow-xs transition-all ${
        isClickable
          ? "cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 select-none"
          : "hover:border-brand-border/40"
      }`}
    >
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center space-x-1.5">
          <p className="font-trade font-normal text-sub text-base sm:text-[1.125rem] leading-[132%] truncate">
            {item.title}
          </p>
          {isClickable && (
            <ArrowUpRight className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-150 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
          )}
        </div>
        <p className="font-trade font-bold text-2xl sm:text-[2rem] text-main leading-tight">
          {item.value}
        </p>
      </div>

      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[0.75rem] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconBgClass}`}
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
