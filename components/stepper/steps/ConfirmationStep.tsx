"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { ShieldCheck, Mail, CalendarCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export const ConfirmationStep: React.FC<StepProps> = ({ formData }) => {
  const router = useRouter();

  const handleBookAnother = () => {
    router.push("/?step=about-you&substep=who-its-for");
  };

  const customerName = formData.firstName ? `${formData.firstName}` : "Naffziger";
  const propertyAddress = formData.addressLine1 || "123 Main Street";
  const appointmentTime = formData.selectedTimeSlot || "1:00 PM";
  const appointmentDate = formData.selectedDate || "July 15, 2027";
  const userEmail = formData.email || "info@nrcga.com";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Dark Graphic Card with Pure CSS Styling */}
        <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between text-white bg-[#302E2B] shadow-md border border-neutral-800">
          {/* Decorative Geometric Shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4E5616]/40 rounded-3xl transform rotate-12 pointer-events-none blur-[1px]" />
          <div className="absolute top-1/2 -left-16 w-40 h-40 bg-primary/10 rounded-full pointer-events-none blur-2xl" />

          {/* Top Content: Badge & Label */}
          <div className="relative z-10 flex flex-col items-start gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-gray-300 font-semibold text-xs sm:text-sm tracking-wide">
              Request Submitted
            </span>
          </div>

          {/* Bottom Content: Title & Description */}
          <div className="relative z-10 flex flex-col gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              A Home Decision, Made Clearer.
            </h3>
            <p className="text-gray-300 font-medium text-xs sm:text-sm leading-relaxed">
              We&apos;ve secured your request and will take it from here.
            </p>
          </div>
        </div>

        {/* Right Column: Confirmation Summary & Next Steps */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6 py-1">
          <div className="flex flex-col gap-3">
            {/* Step Counter Badge */}
            <span className="text-xs sm:text-sm font-extrabold text-primary uppercase tracking-wider">
              STEP 10 OF 10
            </span>

            {/* Main Confirmed Title */}
            <h2 className="text-3xl sm:text-4xl font-black text-main tracking-tight">
              You&apos;re Confirmed.
            </h2>

            {/* Personalized Greeting */}
            <p className="text-xs sm:text-sm text-sub font-medium leading-relaxed">
              Thanks, <strong className="font-bold text-main">{customerName}</strong>. Your inspection request for{" "}
              <strong className="font-bold text-main">{propertyAddress}</strong> is on its way to our scheduling team.
            </p>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-2">
              {/* Request Appointment Card */}
              <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-1.5 shadow-2xs">
                <h4 className="font-bold text-xs sm:text-sm text-main border-b border-hairline/60 pb-2">
                  Request Appointment
                </h4>
                <div className="flex flex-col mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    {appointmentTime}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-sub mt-0.5">
                    {appointmentDate}
                  </span>
                </div>
              </div>

              {/* Package Amounts Card */}
              <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-4.5 flex flex-col gap-1.5 shadow-2xs">
                <h4 className="font-bold text-xs sm:text-sm text-main border-b border-hairline/60 pb-2">
                  Package Amounts
                </h4>
                <div className="flex flex-col mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                    $1,315
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-sub mt-0.5">
                    Safe Home Package +
                  </span>
                </div>
              </div>
            </div>

            {/* What Happens Next Section */}
            <div className="flex flex-col gap-3 pt-3 border-t border-hairline/60 mt-2">
              <h4 className="font-bold text-sm sm:text-base text-main">
                What happens next
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Confirmation Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-xs sm:text-sm">
                    <span className="font-bold text-main">Confirmation email</span>
                    <span className="text-sub font-medium mt-0.5 leading-snug">
                      A complete recap is headed to <span className="font-semibold text-main">{userEmail}</span>.
                    </span>
                  </div>
                </div>

                {/* We'll confirm your time */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-canvas border border-hairline flex items-center justify-center text-primary shrink-0">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col text-xs sm:text-sm">
                    <span className="font-bold text-main">We&apos;ll confirm your time</span>
                    <span className="text-sub font-medium mt-0.5 leading-snug">
                      Our team will be in touch with your inspector details.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Another Inspections Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBookAnother}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Book Another Inspections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
