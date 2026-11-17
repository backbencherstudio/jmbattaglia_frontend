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
  title: {
    default: "Book Home Inspection | At Ease Inspections",
    template: "%s | At Ease Inspections",
  },
  description: "Schedule a certified home inspection with At Ease Inspections",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TopLoader />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
