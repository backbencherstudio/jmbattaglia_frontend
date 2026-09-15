import { Suspense } from "react";
import { StepperLayout } from "@/components/stepper/StepperLayout";

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
