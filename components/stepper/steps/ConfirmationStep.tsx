"use client";

import React, { useEffect } from "react";
import { StepProps } from "@/types/stepper";
import { ShieldCheck, Mail, CalendarCheck, CheckCircle2, User, RefreshCw } from "lucide-react";
import { format24hToDisplayTime } from "@/lib/bookingUtils";
import { Button } from "@/components/ui/Button";

export const ConfirmationStep: React.FC<StepProps> = ({ formData, resetFormData }) => {
  useEffect(() => {
    document.title = "Inspection Confirmed | At Ease Inspections";
  }, []);
  const customerName = formData.firstName
    ? `${formData.firstName} ${formData.lastName || ""}`
    : "Customer";
  const propertyAddress = formData.addressLine1
    ? `${formData.addressLine1}${formData.city ? `, ${formData.city}` : ""}${formData.state ? `, ${formData.state}` : ""}`
    : "Address on File";

  const appointmentDate = formData.selectedDate || "Inspection Scheduled";
  const appointmentTime = formData.selectedTimeSlot
    ? format24hToDisplayTime(formData.selectedTimeSlot)
    : "Arrival Window Confirmed";

  const totalAmount =
    formData.calculatedQuote && formData.calculatedQuote.totalCents > 0
      ? `$${(formData.calculatedQuote.totalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : formData.totalAmount
      ? `$${Number(formData.totalAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : "Quoted Price on File";

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
              At Ease Inspections — Request Confirmed
            </span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Veteran-Led &amp; Certified
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              At Ease Inspections
            </h3>
            <p className="text-gray-300 font-medium text-xs sm:text-sm leading-relaxed">
              We&apos;ve secured your request and our certified inspection team is ready to inspect your property.
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400">
              Direct Support: <a href="tel:7707656869" className="text-white font-bold hover:underline">(770) 765-6869</a>
            </div>
          </div>
        </div>

        {/* Right Column: Confirmation Summary & Next Steps */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6 py-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-primary uppercase tracking-wider">
                BOOKING CONFIRMED
              </span>
              <span className="text-xs font-mono bg-canvas border border-hairline px-2.5 py-1 rounded-lg text-sub font-semibold">
                {formData.orderReceipt?.reference ? `REF: ${formData.orderReceipt.reference}` : `ID: ${orderId}`}
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

            {/* Direct Office Contact */}
            <div className="bg-canvas border border-hairline rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm mt-1">
              <div className="flex flex-col">
                <span className="font-bold text-main">Questions or need to reschedule?</span>
                <span className="text-sub">Call our Atlanta office directly at <a href="tel:7707656869" className="text-primary font-bold hover:underline">(770) 765-6869</a> or email <a href="mailto:support@ateaseinspections.com" className="text-primary font-bold hover:underline">support@ateaseinspections.com</a></span>
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
