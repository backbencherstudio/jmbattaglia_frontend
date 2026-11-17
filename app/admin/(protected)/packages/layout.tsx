import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Package Management | At Ease Admin",
  description: "Manage inspection packages and services",
};

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

