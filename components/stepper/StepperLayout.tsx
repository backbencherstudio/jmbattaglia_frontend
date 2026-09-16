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
import { InspectionTypeStep } from "@/components/stepper/steps/InspectionTypeStep";
import { PropertyAddressStep } from "@/components/stepper/steps/PropertyAddressStep";
import { PropertyDetailsStep } from "@/components/stepper/steps/PropertyDetailsStep";
import { PackageAddonsStep } from "@/components/stepper/steps/PackageAddonsStep";
import { DateTimeStep } from "@/components/stepper/steps/DateTimeStep";
import { ReviewStep } from "@/components/stepper/steps/ReviewStep";
import { ConfirmationStep } from "@/components/stepper/steps/ConfirmationStep";
import { GenericStep } from "@/components/stepper/steps/GenericStep";

export const StepperLayout: React.FC = () => {
  const stepper = useStepperForm();

  const handleNavigateToStep = (mainStepId: string, subStepId: string) => {
    const mainIdx = stepper.steps.findIndex((s) => s.id === mainStepId);
    if (mainIdx !== -1) {
      const subIdx = stepper.steps[mainIdx].subSteps.findIndex((sub) => sub.id === subStepId);
      if (subIdx !== -1) {
        stepper.navigateToStep(mainIdx, subIdx);
      }
    }
  };

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
      case "inspection-type":
        return <InspectionTypeStep {...stepProps} />;
      case "property-address":
        return <PropertyAddressStep {...stepProps} />;
      case "property-details":
        return <PropertyDetailsStep {...stepProps} />;
      case "package-addons":
        return <PackageAddonsStep {...stepProps} />;
      case "date-time":
        return <DateTimeStep {...stepProps} />;
      case "review":
        return <ReviewStep {...stepProps} onNavigateToStep={handleNavigateToStep} />;
      case "confirmation":
        return <ConfirmationStep {...stepProps} />;
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
    <div className="min-h-screen flex flex-col bg-layout-bg">
      {/* Header */}
      <Header />

      {/* Top Stepper Bar */}
      <TopStepper
        steps={stepper.steps}
        activeStepIndex={stepper.currentMainStepIndex}
        onStepClick={stepper.selectMainStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 bg-canvas py-4 sm:py-6 lg:py-8 px-3 sm:px-6 lg:px-12 flex justify-center">
        <div className="w-full max-w-376 flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          {/* Left Sub-Stepper Navigation */}
          {stepper.currentMainStep.subSteps.length > 0 && (
            <LeftSubStepper
              subSteps={stepper.currentMainStep.subSteps}
              activeSubStepIndex={stepper.currentSubStepIndex}
              onSubStepClick={stepper.selectSubStep}
            />
          )}

          {/* Right Main Step Form Card */}
          <div className="flex-1 w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-10 border border-hairline shadow-xs flex flex-col justify-between min-h-[420px] sm:min-h-[460px]">
            {/* Step Form Renderer */}
            <div className="flex-1">{renderActiveStepContent()}</div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-hairline">
              <Button
                type="button"
                variant="outline"
                onClick={stepper.goToBack}
                disabled={stepper.isFirstStep}
                className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold"
              >
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={stepper.goToNext}
                className="px-8 py-2.5 sm:px-10 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-xs hover:scale-[1.02] active:scale-[0.98]"
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
