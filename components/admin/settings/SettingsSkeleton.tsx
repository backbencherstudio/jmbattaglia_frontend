import React from "react";

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="h-3.5 w-16 bg-neutral-200 rounded-md" />
        <div className="h-3.5 w-3 bg-neutral-200 rounded-sm" />
        <div className="h-3.5 w-24 bg-neutral-200 rounded-md" />
      </div>

      {/* Main Container Card Skeleton */}
      <div className="bg-canvas border border-hairline rounded-2xl p-6 md:p-8 space-y-8 shadow-2xs">
        {/* Header Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 w-52 bg-neutral-200 rounded-lg" />
          <div className="h-3.5 w-80 max-w-full bg-neutral-100 rounded-md" />
        </div>

        {/* Profile Picture Uploader Skeleton */}
        <div className="space-y-2.5">
          <div className="h-4 w-32 bg-neutral-200 rounded-md" />

          <div className="flex items-center space-x-3">
            {/* Avatar box */}
            <div className="w-16 h-16 rounded-xl bg-neutral-200 shrink-0" />

            {/* Action buttons */}
            <div className="flex flex-col space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-200" />
              <div className="w-8 h-8 rounded-lg bg-neutral-200" />
            </div>
          </div>
          <div className="h-3 w-44 bg-neutral-100 rounded-md" />
        </div>

        {/* Form Inputs Skeleton */}
        <div className="space-y-6">
          {/* Row 1: Profile Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-neutral-200 rounded-md" />
              <div className="h-11 w-full bg-white border border-hairline rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-neutral-200 rounded-md" />
                <div className="h-3.5 w-16 bg-neutral-100 rounded-md" />
              </div>
              <div className="h-11 w-full bg-white border border-hairline rounded-xl" />
            </div>
          </div>

          {/* Row 2: Security & Password */}
          <div className="pt-4 border-t border-hairline space-y-4">
            <div className="space-y-1.5">
              <div className="h-4 w-36 bg-neutral-200 rounded-md" />
              <div className="h-3 w-96 max-w-full bg-neutral-100 rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-3.5 w-28 bg-neutral-200 rounded-md" />
                <div className="h-11 w-full bg-white border border-hairline rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-28 bg-neutral-200 rounded-md" />
                <div className="h-11 w-full bg-white border border-hairline rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-28 bg-neutral-200 rounded-md" />
                <div className="h-11 w-full bg-white border border-hairline rounded-xl" />
              </div>
            </div>
          </div>

          {/* Save Button Skeleton */}
          <div className="pt-3">
            <div className="h-11 w-36 bg-primary/25 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSkeleton;
