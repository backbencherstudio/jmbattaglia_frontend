import React from "react";

export function KeyMetricsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header & Actions Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="h-6 w-32 bg-neutral-200 rounded-md" />
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="h-9 w-28 sm:w-32 bg-primary/25 rounded-md" />
          <div className="h-9 w-28 sm:w-32 bg-neutral-200 rounded-md" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 bg-canvas border border-hairline rounded-[0.5rem] p-4 sm:px-6 sm:py-[1.75rem] flex items-start justify-between gap-3 shadow-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="h-4 w-28 bg-neutral-200 rounded-md" />
              <div className="h-8 w-14 bg-neutral-200 rounded-md" />
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[0.75rem] bg-neutral-200 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RecentPackagesTableSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4 pt-2 animate-pulse">
      {/* Table Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 sm:w-48 bg-neutral-200 rounded-md" />
        <div className="h-10 w-24 bg-neutral-200 rounded-lg" />
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-white rounded-2xl border border-hairline overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-canvas border-b border-hairline">
              <tr>
                {["Package Name", "Category", "Type", "Price", "Status", "Updated"].map(
                  (header, idx) => (
                    <th
                      key={idx}
                      className="py-3 sm:py-3.5 px-4 sm:px-6 border-r last:border-r-0 border-hairline"
                    >
                      <div className="h-4 w-20 bg-neutral-200 rounded-md" />
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {/* Name */}
                  <td className="py-4 px-4 sm:px-6 border-r border-hairline">
                    <div className="h-5 w-36 sm:w-44 bg-neutral-200 rounded-md" />
                  </td>
                  {/* Category */}
                  <td className="py-4 px-4 sm:px-6 border-r border-hairline">
                    <div className="h-4 w-24 bg-neutral-100 rounded-md" />
                  </td>
                  {/* Type */}
                  <td className="py-4 px-4 sm:px-6 border-r border-hairline">
                    <div className="h-4 w-16 bg-neutral-100 rounded-md" />
                  </td>
                  {/* Price */}
                  <td className="py-4 px-4 sm:px-6 border-r border-hairline">
                    <div className="h-4 w-14 bg-neutral-200 rounded-md" />
                  </td>
                  {/* Status */}
                  <td className="py-4 px-4 sm:px-6 border-r border-hairline">
                    <div className="h-7 w-20 bg-neutral-100 rounded-md" />
                  </td>
                  {/* Updated */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="h-4 w-20 bg-neutral-100 rounded-md" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white border-t border-hairline">
          <div className="h-4 w-36 bg-neutral-200 rounded-md" />
          <div className="flex items-center space-x-1.5">
            <div className="h-8 w-14 bg-neutral-200 rounded-lg" />
            <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
            <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
            <div className="h-8 w-14 bg-neutral-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <KeyMetricsSkeleton />
      <RecentPackagesTableSkeleton />
    </div>
  );
}

export default DashboardSkeleton;
