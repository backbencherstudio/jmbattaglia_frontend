"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { TopStepper } from "@/components/stepper/TopStepper";
import { LeftSubStepper } from "@/components/stepper/LeftSubStepper";
import { Button } from "@/components/ui/Button";
import { useStepperForm } from "@/hooks/useStepperForm";
import { WhoItsForStep } from "@/components/stepper/steps/WhoItsForStep";
import { CustomerTypeStep } from "@/components/stepper/steps/CustomerTypeStep";
import { YourInfoStep } from "@/components/stepper/steps/YourInfoStep";
import { GenericStep } from "@/components/stepper/steps/GenericStep";

export const StepperLayout: React.FC = () => {
  const stepper = useStepperForm();

  const renderActiveStepContent = () => {
    const stepProps = {
      formData: stepper.formData,
      updateFormData: stepper.updateFormData,
      errors: stepper.errors,
      setError: stepper.setError,
      clearError: stepper.clearError,
    };

    switch (stepper.currentSubStep?.id) {
      case "who-its-for":
        return <WhoItsForStep {...stepProps} />;
      case "customer-type":
        return <CustomerTypeStep {...stepProps} />;
      case "your-info":
        return <YourInfoStep {...stepProps} />;
      default:
        return (
          <GenericStep
            {...stepProps}
            title={stepper.currentSubStep?.title || "Inspection Step"}
            description="Configure your inspection details below."
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--layout-bg,#FFFFFF)]">
      {/* Header */}
      <Header />

      {/* Top Stepper Bar */}
      <TopStepper
        steps={stepper.steps}
        activeStepIndex={stepper.currentMainStepIndex}
        onStepClick={stepper.selectMainStep}
      />

      {/* Main Content Area - #F7F7F6 Layout BG as requested */}
      <main className="flex-1 bg-[var(--surface-canvas,#F7F7F6)] py-8 px-4 md:px-12 flex justify-center">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 items-start">
          {/* Left Sub-Stepper Navigation */}
          {stepper.currentMainStep.subSteps.length > 0 && (
            <LeftSubStepper
              subSteps={stepper.currentMainStep.subSteps}
              activeSubStepIndex={stepper.currentSubStepIndex}
              onSubStepClick={stepper.selectSubStep}
            />
          )}

          {/* Right Main Step Form Card */}
          <div className="flex-1 w-full bg-white rounded-3xl p-6 md:p-10 border border-[var(--border-hairline,#E3E3E1)] shadow-xs flex flex-col justify-between min-h-[460px]">
            {/* Step Form Renderer */}
            <div className="flex-1">{renderActiveStepContent()}</div>

            {/* Bottom Actions Bar (Image 1 & 2 matching) */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border-hairline,#E3E3E1)]">
              <Button
                type="button"
                variant="outline"
                onClick={stepper.goToBack}
                disabled={stepper.isFirstStep}
                className="px-8 py-3 rounded-2xl text-sm font-semibold"
              >
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={stepper.goToNext}
                className="px-10 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                {stepper.isLastStep ? "Complete Order" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
