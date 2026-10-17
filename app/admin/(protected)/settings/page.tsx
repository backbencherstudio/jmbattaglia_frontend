import { Suspense } from "react";
import { SettingsContent } from "@/components/admin/settings/SettingsContent";
import { SettingsSkeleton } from "@/components/admin/settings/SettingsSkeleton";

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
