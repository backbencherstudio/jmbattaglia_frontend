import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import TopLoader from "@/components/common/TopLoader";

const tradeGothic = localFont({
  src: "../public/fonts/Trade-Gothic-Medium.otf",
  variable: "--font-trade-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "At Ease Inspections - Schedule an Inspection",
  description: "Schedule an inspection with At Ease Inspections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${tradeGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TopLoader />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
