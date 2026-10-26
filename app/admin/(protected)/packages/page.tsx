import React, { Suspense } from "react";
import { PackageManagementContent } from "@/components/admin/packages/PackageManagementContent";
import { PackageManagementSkeleton } from "@/components/admin/packages/PackageManagementSkeleton";

export default function PackageManagementPage() {
  return (
    <Suspense fallback={<PackageManagementSkeleton />}>
      <PackageManagementContent />
    </Suspense>
  );
}
