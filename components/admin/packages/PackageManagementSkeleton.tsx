import React from "react";

export function PackageCardSkeleton() {
  return (
    <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs p-3 flex flex-col justify-between space-y-3">
      {/* Thumbnail Skeleton */}
      <div className="relative w-full h-48 sm:h-52 rounded-xl bg-neutral-200 overflow-hidden" />

      {/* Badges Row Skeleton */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-24 bg-neutral-200 rounded-md" />
          <div className="h-6 w-16 bg-neutral-200 rounded-md" />
        </div>
        <div className="h-6 w-20 bg-neutral-200 rounded-md" />
      </div>

      {/* Title & Price Skeleton */}
      <div className="flex items-baseline justify-between gap-2 pt-1">
        <div className="h-6 w-40 sm:w-48 bg-neutral-200 rounded-md" />
        <div className="h-7 w-20 bg-neutral-200 rounded-md shrink-0" />
      </div>

      {/* Description Skeleton */}
      <div className="space-y-1.5 pt-1">
        <div className="h-3.5 w-full bg-neutral-100 rounded-md" />
        <div className="h-3.5 w-3/4 bg-neutral-100 rounded-md" />
      </div>
    </div>
  );
}

export function AddonCardSkeleton() {
  return (
    <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs p-3 flex flex-col justify-between space-y-3">
      {/* Thumbnail Skeleton */}
      <div className="relative w-full h-44 sm:h-48 rounded-xl bg-neutral-200 overflow-hidden" />

      {/* Title & Price Row */}
      <div className="flex items-center justify-between gap-2 mt-2 px-1">
        <div className="h-5 w-32 bg-neutral-200 rounded-md" />
        <div className="h-6 w-14 bg-neutral-200 rounded-md shrink-0" />
      </div>

      {/* Short Description */}
      <div className="px-1 pt-0.5 space-y-1">
        <div className="h-3 w-full bg-neutral-100 rounded-md" />
        <div className="h-3 w-2/3 bg-neutral-100 rounded-md" />
      </div>
    </div>
  );
}

export function PackageManagementSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Controls Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="h-8 w-56 sm:w-64 bg-neutral-200 rounded-lg" />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3">
          <div className="w-full sm:w-64 h-11 bg-neutral-200 rounded-xl" />
          <div className="w-full sm:w-36 h-11 bg-primary/25 rounded-xl" />
          <div className="w-full sm:w-36 h-11 bg-neutral-200 rounded-xl" />
        </div>
      </div>

      {/* Underline Tabs Skeleton */}
      <div className="flex items-center space-x-6 border-b border-hairline pb-2">
        <div className="h-7 w-28 bg-neutral-200 rounded-md" />
        <div className="h-7 w-24 bg-neutral-100 rounded-md" />
      </div>

      {/* Sub Pill Tabs Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="h-9 w-28 bg-neutral-200 rounded-full" />
        <div className="h-9 w-36 bg-neutral-100 rounded-full" />
      </div>

      {/* Package Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <PackageCardSkeleton key={idx} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="rounded-2xl overflow-hidden border border-hairline shadow-xs bg-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="h-4 w-36 bg-neutral-200 rounded-md" />
        <div className="flex items-center space-x-2">
          <div className="h-8 w-14 bg-neutral-200 rounded-lg" />
          <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
          <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
          <div className="h-8 w-14 bg-neutral-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default PackageManagementSkeleton;
