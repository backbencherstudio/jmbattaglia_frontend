"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
  };
  isSaving?: boolean;
  error?: string | null;
  successMessage?: string | null;
  onSave: (data: ProfileFormData) => void;
}

export function ProfileForm({
  initialData,
  isSaving = false,
  error = null,
  successMessage = null,
  onSave,
}: ProfileFormProps) {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialData.name || "");
    setEmail(initialData.email || "");
  }, [initialData.name, initialData.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation checks
    const isChangingPassword = Boolean(newPassword || confirmPassword);

    if (isChangingPassword) {
      if (!currentPassword) {
        setValidationError(
          "Current password is required to set a new password.",
        );
        return;
      }
      if (newPassword.length < 6) {
        setValidationError(
          "New password must be at least 6 characters long.",
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        setValidationError("New password and confirmation password do not match.");
        return;
      }
    }

    onSave({
      name: name.trim(),
      email: initialData.email?.trim() || email.trim(),
      currentPassword: currentPassword ? currentPassword : undefined,
      newPassword: newPassword ? newPassword : undefined,
      confirmPassword: confirmPassword ? confirmPassword : undefined,
    });
  };

  const activeError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alerts */}
      {activeError && (
        <div className="p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5">
          <span className="font-bold text-red-800 shrink-0">!</span>
          <p className="leading-snug">{activeError}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-snug">{successMessage}</p>
        </div>
      )}

      {/* Row 1: Profile Name & Profile Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-sub uppercase tracking-wider">
            Profile Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dana Smith"
            required
            disabled={isSaving}
            className="w-full h-11 px-4 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-sub uppercase tracking-wider">
              Profile Email
            </label>
            <span className="text-xs text-muted">Read Only</span>
          </div>
          <input
            type="email"
            value={initialData.email || email}
            readOnly
            disabled
            className="w-full h-11 px-4 bg-canvas border border-hairline rounded-xl text-sm font-medium text-muted cursor-not-allowed select-none opacity-80"
          />
        </div>
      </div>

      {/* Row 2: Passwords Grid (Current, New, Confirm) */}
      <div className="pt-2 border-t border-hairline space-y-4">
        <div>
          <h3 className="text-sm font-bold text-main">Security & Password</h3>
          <p className="text-xs text-muted mt-0.5">
            Leave password fields empty to keep your current password. Current password is required when setting a new password.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-sub uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isSaving}
                className="w-full h-11 pl-4 pr-10 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border disabled:opacity-60 password-input leading-normal"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-main cursor-pointer"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-sub uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isSaving}
                className="w-full h-11 pl-4 pr-10 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border disabled:opacity-60 password-input leading-normal"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-main cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-sub uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isSaving}
                className="w-full h-11 pl-4 pr-10 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border disabled:opacity-60 password-input leading-normal"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-main cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-3 flex items-center space-x-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
          className="px-6 py-3 cursor-pointer shadow-md shadow-primary/20"
        >
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;
