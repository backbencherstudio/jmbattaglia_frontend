"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GuestAuthGuard } from "@/components/admin/auth/GuestAuthGuard";
import { AuthBanner } from "@/components/admin/auth/AuthBanner";
import { AuthHeader } from "@/components/admin/auth/AuthHeader";
import { VerifyOtpForm } from "@/components/admin/auth/VerifyOtpForm";

function AdminOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="w-full max-w-md mx-auto space-y-7">
      <AuthHeader
        stepBadge="Step 2 of 3: OTP Verification"
        title="Verify OTP Code"
        subtitle="Enter the 6-digit one-time code sent to your email to continue."
      />

      <VerifyOtpForm initialEmail={email} />

      <div className="pt-6 border-t border-hairline text-center text-xs text-muted">
        Protected Admin Area • At Ease Inspections © {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default function AdminOtpPage() {
  return (
    <GuestAuthGuard>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-main font-sans">
        <AuthBanner
          title="Two-Step"
          highlightText="Identity Verification."
          subtitle="We take administrative security seriously. Verify your authorized one-time code to safely proceed with setting a new password."
        />

        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <AdminOtpContent />
          </Suspense>
        </div>
      </div>
    </GuestAuthGuard>
  );
}
