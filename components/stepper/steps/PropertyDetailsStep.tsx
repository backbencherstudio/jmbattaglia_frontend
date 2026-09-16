"use client";

import React from "react";
import { StepProps } from "@/types/stepper";
import { Input } from "@/components/ui/Input";
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
  ChevronDown,
} from "lucide-react";

export const PropertyDetailsStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
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
        <Input
          label="Foundation Type"
          requiredStar
          placeholder="Crawl Space"
          value={formData.foundationType || ""}
          onChange={(e) => {
            updateFormData({ foundationType: e.target.value });
            clearError("foundationType");
          }}
          error={errors.foundationType}
          leftIcon={<Home className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Client Attending */}
        <Input
          label="Client Attending"
          requiredStar
          placeholder="Yes - Client Present"
          value={formData.clientAttending || ""}
          onChange={(e) => {
            updateFormData({ clientAttending: e.target.value });
            clearError("clientAttending");
          }}
          error={errors.clientAttending}
          leftIcon={<UserCheck className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Home Occupied */}
        <Input
          label="Home Occupied"
          requiredStar
          placeholder="Occupied"
          value={formData.homeOccupied || ""}
          onChange={(e) => {
            updateFormData({ homeOccupied: e.target.value });
            clearError("homeOccupied");
          }}
          error={errors.homeOccupied}
          leftIcon={<Users className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Is it a Gated Community */}
        <Input
          label="Is it a Gated Community"
          requiredStar
          placeholder="Yes"
          value={formData.isGatedCommunity || ""}
          onChange={(e) => {
            updateFormData({ isGatedCommunity: e.target.value });
            clearError("isGatedCommunity");
          }}
          error={errors.isGatedCommunity}
          leftIcon={<Shield className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Is there any Alarm System */}
        <Input
          label="Is there any Alarm System"
          requiredStar
          placeholder="Yes"
          value={formData.hasAlarmSystem || ""}
          onChange={(e) => {
            updateFormData({ hasAlarmSystem: e.target.value });
            clearError("hasAlarmSystem");
          }}
          error={errors.hasAlarmSystem}
          leftIcon={<Clock className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Pool/Spa */}
        <Input
          label="Pool/Spa"
          requiredStar
          placeholder="Yes"
          value={formData.hasPoolSpa || ""}
          onChange={(e) => {
            updateFormData({ hasPoolSpa: e.target.value });
            clearError("hasPoolSpa");
          }}
          error={errors.hasPoolSpa}
          leftIcon={<Waves className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Type of Sewage System */}
        <Input
          label="Type of Sewage System"
          requiredStar
          placeholder="Public Sewer System"
          value={formData.sewageSystem || ""}
          onChange={(e) => {
            updateFormData({ sewageSystem: e.target.value });
            clearError("sewageSystem");
          }}
          error={errors.sewageSystem}
          leftIcon={<Settings className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Type of Water System */}
        <Input
          label="Type of Water System"
          requiredStar
          placeholder="Well Water"
          value={formData.waterSystem || ""}
          onChange={(e) => {
            updateFormData({ waterSystem: e.target.value });
            clearError("waterSystem");
          }}
          error={errors.waterSystem}
          leftIcon={<Droplet className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Utilities On */}
        <Input
          label="Utilities On"
          requiredStar
          placeholder="All Utilities On"
          value={formData.utilitiesOn || ""}
          onChange={(e) => {
            updateFormData({ utilitiesOn: e.target.value });
            clearError("utilitiesOn");
          }}
          error={errors.utilitiesOn}
          leftIcon={<Zap className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* How Did You Hear About Us? */}
        <Input
          label="How Did You Hear About Us?"
          requiredStar
          placeholder="Real Estate Agent"
          value={formData.hearAboutUs || ""}
          onChange={(e) => {
            updateFormData({ hearAboutUs: e.target.value });
            clearError("hearAboutUs");
          }}
          error={errors.hearAboutUs}
          leftIcon={<Megaphone className="w-5 h-5 text-muted" />}
          rightAction={<ChevronDown className="w-5 h-5 text-muted pointer-events-none" />}
        />

        {/* Gate Code */}
        <Input
          label="Gate Code"
          placeholder="01254"
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
          placeholder="any Due"
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
        placeholder="Access instructions, anything we should know..."
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
