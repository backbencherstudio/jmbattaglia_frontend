"use client";

import React, { useState } from "react";
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
import {
  useCreateDirectOrderMutation,
  useCalculateServiceQuoteMutation,
} from "@/redux/features/booking/bookingApi";
import {
  buildPropertyDto,
  buildContactDto,
  buildBuyerContactDto,
  formatTimeSlotTo24h,
  sanitizePackageAndServices,
  isValidPhone,
} from "@/lib/bookingUtils";
import { AlertCircle, RefreshCw } from "lucide-react";
import { DirectOrderPayload } from "@/types/booking";

export const StepperLayout: React.FC = () => {
  const stepper = useStepperForm();
  const [createOrder, { isLoading: isSubmittingOrder }] = useCreateDirectOrderMutation();
  const [calculateQuote, { isLoading: isCalculatingQuote }] = useCalculateServiceQuoteMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNavigateToStep = (mainStepId: string, subStepId: string) => {
    const mainIdx = stepper.steps.findIndex((s) => s.id === mainStepId);
    if (mainIdx !== -1) {
      const subIdx = stepper.steps[mainIdx].subSteps.findIndex((sub) => sub.id === subStepId);
      if (subIdx !== -1) {
        stepper.navigateToStep(mainIdx, subIdx);
      }
    }
  };

  const isReviewStep = stepper.currentSubStep?.id === "review";
  const isConfirmationStep = stepper.currentSubStep?.id === "confirmation";

  const handleCompleteOrder = async () => {
    setSubmitError(null);
    const formData = stepper.formData;

    // 1. Ensure date and time are selected
    if (!formData.selectedDate) {
      stepper.setError("selectedDate", "Please select an inspection date.");
      handleNavigateToStep("schedule", "date-time");
      return;
    }
    if (!formData.selectedTimeSlot) {
      stepper.setError("selectedTimeSlot", "Please select an appointment time slot.");
      handleNavigateToStep("schedule", "date-time");
      return;
    }

    try {
      // 2. Ensure quoteId is present; calculate fresh quote if missing
      let activeQuoteId = formData.quoteId;
      const category =
        formData.inspectionKind === "new-construction" ? "NEW_CONSTRUCTION" : "RESALE_HOME";
      const propertyDto = buildPropertyDto(formData);

      const { packageId: safePackageId, serviceIds: safeServiceIds } =
        sanitizePackageAndServices(
          category,
          formData.selectedPackage,
          formData.selectedAddons
        );

      if (!activeQuoteId) {
        const quoteRes = await calculateQuote({
          category,
          ...(safePackageId ? { packageId: safePackageId } : {}),
          serviceIds: safeServiceIds,
          property: propertyDto,
        }).unwrap();

        activeQuoteId = quoteRes?.data?.quoteId;
        if (activeQuoteId) {
          stepper.updateFormData({
            quoteId: activeQuoteId,
            calculatedQuote: quoteRes.data,
          });
        }
      }

      if (!activeQuoteId) {
        setSubmitError("Could not retrieve a valid ISN quote. Please check your property details.");
        return;
      }

      if (!formData.phone?.trim() || !isValidPhone(formData.phone.trim())) {
        setSubmitError("A valid phone number (7 to 30 characters, e.g. (404) 555-0100) is required. Please edit your Contact Info.");
        return;
      }

      // 3. Build complete order payload matching DirectOrderDto
      const customerType =
        formData.customerRole === "home-owner"
          ? "HOME_OWNER"
          : formData.customerRole === "buyers-agent"
          ? "BUYERS_AGENT"
          : "HOME_BUYER";

      const time24 = formatTimeSlotTo24h(formData.selectedTimeSlot);

      const payload: DirectOrderPayload = {
        quoteId: activeQuoteId,
        category,
        ...(safePackageId ? { packageId: safePackageId } : {}),
        serviceIds: safeServiceIds,
        property: propertyDto,
        customerType,
        contact: buildContactDto(formData),
        buyerContact: buildBuyerContactDto(formData),
        date: formData.selectedDate,
        time: time24,
        inspectorId: formData.inspectorId || "89758475-7ef9-4ebc-a264-d11c6b821d0b",
      };

      const idempotencyKey =
        formData.idempotencyKey ||
        (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "");

      const orderRes = await createOrder({
        payload,
        idempotencyKey,
      }).unwrap();

      const orderData = orderRes?.data;
      const finalOrderId =
        orderData?.orderId || orderData?.id || idempotencyKey.slice(0, 8).toUpperCase();

      // 4. Complete order: clear session draft, persist confirmation receipt, and navigate to confirmation
      stepper.completeOrder(orderData, finalOrderId);
    } catch (err: any) {
      console.error("Order submission error:", err);
      const msg =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to submit order to ISN. Please verify all details and try again.";
      setSubmitError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  const handleNextClick = () => {
    setSubmitError(null);
    if (isReviewStep) {
      handleCompleteOrder();
    } else {
      stepper.goToNext();
    }
  };

  const renderActiveStepContent = () => {
    const stepProps = {
      formData: stepper.formData,
      updateFormData: stepper.updateFormData,
      errors: stepper.errors,
      setError: stepper.setError,
      clearError: stepper.clearError,
      resetFormData: stepper.resetFormData,
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
          <div className="flex-1 w-full bg-white rounded-xl p-4 sm:p-6 lg:p-10 border border-hairline shadow-xs flex flex-col justify-between min-h-[420px] sm:min-h-[460px]">
            {/* Step Form Renderer */}
            <div className="flex-1">
              {renderActiveStepContent()}

              {/* Submission Error Alert */}
              {submitError && (
                <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{submitError}</div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-hairline">
              {isConfirmationStep ? (
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-sub font-semibold">
                    Order confirmed and saved to your device.
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stepper.resetFormData}
                    className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Start New Booking
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stepper.goToBack}
                    disabled={stepper.isFirstStep || isSubmittingOrder}
                    className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold"
                  >
                    Back
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    isLoading={isSubmittingOrder || (isReviewStep && isCalculatingQuote)}
                    onClick={handleNextClick}
                    className="px-8 py-2.5 sm:px-10 sm:py-3.5 rounded-lg text-xs sm:text-sm font-semibold text-white shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isReviewStep ? "Complete Order" : "Continue"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
