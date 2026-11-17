import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PackageManagementContent } from "@/components/admin/packages/PackageManagementContent";
import { PackageManagementSkeleton } from "@/components/admin/packages/PackageManagementSkeleton";

export const metadata: Metadata = {
  title: "Package Management | At Ease Admin",
  description: "Manage inspection packages and services",
};

export default function PackageManagementPage() {
  return (
    <Suspense fallback={<PackageManagementSkeleton />}>
      <PackageManagementContent />
    </Suspense>
  );
}
