"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { CheckCircle2, Calendar, MapPin, Mail, Phone } from "lucide-react";

export const ConfirmationStep: React.FC<StepProps> = ({ formData }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 gap-6 text-center">
      {/* Check Icon Badge */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-feedback-success-bg border-2 border-[var(--feedback-success,#8C9600)] flex items-center justify-center text-[var(--feedback-success,#8C9600)] shadow-xs animate-bounce-subtle">
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>

      {/* Confirmation Title */}
      <div className="flex flex-col gap-2 max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
          Inspection Request Confirmed!
        </h2>
        <p className="text-xs sm:text-sm text-sub font-medium leading-relaxed">
          Thank you, <span className="font-bold text-main">{formData.firstName || "Customer"}</span>. Your home inspection request has been successfully submitted. Our team will review the details and confirm your schedule.
        </p>
      </div>

      {/* Summary Highlights Card */}
      <div className="w-full max-w-xl bg-canvas border border-hairline rounded-2xl p-5 sm:p-6 flex flex-col gap-4 text-left shadow-2xs">
        <h3 className="text-base font-bold text-main border-b border-hairline/60 pb-2">
          Order Summary & Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-muted font-bold text-[11px] uppercase">Scheduled Time</span>
              <span className="font-bold text-main">{formData.selectedDate || "15 July, 2027"}</span>
              <span className="text-sub font-semibold">{formData.selectedTimeSlot || "1:00 PM"}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-muted font-bold text-[11px] uppercase">Property Location</span>
              <span className="font-bold text-main">{formData.addressLine1 || "123 Main Street"}</span>
              <span className="text-sub font-semibold">
                {formData.city || "Atlanta"}, {formData.state || "GA"} {formData.zipCode || "30301"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-muted font-bold text-[11px] uppercase">Contact Email</span>
              <span className="font-bold text-main truncate">{formData.email || "info@nrcga.com"}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-muted font-bold text-[11px] uppercase">Mobile Phone</span>
              <span className="font-bold text-main">{formData.phone || "(678) 631-1892"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
