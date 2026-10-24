"use client";

import React, { useEffect, useMemo } from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  Calendar,
  Tag,
  Home,
  UserCheck,
  Users,
  Shield,
  Clock,
  Waves,
  Settings,
  Droplet,
  Zap,
  Megaphone,
  Lock,
  FileText,
  StickyNote,
} from "lucide-react";
import { useGetFoundationTypesQuery } from "@/redux/features/booking/bookingApi";

const FALLBACK_FOUNDATIONS = [
  { value: "ec5c1636-7864-11e1-bfb4-b15dbfa5fbfd", label: "Slab on grade" },
  { value: "ec5c16e0-7864-11e1-bfb4-b15dbfa5fbfd", label: "Crawl Space/Pier and Beam" },
  { value: "11a8cea0-00eb-4637-b20a-2e5ddcff3db0", label: "Unfinished Basement" },
  { value: "3ca28aea-6d27-42e7-9790-488db4aa56ad", label: "Finished Basement" },
  { value: "44be0319-56d4-4ede-bb6c-4a400dc15c94", label: "Condo" },
  { value: "9dac9947-f96e-46e1-acbd-6b3f613b7abd", label: "Finished/ Unfinished Basement with Crawl" },
];

export const PropertyDetailsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  const { data: foundationsRes, isLoading: isLoadingFoundations } = useGetFoundationTypesQuery();

  const foundationOptions = useMemo(() => {
    const list = foundationsRes?.data;
    if (Array.isArray(list) && list.length > 0) {
      return list
        .filter((item) => item.visible !== false)
        .map((item) => ({
          value: item.id,
          label: item.name,
        }));
    }
    return FALLBACK_FOUNDATIONS;
  }, [foundationsRes]);

  // Set default foundationType if empty
  useEffect(() => {
    if (!formData.foundationType && foundationOptions.length > 0) {
      const defaultItem = foundationOptions[0];
      updateFormData({
        foundationType: defaultItem.value,
        foundationName: defaultItem.label,
      });
    }
  }, [formData.foundationType, foundationOptions, updateFormData]);

  const handleFoundationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const item = foundationOptions.find((opt) => opt.value === selectedId);
    updateFormData({
      foundationType: selectedId,
      foundationName: item ? item.label : "",
    });
    clearError("foundationType");
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Header section */}
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-main">
          A Few Property Details
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-sub mt-1.5">
          This helps our inspector prepare and quote accurately for larger or unusual homes.
        </p>
      </div>

      <hr className="border-t border-hairline my-0.5" />

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Year Built */}
        <Input
          label="Year Built"
          requiredStar
          placeholder="e.g. 1998"
          value={formData.yearBuilt || ""}
          onChange={(e) => {
            updateFormData({ yearBuilt: e.target.value });
            clearError("yearBuilt");
          }}
          error={errors.yearBuilt}
          leftIcon={<Calendar className="w-5 h-5 text-muted" />}
        />

        {/* Square Feet */}
        <Input
          label="Square Feet"
          requiredStar
          placeholder="e.g. 2,200 sq ft"
          value={formData.squareFeet || ""}
          onChange={(e) => {
            updateFormData({ squareFeet: e.target.value });
            clearError("squareFeet");
          }}
          error={errors.squareFeet}
          leftIcon={<Tag className="w-5 h-5 text-muted" />}
        />

        {/* Foundation Type */}
        <Select
          label="Foundation Type"
          requiredStar
          placeholder={isLoadingFoundations ? "Loading foundations..." : "Select foundation type"}
          value={formData.foundationType || ""}
          onChange={handleFoundationChange}
          options={foundationOptions}
          error={errors.foundationType}
          leftIcon={<Home className="w-5 h-5 text-muted" />}
        />

        {/* Client Attending */}
        <Select
          label="Client Attending"
          requiredStar
          placeholder="Select attendance option"
          value={formData.clientAttending || "Yes – Client Will Attend Entire Inspection"}
          onChange={(e) => {
            updateFormData({ clientAttending: e.target.value });
            clearError("clientAttending");
          }}
          options={[
            "Yes – Client Will Attend Entire Inspection",
            "Yes – Client Will Attend Final Walkthrough (Last 30-45 Mins)",
            "No – Client Unable to Attend (Detailed Report Requested)",
            "Buyer's Real Estate Agent Representing Client",
          ]}
          error={errors.clientAttending}
          leftIcon={<UserCheck className="w-5 h-5 text-muted" />}
        />

        {/* Home Occupied */}
        <Select
          label="Home Occupied"
          requiredStar
          placeholder="Select occupancy status"
          value={formData.homeOccupied || "Occupied (Furnished & Inhabited)"}
          onChange={(e) => {
            updateFormData({ homeOccupied: e.target.value });
            clearError("homeOccupied");
          }}
          options={[
            "Occupied (Furnished & Inhabited)",
            "Vacant (Unfurnished / Move-in Ready)",
            "Vacant (Staged for Sale)",
            "New Construction (Pre-Occupancy)",
          ]}
          error={errors.homeOccupied}
          leftIcon={<Users className="w-5 h-5 text-muted" />}
        />

        {/* Is it a Gated Community */}
        <Select
          label="Is it a Gated Community"
          requiredStar
          placeholder="Select access type"
          value={formData.isGatedCommunity || "No – Open Access Community"}
          onChange={(e) => {
            updateFormData({ isGatedCommunity: e.target.value });
            clearError("isGatedCommunity");
          }}
          options={[
            "No – Open Access Community",
            "Yes – Keypad / Gate Code Required",
            "Yes – Guarded Security Gate House",
            "Yes – Call Box / Directory Intercom Entry",
          ]}
          error={errors.isGatedCommunity}
          leftIcon={<Shield className="w-5 h-5 text-muted" />}
        />

        {/* Is there any Alarm System */}
        <Select
          label="Is there any Alarm System"
          requiredStar
          placeholder="Select alarm system status"
          value={formData.hasAlarmSystem || "No Alarm System"}
          onChange={(e) => {
            updateFormData({ hasAlarmSystem: e.target.value });
            clearError("hasAlarmSystem");
          }}
          options={[
            "No Alarm System",
            "Yes – Active Alarm (Disarmed for Inspection)",
            "Yes – Active Alarm (Arm/Disarm Code Provided)",
            "Unknown / To Be Verified with Listing Agent",
          ]}
          error={errors.hasAlarmSystem}
          leftIcon={<Clock className="w-5 h-5 text-muted" />}
        />

        {/* Pool/Spa */}
        <Select
          label="Pool/Spa"
          requiredStar
          placeholder="Select pool or spa type"
          value={formData.hasPoolSpa || "None (No Pool or Spa)"}
          onChange={(e) => {
            updateFormData({ hasPoolSpa: e.target.value });
            clearError("hasPoolSpa");
          }}
          options={[
            "None (No Pool or Spa)",
            "In-ground Swimming Pool",
            "Above-ground Swimming Pool",
            "Hot Tub / Spa Only",
            "In-ground Pool & Spa Combination",
          ]}
          error={errors.hasPoolSpa}
          leftIcon={<Waves className="w-5 h-5 text-muted" />}
        />

        {/* Type of Sewage System */}
        <Select
          label="Type of Sewage System"
          requiredStar
          placeholder="Select sewage disposal type"
          value={formData.sewageSystem || "Public Sewer Line"}
          onChange={(e) => {
            updateFormData({ sewageSystem: e.target.value });
            clearError("sewageSystem");
          }}
          options={[
            "Public Sewer Line",
            "Private Septic Tank & Drain Field",
            "Aerobic Treatment Unit (ATU)",
            "Shared / Community Septic System",
          ]}
          error={errors.sewageSystem}
          leftIcon={<Settings className="w-5 h-5 text-muted" />}
        />

        {/* Type of Water System */}
        <Select
          label="Type of Water System"
          requiredStar
          placeholder="Select water supply source"
          value={formData.waterSystem || "Public / Municipal Water"}
          onChange={(e) => {
            updateFormData({ waterSystem: e.target.value });
            clearError("waterSystem");
          }}
          options={[
            "Public / Municipal Water",
            "Private Water Well System",
            "Shared / Community Well System",
            "Cistern / Stored Water Supply",
          ]}
          error={errors.waterSystem}
          leftIcon={<Droplet className="w-5 h-5 text-muted" />}
        />

        {/* Utilities On */}
        <Select
          label="Utilities On"
          requiredStar
          placeholder="Select utility status"
          value={formData.utilitiesOn || "All Utilities Fully Operational (Electric, Water, Gas)"}
          onChange={(e) => {
            updateFormData({ utilitiesOn: e.target.value });
            clearError("utilitiesOn");
          }}
          options={[
            "All Utilities Fully Operational (Electric, Water, Gas)",
            "Electricity Off",
            "Water Supply Off",
            "Natural Gas / Propane Off",
            "Multiple / All Utilities Shut Off",
          ]}
          error={errors.utilitiesOn}
          leftIcon={<Zap className="w-5 h-5 text-muted" />}
        />

        {/* How Did You Hear About Us? */}
        <Select
          label="How Did You Hear About Us?"
          requiredStar
          placeholder="Select referral source"
          value={formData.hearAboutUs || "Google Search / Web"}
          onChange={(e) => {
            updateFormData({ hearAboutUs: e.target.value });
            clearError("hearAboutUs");
          }}
          options={[
            "Real Estate Agent Recommendation",
            "Client / Friend Referral",
            "Google Search / Web",
            "Social Media (Facebook / Instagram / LinkedIn)",
            "Returning Customer",
            "Online Rating & Reviews (Google Reviews / Yelp)",
            "Community Event / Local Advertisement",
          ]}
          error={errors.hearAboutUs}
          leftIcon={<Megaphone className="w-5 h-5 text-muted" />}
        />

        {/* Gate Code */}
        <Input
          label="Gate Code"
          placeholder="e.g. #0125"
          value={formData.gateCode || ""}
          onChange={(e) => {
            updateFormData({ gateCode: e.target.value });
            clearError("gateCode");
          }}
          error={errors.gateCode}
          leftIcon={<Lock className="w-5 h-5 text-muted" />}
        />

        {/* Due Diligence */}
        <Input
          label="Due Diligence"
          placeholder="e.g. Period Ends Sept 15"
          value={formData.dueDiligence || ""}
          onChange={(e) => {
            updateFormData({ dueDiligence: e.target.value });
            clearError("dueDiligence");
          }}
          error={errors.dueDiligence}
          leftIcon={<FileText className="w-5 h-5 text-muted" />}
        />
      </div>

      {/* Special Instructions or Notes Textarea */}
      <Textarea
        label="Special Instructions or Notes"
        placeholder="Access instructions, lockbox code, specific areas of concern, or anything else we should know..."
        rows={4}
        value={formData.specialInstructions || ""}
        onChange={(e) => {
          updateFormData({ specialInstructions: e.target.value });
          clearError("specialInstructions");
        }}
        error={errors.specialInstructions}
        leftIcon={<StickyNote className="w-5 h-5 text-muted" />}
      />
    </div>
  );
};
