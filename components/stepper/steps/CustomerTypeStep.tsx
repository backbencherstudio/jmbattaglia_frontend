"use client";

import React, { useState } from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, CheckCircle2 } from "lucide-react";

export const CustomerTypeStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: e.target.value, emailVerified: false });
    clearError("email");
  };

  const handleCheckRecords = () => {
    if (!formData.email) return;
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      updateFormData({ emailVerified: true });
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-main">
          Customer Verification
        </h2>
        <p className="text-base text-sub mt-2">
          Enter your email address to check if you have an existing account or inspection history.
        </p>
      </div>

      <hr className="border-t border-hairline my-1" />

      <Input
        label="Email Address"
        requiredStar
        type="email"
        placeholder="e.g. info@nrcga.com"
        value={formData.email || ""}
        onChange={handleEmailChange}
        error={errors.email}
        leftIcon={<Mail className="w-5 h-5 text-muted" />}
        rightAction={
          <Button
            type="button"
            variant="green"
            size="sm"
            isLoading={isChecking}
            onClick={handleCheckRecords}
            className="rounded-xl px-4 py-2 text-xs font-semibold"
          >
            {formData.emailVerified ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            ) : (
              "Check records"
            )}
          </Button>
        }
      />

      {formData.emailVerified && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          ✓ Records found! Your details will be pre-filled in the next step.
        </div>
      )}
    </div>
  );
};
