import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tradeGothic = localFont({
  src: "../public/fonts/Trade-Gothic-Medium.otf",
  variable: "--font-trade-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "At Ease Inspections - Schedule an Inspection",
  description: "Schedule an inspection with At Ease Inspections",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${tradeGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
