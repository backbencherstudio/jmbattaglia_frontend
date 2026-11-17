import type { Metadata } from "next";
import { Suspense } from "react";
import { StepperLayout } from "@/components/stepper/StepperLayout";

export const metadata: Metadata = {
  title: "Book Home Inspection | At Ease Inspections",
  description: "Schedule a certified home inspection with At Ease Inspections.",
};

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-layout-bg flex items-center justify-center text-main font-bold">
          Loading...
        </div>
      }
    >
      <StepperLayout />
    </Suspense>
  );
}
