"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { GuestAuthGuard } from "@/components/admin/auth/GuestAuthGuard";

export default function AdminForgetPasswordPage() {
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
      setSuccessMessage(
        response.message ||
          "Password reset instructions have been sent to your email address.",
      );
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
        {/* Left Banner Section */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-neutral-900 overflow-hidden flex-col justify-between p-12 text-white">
          <Image
            src="/assets/images/safe_home_package.jpg"
            alt="At Ease Inspections Banner"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover opacity-85 transition-transform duration-1000 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 w-fit">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold tracking-wide uppercase text-white/90">
              Admin Portal
            </span>
          </div>

          {/* Bottom Banner Quote / Info */}
          <div className="relative z-10 max-w-xl space-y-4 mb-6">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Password Recovery <br />
              <span className="text-primary">& Account Access.</span>
            </h1>
            <p className="text-base text-neutral-300 leading-relaxed">
              Verify your authorized email address to receive password reset
              instructions for your At Ease Inspections administrative account.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Logo */}
            <div className="flex flex-col items-start space-y-3">
              <div className="relative w-48 h-14">
                <Image
                  src="/assets/images/logo.png"
                  alt="At Ease Inspections Logo"
                  fill
                  sizes="192px"
                  className="object-contain object-left"
                  priority
                />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-main tracking-tight">
                  Forgot Password
                </h2>
                <p className="text-sm text-sub mt-1">
                  Enter your email to receive recovery instructions.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">Request Sent</p>
                    <p className="mt-1 text-emerald-700 leading-relaxed">
                      {successMessage}
                    </p>
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
                    placeholder="admin@ateaseinspections.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
              >
                <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              {/* Back to Login link */}
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

            {/* Footer note */}
            <div className="pt-6 border-t border-hairline text-center text-xs text-muted">
              Protected Admin Area • At Ease Inspections © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </GuestAuthGuard>
  );
}
