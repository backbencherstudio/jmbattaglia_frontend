"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { useRouter } from "next/navigation";
import { format24hToDisplayTime } from "@/lib/bookingUtils";
import { RESALE_PACKAGES, NEW_CONSTRUCTION_PACKAGES, ADDONS_CONFIG } from "@/data/packageAddonsData";

interface ReviewStepProps extends StepProps {
  onNavigateToStep?: (mainStepId: string, subStepId: string) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  onNavigateToStep,
}) => {
  const router = useRouter();

  const handleEdit = (mainStepId: string, subStepId: string) => {
    if (onNavigateToStep) {
      onNavigateToStep(mainStepId, subStepId);
    } else {
      router.push(`/?step=${mainStepId}&substep=${subStepId}`);
    }
  };

  // Resolve packages & addons for fallback display
  const allPackages = [...RESALE_PACKAGES, ...NEW_CONSTRUCTION_PACKAGES];
  const selectedPkg = allPackages.find((p) => p.id === formData.selectedPackage) || allPackages[0];
  const selectedAddonsList = (formData.selectedAddons || [])
    .map((id) => ADDONS_CONFIG.find((a) => a.id === id))
    .filter(Boolean);

  const fallbackTotal =
    (selectedPkg?.priceNumeric || 0) +
    selectedAddonsList.reduce((acc, a) => acc + (a?.priceNumeric || 0), 0);

  const quoteLines = formData.calculatedQuote?.lines;
  const quoteTotal =
    formData.calculatedQuote && formData.calculatedQuote.totalCents > 0
      ? formData.calculatedQuote.totalCents / 100
      : fallbackTotal;

  const displayTime = format24hToDisplayTime(formData.selectedTimeSlot);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Section: 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Column: Property Details */}
        <div className="lg:col-span-7 bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
            <h3 className="text-base sm:text-lg font-bold text-main">Property Details</h3>
            <button
              type="button"
              onClick={() => handleEdit("inspection", "property-details")}
              className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-all"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Year Built:</span>
              <span className="text-main font-bold text-right">{formData.yearBuilt || "Not specified"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Square Feet:</span>
              <span className="text-main font-bold text-right">
                {formData.squareFeet ? `${formData.squareFeet} sq ft` : "Not specified"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Foundation Type:</span>
              <span className="text-main font-bold text-right">
                {formData.foundationName || formData.foundationType || "Slab on grade"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Client Attending:</span>
              <span className="text-main font-bold text-right">{formData.clientAttending || "Yes"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Home Occupied:</span>
              <span className="text-main font-bold text-right">{formData.homeOccupied || "Occupied"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Gated Community:</span>
              <span className="text-main font-bold text-right">{formData.isGatedCommunity || "No"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Alarm System:</span>
              <span className="text-main font-bold text-right">{formData.hasAlarmSystem || "No"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Pool / Spa:</span>
              <span className="text-main font-bold text-right">{formData.hasPoolSpa || "None"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Utilities On:</span>
              <span className="text-main font-bold text-right">{formData.utilitiesOn || "All Utilities On"}</span>
            </div>

            {formData.gateCode && (
              <div className="flex justify-between items-center py-0.5">
                <span className="text-sub font-medium">Gate Code:</span>
                <span className="text-main font-bold text-right">{formData.gateCode}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Sewage System:</span>
              <span className="text-main font-bold text-right">{formData.sewageSystem || "Public Sewer Line"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Water System:</span>
              <span className="text-main font-bold text-right">{formData.waterSystem || "Public / Municipal Water"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Referral:</span>
              <span className="text-main font-bold text-right">{formData.hearAboutUs || "Google Search / Web"}</span>
            </div>

            {formData.dueDiligence && (
              <div className="flex justify-between items-center py-0.5">
                <span className="text-sub font-medium">Due Diligence:</span>
                <span className="text-main font-bold text-right">{formData.dueDiligence}</span>
              </div>
            )}

            {formData.specialInstructions && (
              <div className="flex justify-between items-start pt-1">
                <span className="text-sub font-medium min-w-32">Notes:</span>
                <span className="text-main font-bold text-right max-w-[60%]">
                  {formData.specialInstructions}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Personal Info, Address, Appointment */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          {/* Personal Info Box */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
              <h3 className="text-base font-bold text-main">Contact Info</h3>
              <button
                type="button"
                onClick={() => handleEdit("about-you", "your-info")}
                className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-all"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Name:</span>
                <span className="text-main font-bold text-right">
                  {formData.firstName || ""} {formData.lastName || ""}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Email:</span>
                <span className="text-main font-bold text-right">{formData.email || ""}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Phone:</span>
                <span className="text-main font-bold text-right">{formData.phone || ""}</span>
              </div>

              {formData.customerRole === "buyers-agent" && formData.buyerFirstName && (
                <div className="mt-2 pt-2 border-t border-hairline/60 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-primary">Buyer Client:</span>
                  <div className="flex justify-between items-center">
                    <span className="text-sub font-medium">Client Name:</span>
                    <span className="text-main font-bold text-right">
                      {formData.buyerFirstName} {formData.buyerLastName || ""}
                    </span>
                  </div>
                  {formData.buyerEmail && (
                    <div className="flex justify-between items-center">
                      <span className="text-sub font-medium">Client Email:</span>
                      <span className="text-main font-bold text-right">{formData.buyerEmail}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Address Box */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
              <h3 className="text-base font-bold text-main">Inspection Address</h3>
              <button
                type="button"
                onClick={() => handleEdit("inspection", "property-address")}
                className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-all"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Address:</span>
                <span className="text-main font-bold text-right">
                  {formData.addressLine1 || "123 Main Street"}
                  {formData.addressLine2 ? `, ${formData.addressLine2}` : ""}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">City, State, Zip:</span>
                <span className="text-main font-bold text-right">
                  {formData.city || "Atlanta"}, {formData.state || "GA"} {formData.zipCode || "30301"}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Date & Time Box */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
              <h3 className="text-base font-bold text-main">Appointment</h3>
              <button
                type="button"
                onClick={() => handleEdit("schedule", "date-time")}
                className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-all"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Date:</span>
                <span className="text-main font-bold text-right">{formData.selectedDate || "Not chosen"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Time Slot:</span>
                <span className="text-main font-bold text-right">{displayTime}</span>
              </div>
              {formData.inspectorName && (
                <div className="flex justify-between items-center">
                  <span className="text-sub font-medium">Inspector:</span>
                  <span className="text-main font-bold text-right">{formData.inspectorName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Package Amounts & Verified Quote */}
      <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xs">
        <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-main">Inspection Services & Fees</h3>
            {formData.quoteId && (
              <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                ISN Quoted
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleEdit("inspection", "package-addons")}
            className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-all"
          >
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-2 text-xs sm:text-sm">
          {quoteLines && quoteLines.length > 0 ? (
            quoteLines.map((line, idx) => (
              <div key={line.id || idx} className="flex justify-between items-center">
                <span className="text-sub font-medium">{line.name}:</span>
                <span className="text-main font-bold text-right">
                  +${(line.amountCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">{selectedPkg?.title || "Package"}:</span>
                <span className="text-main font-bold text-right">+${(selectedPkg?.priceNumeric || 0).toLocaleString()}</span>
              </div>
              {selectedAddonsList.map((addon, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sub font-medium">{addon?.title}:</span>
                  <span className="text-main font-bold text-right">+${(addon?.priceNumeric || 0).toLocaleString()}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Bottom Section: Total Amounts */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-extrabold text-main tracking-tight">Total Quoted Amount</h3>
          <span className="text-xl sm:text-2xl font-extrabold text-[#FF6900]">
            ${quoteTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-sub font-medium">
          Real ISN direct booking quotation. Click Complete Order to submit your inspection request.
        </p>
      </div>
    </div>
  );
};
