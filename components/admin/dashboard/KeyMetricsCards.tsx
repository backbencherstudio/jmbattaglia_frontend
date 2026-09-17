"use client";

import { Plus, Eye } from "lucide-react";
import { metricsData } from "@/data/metricsData";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";

export function KeyMetricsCards() {
  return (
    <div className="space-y-4">
      {/* Key Metrics Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-trade font-bold text-lg sm:text-xl text-main">
          Key Metrics
        </h2>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New package</span>
          </button>

          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-canvas border border-hairline hover:bg-canvas text-main text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer">
            <Eye className="w-4 h-4 text-sub" />
            <span>Review 1 draft</span>
          </button>
        </div>
      </div>

      {/* Responsive Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {metricsData.map((item) => (
          <MetricCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
