import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | At Ease Admin",
  description: "At Ease Inspections Administrative Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

