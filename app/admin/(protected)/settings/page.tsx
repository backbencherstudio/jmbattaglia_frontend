import { Suspense } from "react";
import type { Metadata } from "next";
import { SettingsContent } from "@/components/admin/settings/SettingsContent";
import { SettingsSkeleton } from "@/components/admin/settings/SettingsSkeleton";

export const metadata: Metadata = {
  title: "Settings & Security | At Ease Admin",
  description: "Account settings, team roles, and activity audit logs",
};

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
