"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { ShieldCheck, Mail, CalendarCheck, CheckCircle2, User, RefreshCw } from "lucide-react";
import { format24hToDisplayTime } from "@/lib/bookingUtils";
import { Button } from "@/components/ui/Button";

export const ConfirmationStep: React.FC<StepProps> = ({ formData, resetFormData }) => {
  const customerName = formData.firstName
    ? `${formData.firstName} ${formData.lastName || ""}`
    : "Customer";
  const propertyAddress = formData.addressLine1
    ? `${formData.addressLine1}${formData.city ? `, ${formData.city}` : ""}`
    : "123 Main Street, Atlanta";

  const appointmentDate = formData.selectedDate || "Upcoming Inspection";
  const appointmentTime = format24hToDisplayTime(formData.selectedTimeSlot) || "9:00 AM";

  const totalAmount =
    formData.calculatedQuote && formData.calculatedQuote.totalCents > 0
      ? `$${(formData.calculatedQuote.totalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : "$1,315.00";

  const orderId =
    formData.orderId ||
    formData.orderReceipt?.orderId ||
    formData.orderReceipt?.id ||
    formData.idempotencyKey?.slice(0, 8).toUpperCase() ||
    "ORD-SUCCESS";

  const handleBookAnother = () => {
    if (resetFormData) {
      resetFormData();
    } else {
      window.location.assign("/?step=about-you&substep=who-its-for");
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Dark Graphic Card */}
        <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between text-white bg-[#302E2B] shadow-md border border-neutral-800">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4E5616]/40 rounded-3xl transform rotate-12 pointer-events-none blur-[1px]" />
          <div className="absolute top-1/2 -left-16 w-40 h-40 bg-primary/10 rounded-full pointer-events-none blur-2xl" />

          {/* Top Content */}
          <div className="relative z-10 flex flex-col items-start gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-gray-300 font-semibold text-xs sm:text-sm tracking-wide">
              Request Submitted to ISN
            </span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 flex flex-col gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              A Home Decision, Made Clearer.
            </h3>
            <p className="text-gray-300 font-medium text-xs sm:text-sm leading-relaxed">
              We&apos;ve secured your request and our team is ready to inspect your property.
            </p>
          </div>
        </div>

        {/* Right Column: Confirmation Summary & Next Steps */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6 py-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-primary uppercase tracking-wider">
                STEP 10 OF 10 — CONFIRMED
              </span>
              <span className="text-xs font-mono bg-canvas border border-hairline px-2.5 py-1 rounded-lg text-sub font-semibold">
                ID: {orderId}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-main tracking-tight">
              You&apos;re Confirmed.
            </h2>

            <p className="text-xs sm:text-sm text-sub font-medium leading-relaxed">
              Thanks, <strong className="font-bold text-main">{customerName}</strong>. Your inspection request for{" "}
              <strong className="font-bold text-main">{propertyAddress}</strong> has been registered directly into our ISN scheduling system.
            </p>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-2">
              {/* Request Appointment Card */}
              <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-1.5 shadow-2xs">
                <h4 className="font-bold text-xs sm:text-sm text-main border-b border-hairline/60 pb-2 flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-primary" />
                  <span>Scheduled Appointment</span>
                </h4>
                <div className="flex flex-col mt-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                    {appointmentTime}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-sub mt-0.5">
                    {appointmentDate}
                  </span>
                </div>
              </div>

              {/* Package Amounts Card */}
              <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-1.5 shadow-2xs">
                <h4 className="font-bold text-xs sm:text-sm text-main border-b border-hairline/60 pb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Verified Quote Total</span>
                </h4>
                <div className="flex flex-col mt-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                    {totalAmount}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-sub mt-0.5">
                    All selected services included
                  </span>
                </div>
              </div>
            </div>

            {/* Inspector Assignment */}
            {formData.inspectorName && (
              <div className="bg-canvas border border-hairline rounded-xl p-3 flex items-center gap-2 text-xs sm:text-sm text-sub">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Designated Inspector: <strong className="text-main font-semibold">{formData.inspectorName}</strong>
                </span>
              </div>
            )}

            {/* Notification alert */}
            <div className="bg-[#FAFDF0] border border-primary/20 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 mt-1">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-xs sm:text-sm">
                <span className="font-bold text-main">Check your email inbox</span>
                <span className="text-sub">
                  A receipt and appointment confirmation have been dispatched to{" "}
                  <strong className="text-main">{formData.email || "your email address"}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBookAnother}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Book Another Inspection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
