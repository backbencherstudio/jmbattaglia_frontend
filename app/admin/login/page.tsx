"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useLoginMutation } from "@/redux/api/baseApi";
import { useAppDispatch } from "@/redux/store";
import { handleAuthSuccess } from "@/redux/features/auth/authHelpers";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { GuestAuthGuard } from "@/components/admin/auth/GuestAuthGuard";
import { AuthBanner } from "@/components/admin/auth/AuthBanner";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading: loading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await login({
        email,
        password,
        rememberMe,
      }).unwrap();

      handleAuthSuccess(response, dispatch, rememberMe);

      if (
        response.success ||
        Boolean((response as unknown as Record<string, unknown>)?.accessToken) ||
        Boolean((response as unknown as Record<string, unknown>)?.data)
      ) {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Login failed. Please check your credentials."),
      );
    }
  };

  return (
    <GuestAuthGuard>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white text-main font-sans">
        <AuthBanner
          title="Streamlining Property"
          highlightText="Inspections & Packages."
          subtitle="Manage your inspection packages, add-on services, and live client portals effortlessly with At Ease Inspections management dashboard."
        />

        {/* Right Login Form Section */}
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
                  Admin Sign In
                </h2>
                <p className="text-sm text-sub mt-1">
                  Enter your admin credentials to access your dashboard.
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

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-main">
                  Email Address
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
                    className="w-full pl-10 pr-4 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-0  transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-main">
                    Password
                  </label>
                  <Link
                    href="/admin/forget"
                    className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-0 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-main transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary border-hairline rounded  accent-primary cursor-pointer"
                  />
                  <span className="text-xs font-medium text-sub">
                    Remember me for 7 days
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
              >
                <span>{loading ? "Signing in..." : "Sign in to Dashboard"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
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
