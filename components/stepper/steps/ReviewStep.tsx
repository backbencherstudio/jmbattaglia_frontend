"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { useRouter } from "next/navigation";

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
              <span className="text-sub font-medium">Year Built :</span>
              <span className="text-main font-bold text-right">{formData.yearBuilt || "e.g. 1998"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Square Feet :</span>
              <span className="text-main font-bold text-right">
                {formData.squareFeet ? `${formData.squareFeet} sq ft` : "e.g. 2,200 sq ft"}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Foundation Type :</span>
              <span className="text-main font-bold text-right">{formData.foundationType || "Crawl Space"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Client Attending :</span>
              <span className="text-main font-bold text-right">{formData.clientAttending || "Yes - Client Present"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Home Occupied :</span>
              <span className="text-main font-bold text-right">{formData.homeOccupied || "Occupied"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Gated Community :</span>
              <span className="text-main font-bold text-right">{formData.gatedCommunity || "Yes"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Alarm System :</span>
              <span className="text-main font-bold text-right">{formData.alarmSystem || "Yes"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Pool/Spa :</span>
              <span className="text-main font-bold text-right">{formData.poolSpa || "Yes"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Utilities On :</span>
              <span className="text-main font-bold text-right">{formData.utilitiesOn || "All Utilities On"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Gate Code :</span>
              <span className="text-main font-bold text-right">{formData.gateCode || "01254"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Sewage System :</span>
              <span className="text-main font-bold text-right">{formData.sewageSystem || "Public Sewer System"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Water System :</span>
              <span className="text-main font-bold text-right">{formData.waterSystem || "Well Water"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Referred:</span>
              <span className="text-main font-bold text-right">{formData.referredBy || "Real Estate Agent"}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-sub font-medium">Due Diligence :</span>
              <span className="text-main font-bold text-right">{formData.dueDiligence || "Any Due"}</span>
            </div>

            <div className="flex justify-between items-start pt-1">
              <span className="text-sub font-medium min-w-32">Special Instructions or Notes:</span>
              <span className="text-main font-bold text-right max-w-[60%] truncate">
                {formData.specialNotes || "Access instructions, anything we should know..."}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Info, Address, Appointment Date & Time */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full">
          {/* Personal Info Box */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
              <h3 className="text-base font-bold text-main">Personal Info</h3>
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
                <span className="text-sub font-medium">First Name :</span>
                <span className="text-main font-bold text-right">{formData.firstName || "Naffziger"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Last Name :</span>
                <span className="text-main font-bold text-right">{formData.lastName || "Realty"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Email Address :</span>
                <span className="text-main font-bold text-right">{formData.email || "info@nrcga.com"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Mobile Phone :</span>
                <span className="text-main font-bold text-right">{formData.phone || "(678) 631-1892"}</span>
              </div>
            </div>
          </div>

          {/* Address Box */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
              <h3 className="text-base font-bold text-main">Address</h3>
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
                <span className="text-sub font-medium">Address Line 1 :</span>
                <span className="text-main font-bold text-right">{formData.addressLine1 || "123 Main Street"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Address Line 2 :</span>
                <span className="text-main font-bold text-right">{formData.addressLine2 || "Apt 2B, Unit 100"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">City :</span>
                <span className="text-main font-bold text-right">{formData.city || "Atlanta"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">State :</span>
                <span className="text-main font-bold text-right">{formData.state || "Georgia (GA)"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Zip Code :</span>
                <span className="text-main font-bold text-right">{formData.zipCode || "30301"}</span>
              </div>
            </div>
          </div>

          {/* Appointment Date & Time Box */}
          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
              <h3 className="text-base font-bold text-main">Appointment Date & Time</h3>
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
                <span className="text-sub font-medium">Inspection Date :</span>
                <span className="text-main font-bold text-right">{formData.selectedDate || "15 July, 2027"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sub font-medium">Inspection Time :</span>
                <span className="text-main font-bold text-right">{formData.selectedTimeSlot || "1:00 PM"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Package Amounts Box */}
      <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xs">
        <div className="flex items-center justify-between pb-1 border-b border-hairline/60">
          <h3 className="text-base sm:text-lg font-bold text-main">Package Amounts</h3>
          <button
            type="button"
            onClick={() => handleEdit("inspection", "package-addons")}
            className="text-xs sm:text-sm font-bold text-primary hover:underline cursor-pointer transition-all"
          >
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-2 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-sub font-medium">Safe Home Package :</span>
            <span className="text-main font-bold text-right">+$1,236</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sub font-medium">Chemical Balancing:</span>
            <span className="text-main font-bold text-right">+$79</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Total Amounts */}
      <div className="flex flex-col gap-1 pt-1">
        <h3 className="text-lg sm:text-xl font-extrabold text-main tracking-tight">Total Amounts</h3>
        <p className="text-xs sm:text-sm text-sub font-medium">
          Your inspector will confirm the appointment and final scope before the visit.
        </p>
      </div>
    </div>
  );
};
