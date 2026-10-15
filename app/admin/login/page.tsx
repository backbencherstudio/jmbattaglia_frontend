"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ateaseinspections.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Set authentication cookie for demo
      document.cookie = `admin_session=authenticated; path=/; max-age=${rememberMe ? 86400 * 7 : 3600}`;
      setLoading(false);
      router.push("/admin/dashboard");
    }, 600);
  };

  return (
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
            Streamlining Property <br />
            <span className="text-primary">Inspections & Packages.</span>
          </h1>
          <p className="text-base text-neutral-300 leading-relaxed">
            Manage your inspection packages, add-on services, and live client portals effortlessly with At Ease Inspections management dashboard.
          </p>
        </div>
      </div>

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
                  className="w-full pl-10 pr-4 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-main">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Contact system administrator to reset password.");
                  }}
                  className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </a>
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
                  className="w-full pl-10 pr-11 py-3 bg-canvas border border-hairline rounded-xl text-main text-sm placeholder:text-muted focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-all"
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
                  className="w-4 h-4 text-primary border-hairline rounded focus:ring-primary accent-primary cursor-pointer"
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
  );
}
