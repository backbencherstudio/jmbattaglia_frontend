import React, { Suspense } from "react";
import { PackageManagementContent } from "@/components/admin/packages/PackageManagementContent";

export default function PackageManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-main font-bold">
          Loading Package Management...
        </div>
      }
    >
      <PackageManagementContent />
    </Suspense>
  );
}
