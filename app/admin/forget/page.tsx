"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { GuestAuthGuard } from "@/components/admin/auth/GuestAuthGuard";
import { AuthBanner } from "@/components/admin/auth/AuthBanner";
import { AuthHeader } from "@/components/admin/auth/AuthHeader";

export default function AdminForgetPasswordPage() {
  const router = useRouter();
  const [forgotPassword, { isLoading: loading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your registered admin email address.");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();
      const msg =
        response.message ||
        "If your email is registered, a reset code has been sent.";
      setSuccessMessage(msg);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_reset_email", email.trim());
      }

      // Smooth transition to /admin/otp with email parameter
      setTimeout(() => {
        router.push(`/admin/otp?email=${encodeURIComponent(email.trim())}`);
      }, 1000);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to request password reset. Please check your email or contact system administrator.",
        ),
      );
    }
  };

  return (
    <GuestAuthGuard>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-main font-sans">
        <AuthBanner
          title="Password Recovery"
          highlightText="& Account Access."
          subtitle="Verify your authorized email address to receive password reset instructions for your At Ease Inspections administrative account."
        />

        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
          <div className="w-full max-w-md mx-auto space-y-8">
            <AuthHeader
              stepBadge="Step 1 of 3: Recovery"
              title="Forgot Password"
              subtitle="Enter your email to receive recovery instructions."
            />

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5">
                  <span className="font-bold text-red-800 shrink-0">!</span>
                  <p className="leading-snug">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">
                        Verification Code Sent
                      </p>
                      <p className="mt-1 text-emerald-700 leading-relaxed">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/admin/otp?email=${encodeURIComponent(email)}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
                    >
                      <span>Enter verification code now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-main">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-0  transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>
                  {loading ? "Sending Verification Code..." : "Send Reset Code"}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Back to Login Link */}
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

            <div className="pt-6 border-t border-hairline text-center text-xs text-muted">
              Protected Admin Area • At Ease Inspections © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </GuestAuthGuard>
  );
}
