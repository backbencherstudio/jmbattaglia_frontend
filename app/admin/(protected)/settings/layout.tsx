import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings & Security | At Ease Admin",
  description: "Account settings, team roles, and activity audit logs",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

