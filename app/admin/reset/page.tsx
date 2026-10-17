"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GuestAuthGuard } from "@/components/admin/auth/GuestAuthGuard";
import { AuthBanner } from "@/components/admin/auth/AuthBanner";
import { AuthHeader } from "@/components/admin/auth/AuthHeader";
import { ResetPasswordForm } from "@/components/admin/auth/ResetPasswordForm";
import { VerifyOtpForm } from "@/components/admin/auth/VerifyOtpForm";
import { PasswordResetSuccess } from "@/components/admin/auth/PasswordResetSuccess";

function AdminResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryToken = searchParams.get("token") || searchParams.get("resetToken") || "";
  const queryEmail = searchParams.get("email") || "";

  const [resetToken, setResetToken] = useState(queryToken);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (queryToken) {
      setResetToken(queryToken);
    } else if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("admin_reset_token");
      if (storedToken) {
        setResetToken(storedToken);
      }
    }
  }, [queryToken]);

  return (
    <div className="w-full max-w-md mx-auto space-y-7">
      <AuthHeader
        stepBadge={
          isSuccess
            ? "Completed"
            : resetToken
              ? "Step 3 of 3: New Password"
              : "Step 2 of 3: OTP Verification"
        }
        title={
          isSuccess
            ? "Password Updated"
            : resetToken
              ? "Create New Password"
              : "Verify OTP Code"
        }
        subtitle={
          isSuccess
            ? "Your password has been changed successfully."
            : resetToken
              ? "Choose a strong new password to secure your admin account."
              : "Please enter the 6-digit code before setting a new password."
        }
      />

      {isSuccess ? (
        <PasswordResetSuccess onSignInClick={() => router.push("/admin/login")} />
      ) : resetToken ? (
        <ResetPasswordForm
          initialToken={resetToken}
          onSuccess={() => setIsSuccess(true)}
          onMissingToken={() => setResetToken("")}
        />
      ) : (
        <VerifyOtpForm
          initialEmail={queryEmail}
          onSuccess={(token) => setResetToken(token)}
        />
      )}

      <div className="pt-6 border-t border-hairline text-center text-xs text-muted">
        Protected Admin Area • At Ease Inspections © {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <GuestAuthGuard>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-main font-sans">
        <AuthBanner
          title="Secure Account"
          highlightText="Credential Reset."
          subtitle="Verify your authorized email with a 6-digit one-time code to create a new password and restore full access to your At Ease Inspections dashboard."
        />

        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <AdminResetContent />
          </Suspense>
        </div>
      </div>
    </GuestAuthGuard>
  );
}
