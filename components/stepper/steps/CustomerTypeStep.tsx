"use client";

import React, { useState } from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Mail, CheckCircle, Info } from "lucide-react";
import { useLazyLookupClientByEmailQuery } from "@/redux/features/booking/bookingApi";

export const CustomerTypeStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
  setError,
}) => {
  const [triggerLookup, { isFetching }] = useLazyLookupClientByEmailQuery();
  const [lookupMessage, setLookupMessage] = useState<{
    type: "success" | "info" | "error";
    text: string;
  } | null>(() => {
    if (formData.isExistingClient) {
      return {
        type: "success",
        text: "Existing record loaded for this email.",
      };
    }
    if (formData.emailVerified && formData.email) {
      return {
        type: "info",
        text: "Verified. Ready to continue.",
      };
    }
    return null;
  });

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
    const val = e.target.value;
    updateFormData({ email: val, emailVerified: false, isExistingClient: false });
    setLookupMessage(null);
    clearError("email");
  };

  const handleCheckRecords = async () => {
    if (!formData.email?.trim()) {
      setError("email", "Please enter an email address first.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      setError("email", "Please enter a valid email address.");
      return;
    }

    clearError("email");

    try {
      const res = await triggerLookup(formData.email.trim()).unwrap();
      const lookupData = res?.data;

      if (lookupData?.found) {
        const contact = lookupData.contact;
        const prevProp = lookupData.previousProperty;

        updateFormData({
          emailVerified: true,
          isExistingClient: true,
          firstName: contact?.firstName || formData.firstName,
          lastName: contact?.lastName || formData.lastName,
          phone: contact?.phone || formData.phone,
          ...(prevProp
            ? {
                addressLine1: prevProp.address1 || formData.addressLine1,
                addressLine2: prevProp.address2 || formData.addressLine2,
                city: prevProp.city || formData.city,
                state: prevProp.state || formData.state,
                zipCode: prevProp.zip || formData.zipCode,
                yearBuilt: prevProp.yearBuilt ? String(prevProp.yearBuilt) : formData.yearBuilt,
                squareFeet: prevProp.squareFeet ? String(prevProp.squareFeet) : formData.squareFeet,
                foundationType: prevProp.foundationType || formData.foundationType,
              }
            : {}),
        });

        setLookupMessage({
          type: "success",
          text: `Found existing customer record for ${contact?.firstName || "you"}! Your details have been pre-filled.`,
        });
      } else {
        updateFormData({
          emailVerified: true,
          isExistingClient: false,
        });
        setLookupMessage({
          type: "info",
          text: "No previous booking record found with this email. You can proceed as a new client.",
        });
      }
    } catch {
      updateFormData({ emailVerified: true });
      setLookupMessage({
        type: "info",
        text: "Lookup service unavailable. You can proceed with standard registration.",
      });
    }
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
        placeholder="e.g. client@example.com"
        value={formData.email || ""}
        onChange={handleEmailChange}
        error={errors.email}
        leftIcon={<Mail className="w-5 h-5 text-muted" />}
        rightAction={
          <Button
            type="button"
            variant="green"
            size="sm"
            isLoading={isFetching}
            onClick={handleCheckRecords}
            className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold"
          >
            Check records
          </Button>
        }
      />

      {/* Record status banner */}
      {lookupMessage && (
        <div
          className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm ${
            lookupMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : lookupMessage.type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          {lookupMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{lookupMessage.text}</div>
        </div>
      )}
    </div>
  );
};
