"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, CheckCircle2, Mail, RotateCw } from "lucide-react";
import {
  useVerifyResetOtpMutation,
  useForgotPasswordMutation,
} from "@/redux/features/auth/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { OtpInput } from "./OtpInput";

interface VerifyOtpFormProps {
  initialEmail?: string;
  onSuccess?: (resetToken: string) => void;
}

export function VerifyOtpForm({ initialEmail = "", onSuccess }: VerifyOtpFormProps) {
  const router = useRouter();

  const [verifyResetOtp, { isLoading: isVerifying }] = useVerifyResetOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 60-second cooldown timer for resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!initialEmail && typeof window !== "undefined") {
      const stored = sessionStorage.getItem("admin_reset_email");
      if (stored) setEmail(stored);
    } else if (initialEmail) {
      setEmail(initialEmail);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_reset_email", initialEmail);
      }
    }
  }, [initialEmail]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const executeVerification = async (targetOtp: string) => {
    setError("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please provide your admin email address.");
      return;
    }

    const cleanOtp = targetOtp.trim();
    if (cleanOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      const response = await verifyResetOtp({
        email: cleanEmail,
        otp: cleanOtp,
      }).unwrap();

      const resetToken = response.data?.resetToken;

      if (response.success && resetToken) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_reset_token", resetToken);
          sessionStorage.setItem("admin_reset_email", cleanEmail);
        }

        setSuccessMsg(
          response.message || "OTP verified. You may now change your password.",
        );
        setError("");

        if (onSuccess) {
          onSuccess(resetToken);
        } else {
          // Transition to /admin/reset with the exact resetToken
          setTimeout(() => {
            router.push(`/admin/reset?token=${encodeURIComponent(resetToken)}`);
          }, 800);
        }
      } else {
        setError(response.message || "Invalid verification code.");
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Invalid or expired verification code. Please check and try again.",
        ),
      );
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeVerification(otp);
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;
    setError("");
    setSuccessMsg("");

    try {
      const response = await resendOtp({ email: email.trim() }).unwrap();
      setSuccessMsg(
        response.message || "A new 6-digit verification code has been sent.",
      );
      setCountdown(60);
      setCanResend(false);
      setOtp("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to resend code. Please try again."));
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Alerts */}
      {error && (
        <div className="p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5">
          <span className="font-bold text-red-800 shrink-0">!</span>
          <p className="leading-snug">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-snug">{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Bar with Change button */}
        <div className="flex items-center justify-between p-3 bg-canvas border border-hairline rounded-xl text-xs text-sub">
          <div className="flex items-center space-x-2 overflow-hidden">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate font-medium text-main">{email || "No email provided"}</span>
          </div>
          <Link
            href="/admin/forget"
            className="font-semibold text-primary hover:text-primary-hover shrink-0 transition-colors ml-2"
          >
            Change
          </Link>
        </div>

        {/* 6-Digit OTP Box (Instant copy-paste supported) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-main">
              6-Digit Verification Code
            </label>
            <span className="text-xs text-muted">Paste enabled</span>
          </div>

          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={(completedCode) => {
              if (completedCode.length === 6 && !isVerifying) {
                executeVerification(completedCode);
              }
            }}
            disabled={isVerifying}
            isError={Boolean(error)}
            autoFocus
          />
        </div>

        {/* Resend Countdown */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-muted">Didn&apos;t receive the code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isResending}
              className="font-semibold text-primary hover:text-primary-hover transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              <span>{isResending ? "Sending..." : "Resend Code"}</span>
            </button>
          ) : (
            <span className="text-sub font-mono font-medium">
              Resend in {countdown}s
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isVerifying || otp.length !== 6}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>{isVerifying ? "Verifying Code..." : "Verify & Continue"}</span>
          {!isVerifying && <ArrowRight className="w-4 h-4" />}
        </button>

        {/* Back to Login */}
        <div className="text-center pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-sub hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default VerifyOtpForm;
