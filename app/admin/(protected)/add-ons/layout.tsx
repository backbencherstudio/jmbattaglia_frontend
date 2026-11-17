import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add-on Services | At Ease Admin",
  description: "Manage optional inspection add-on services",
};

export default function AddOnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

