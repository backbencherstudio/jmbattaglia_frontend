"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  DollarSign,
  Image as ImageIcon,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGetAdminPackagesQuery } from "@/redux/features/packages/packageApi";
import { useGetAdminAddonsQuery } from "@/redux/features/packages/addonApi";
import type { DashboardSummary } from "@/types/dashboard";
import type { ApiPackage } from "@/types/packages";

export interface NeedsAttentionWidgetProps {
  summary?: DashboardSummary;
}

interface AttentionIssue {
  id: string;
  type: "zero-price" | "missing-media" | "stale-draft" | "empty-addons";
  title: string;
  description: string;
  severity: "high" | "medium" | "low" | "info";
  actionText: string;
  actionUrl: string;
}

export function NeedsAttentionWidget({ summary }: NeedsAttentionWidgetProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  // Fetch live packages and add-ons for attention auditing
  const { data: packagesResponse, isLoading: isLoadingPackages } =
    useGetAdminPackagesQuery({ limit: 50 });
  const { data: addonsResponse, isLoading: isLoadingAddons } =
    useGetAdminAddonsQuery({ limit: 1 });

  const rawPackages: ApiPackage[] = Array.isArray(packagesResponse?.data)
    ? (packagesResponse.data as ApiPackage[])
    : (packagesResponse?.data as any)?.items || [];

  const totalAddons =
    typeof addonsResponse?.data?.total === "number"
      ? addonsResponse.data.total
      : summary?.addOnServices ?? 0;

  const now = Date.now();
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

  const issues: AttentionIssue[] = [];

  // 1. Audit published packages with $0 or missing price
  rawPackages.forEach((pkg) => {
    const isPublished =
      (pkg.status || "").toUpperCase() === "PUBLISHED" ||
      (pkg as any).rawStatus === "PUBLISHED";
    const priceCents =
      typeof pkg.priceCents === "number"
        ? pkg.priceCents
        : parseInt(String((pkg as any).price || "").replace(/[^0-9]/g, ""), 10) || 0;
    const isQuoteRequired = Boolean((pkg as any).quoteRequired);

    if (isPublished && priceCents <= 0 && !isQuoteRequired) {
      issues.push({
        id: `price-${pkg.id}`,
        type: "zero-price",
        title: `${pkg.name} — $0 Live Price`,
        description:
          "Published with $0.00 and Quote Required is disabled. Clients may book this inspection for free.",
        severity: "high",
        actionText: "Fix Price",
        actionUrl: `/admin/packages?tab=packages&view=create&id=${pkg.id}&step=basic`,
      });
    }
  });

  // 2. Audit published packages missing custom media or descriptions
  rawPackages.forEach((pkg) => {
    const isPublished =
      (pkg.status || "").toUpperCase() === "PUBLISHED" ||
      (pkg as any).rawStatus === "PUBLISHED";
    const desc = pkg.description || (pkg as any).shortDescription || "";
    const hasDesc = desc.trim().length >= 10;
    const image = (pkg as any).imageUrl || (pkg as any).mediaUrl || (pkg as any).image || "";
    const hasMedia =
      Boolean(image) &&
      !image.includes("placeholder") &&
      image !== "/package-card.png";

    if (isPublished && (!hasDesc || !hasMedia)) {
      issues.push({
        id: `media-${pkg.id}`,
        type: "missing-media",
        title: `${pkg.name} — Incomplete Marketing Profile`,
        description: !hasDesc
          ? "Missing comprehensive package description for portal shoppers."
          : "Missing customized photography or video overview.",
        severity: "medium",
        actionText: "Complete Details",
        actionUrl: `/admin/packages?tab=packages&view=create&id=${pkg.id}&step=media`,
      });
    }
  });

  // 3. Audit stale drafts older than 14 days without edits
  rawPackages.forEach((pkg) => {
    const isDraft =
      (pkg.status || "").toUpperCase() === "DRAFT" ||
      (pkg as any).rawStatus === "DRAFT";
    const updatedAt = pkg.updatedAt ? new Date(pkg.updatedAt).getTime() : 0;

    if (isDraft && updatedAt > 0 && now - updatedAt > fourteenDaysMs) {
      const daysOld = Math.floor((now - updatedAt) / (24 * 60 * 60 * 1000));
      issues.push({
        id: `draft-${pkg.id}`,
        type: "stale-draft",
        title: `${pkg.name} — Stale Draft (${daysOld} days untouched)`,
        description:
          "This draft has been inactive for over 14 days. Review to publish or archive to declutter.",
        severity: "low",
        actionText: "Review Draft",
        actionUrl: `/admin/packages?tab=packages&view=create&id=${pkg.id}&step=basic`,
      });
    }
  });

  // 4. Audit empty add-ons catalog
  if (!isLoadingAddons && totalAddons === 0) {
    issues.push({
      id: "empty-addons",
      type: "empty-addons",
      title: "Add-on Services Catalog Is Empty",
      description:
        "No Add-on services configured yet. Sync from ISN or click here to add your first ancillary inspection service.",
      severity: "info",
      actionText: "Add First Ancillary Service",
      actionUrl: "/admin/packages?tab=addons",
    });
  }

  const isLoading = isLoadingPackages || isLoadingAddons;

  if (isLoading) {
    return (
      <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 animate-pulse space-y-3">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-12 w-full bg-gray-100 rounded-xl" />
      </div>
    );
  }

  // All clear state
  if (issues.length === 0) {
    return (
      <div className="bg-[#24B33C0A] border border-[#24B33C29] rounded-2xl p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#24B33C1F] border border-[#24B33C33] flex items-center justify-center shrink-0 text-[#1E9432]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-trade font-bold text-sm sm:text-base text-main">
              Catalog Health: All Systems Clear
            </h3>
            <p className="text-xs text-sub">
              All live packages have verified pricing, complete media assets, and active schedules.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/admin/packages?tab=packages")}
          className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
        >
          <span>View catalog</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const highCount = issues.filter((i) => i.severity === "high").length;

  return (
    <div className="bg-canvas border border-amber-200/80 rounded-2xl overflow-hidden shadow-xs transition-all">
      {/* Widget Header */}
      <div className="bg-amber-50/70 border-b border-amber-200/60 p-4 sm:px-6 sm:py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <h3 className="font-trade font-bold text-sm sm:text-base text-main">
              Needs Attention
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                highCount > 0
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {issues.length} {issues.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-1.5 hover:bg-amber-100/60 text-sub hover:text-main rounded-lg transition-colors cursor-pointer"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Widget Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-2.5">
          {issues.map((issue) => {
            let IconComponent = AlertTriangle;
            let iconBoxClass = "bg-amber-100 text-amber-800 border-amber-200";

            if (issue.type === "zero-price") {
              IconComponent = DollarSign;
              iconBoxClass = "bg-red-100 text-red-700 border-red-200";
            } else if (issue.type === "missing-media") {
              IconComponent = ImageIcon;
              iconBoxClass = "bg-orange-100 text-orange-700 border-orange-200";
            } else if (issue.type === "stale-draft") {
              IconComponent = Clock;
              iconBoxClass = "bg-purple-100 text-purple-700 border-purple-200";
            } else if (issue.type === "empty-addons") {
              IconComponent = Sparkles;
              iconBoxClass = "bg-blue-100 text-blue-700 border-blue-200";
            }

            return (
              <div
                key={issue.id}
                className="bg-white border border-hairline hover:border-brand-border/60 rounded-xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-2xs"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${iconBoxClass}`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-trade font-semibold text-xs sm:text-sm text-main truncate">
                      {issue.title}
                    </p>
                    <p className="text-xs text-sub leading-snug line-clamp-2">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(issue.actionUrl)}
                  className="sm:shrink-0 flex items-center justify-center space-x-1 px-3 py-1.5 bg-canvas hover:bg-gray-100 active:scale-95 border border-hairline text-main text-xs font-semibold rounded-lg transition-all cursor-pointer self-start sm:self-auto"
                >
                  <span>{issue.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sub" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NeedsAttentionWidget;

