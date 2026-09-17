"use client";

import React from "react";
import { MetricCardProps } from "@/types/metrics";

export function MetricCard({ item }: MetricCardProps) {
  const Icon = item.icon;

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
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[0.75rem] flex items-center justify-center shrink-0 ${item.iconBgClass}`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColorClass}`} />
      </div>
    </div>
  );
}
