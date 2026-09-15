"use client";

import React, { useState } from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Mail } from "lucide-react";

export const CustomerTypeStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [recordChecked, setRecordChecked] = useState(false);

  const getRoleTitle = () => {
    switch (formData.customerRole) {
      case "home-buyer":
        return "You're Set Up As A Home Buyer";
      case "home-owner":
        return "You're Set Up As A Home Owner";
      case "buyers-agent":
        return "You're Set Up As A Buyer's Agent";
      default:
        return "Customer Verification";
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ email: e.target.value, emailVerified: false });
    setRecordChecked(false);
    clearError("email");
  };

  const handleCheckRecords = () => {
    if (!formData.email) return;
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setRecordChecked(true);
      updateFormData({ emailVerified: true });
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Dynamic Header section */}
      <div>
        <h2 className="md:text-4xl text-2xl font-extrabold tracking-tight text-main">
          {getRoleTitle()}
        </h2>
        <p className="text-sm sm:text-base text-sub mt-1.5">
          Enter your email so we can check our records and pre-fill anything we already know.
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* Input Field with inline button */}
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
            className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold"
          >
            Check records
          </Button>
        }
      />

      {/* Record status banner matching Figma specs */}
      {recordChecked && (
        <Alert message="No existing record found." />
      )}
    </div>
  );
};
