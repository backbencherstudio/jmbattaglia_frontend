"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface ResetPasswordFormProps {
  initialToken?: string;
  onSuccess: () => void;
  onMissingToken?: () => void;
}

export function ResetPasswordForm({
  initialToken = "",
  onSuccess,
  onMissingToken,
}: ResetPasswordFormProps) {
  const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation();

  const [resetToken, setResetToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (initialToken) {
      setResetToken(initialToken);
    } else if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("admin_reset_token");
      if (stored) {
        setResetToken(stored);
      }
    }
  }, [initialToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const tokenToSend = resetToken.trim();

    if (!tokenToSend) {
      setError("Reset token is missing or expired. Please verify your OTP again.");
      if (onMissingToken) {
        onMissingToken();
      }
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword({
        resetToken: tokenToSend,
        newPassword,
        confirmPassword,
      }).unwrap();

      if (response.success !== false) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("admin_reset_token");
          sessionStorage.removeItem("admin_reset_email");
          sessionStorage.removeItem("admin_reset_otp");
        }
        setSuccessMsg(response.message || "Password changed successfully.");
        setError("");
        onSuccess();
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to reset password. The session may have expired. Please verify your OTP again.",
        ),
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Global Alerts */}
      {error && (
        <div className="p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5">
          <span className="font-bold text-red-800 shrink-0">!</span>
          <p className="leading-snug">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
          <p className="leading-snug">{successMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Token Verified Pill */}
        <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800">
          <KeyRound className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Identity verified. Please set a strong new password.
          </span>
        </div>

        {/* New Password Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-main">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-11 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-main transition-colors cursor-pointer"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-main">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-11 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-main transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Requirements hint */}
        <p className="text-xs text-muted">
          Must be at least 6 characters with a combination of letters & numbers.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>{isSubmitting ? "Updating Password..." : "Change Password"}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4" />}
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

export default ResetPasswordForm;
