"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Check, AlertCircle, Loader2, X } from "lucide-react";
import { useTabQuery } from "@/hooks/useTabQuery";
import { PackageFormData, WizardStep } from "@/types/wizard";
import { WizardStepBasicInfo } from "@/components/admin/packages/wizard/WizardStepBasicInfo";
import { WizardStepMedia } from "@/components/admin/packages/wizard/WizardStepMedia";
import { WizardStepReview } from "@/components/admin/packages/wizard/WizardStepReview";
import {
  useCreateAdminPackageMutation,
  useGetAdminPackageByIdQuery,
  useUpdateAdminPackageMutation,
} from "@/redux/features/packages/packageApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  initNewDraft,
  loadPackageForEdit,
  resetDraft,
  setWizardStep,
  updateDraftFields,
} from "@/redux/features/packages/packageDraftSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface CreatePackageWizardProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreatePackageWizard({
  onBack,
  onSuccess,
}: CreatePackageWizardProps) {
  const { getParam, updateQueryParams } = useTabQuery();
  const dispatch = useAppDispatch();

  // Package ID in URL if already created or in edit mode
  const packageId = getParam("id");
  const isEditMode = Boolean(packageId);

  // Active step from URL search param (default: 'basic')
  const stepParam = getParam("step", "basic") as WizardStep;
  const currentStep: WizardStep = ["basic", "media", "review"].includes(stepParam)
    ? stepParam
    : "basic";

  // Redux draft state
  const draft = useAppSelector((state) => state.packageDraft);
  const formData = draft.formData;

  // API mutations & query
  const [createAdminPackage, { isLoading: isCreating }] =
    useCreateAdminPackageMutation();
  const [updateAdminPackage, { isLoading: isUpdating }] =
    useUpdateAdminPackageMutation();
  const isSubmitting = isCreating || isUpdating;

  // GET package by id from URL
  const {
    data: packageDetailData,
    isLoading: isFetchingPackage,
    refetch: refetchPackage,
  } = useGetAdminPackageByIdQuery(packageId as string, {
    skip: !packageId,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync draft state with GET response whenever packageId changes or data updates
  useEffect(() => {
    if (packageId && packageDetailData?.data) {
      dispatch(loadPackageForEdit(packageDetailData.data));
    } else if (!packageId && draft.activePackageId !== null) {
      dispatch(initNewDraft());
    }
  }, [
    packageId,
    packageDetailData?.data?.id,
    packageDetailData?.data?.updatedAt,
    dispatch,
  ]);

  const updateFormData = (fields: Partial<PackageFormData>) => {
    setFormError(null);
    dispatch(updateDraftFields(fields));
  };

  // Build FormData for POST or PATCH
  const buildFormData = async (
    targetStatus: "PUBLISHED" | "DRAFT",
    isInitialCreate: boolean
  ): Promise<FormData> => {
    const fd = new FormData();

    // Step 1: Basic Info
    fd.append("name", (formData.name || "Untitled Package").trim());

    const apiType =
      formData.type?.toUpperCase() === "SINGLE" ? "SINGLE" : "BUNDLE";
    fd.append("type", apiType);

    const apiCategory =
      formData.category === "New Construction"
        ? "NEW_CONSTRUCTION"
        : "RESALE_HOME";
    fd.append("category", apiCategory);

    const numericPrice = (formData.price || "").replace(/[^0-9.]/g, "");
    const dollars = parseFloat(numericPrice) || 0;
    const priceCents = Math.round(dollars * 100);
    fd.append("priceCents", String(priceCents));

    fd.append("description", (formData.shortDescription || "").trim());

    // Step 2: Educational Content & Media
    fd.append("whyItMatters", (formData.whyItMatters || "").trim());

    if (Array.isArray(formData.featuresIncluded)) {
      formData.featuresIncluded
        .map((f) => f.trim())
        .filter(Boolean)
        .forEach((feature) => {
          fd.append("features", feature);
        });
    }

    fd.append("recommended", formData.isRecommended ? "true" : "false");
    fd.append("status", targetStatus);

    // Media file
    if (formData.file instanceof File) {
      fd.append("file", formData.file);
    } else if (isInitialCreate) {
      // Attach default image on initial create if user hasn't selected a custom file yet
      try {
        const fallbackUrl =
          formData.image?.startsWith("http")
            ? formData.image
            : formData.image || "/assets/images/safe_home_package.jpg";
        const res = await fetch(fallbackUrl);
        if (res.ok) {
          const blob = await res.blob();
          const fallbackFile = new File([blob], "safe_home_package.jpg", {
            type: blob.type || "image/jpeg",
          });
          fd.append("file", fallbackFile);
        }
      } catch {
        // proceed
      }
    }

    return fd;
  };

  // Step 1 Continue: POST if new (puts ID in URL), else PATCH if ID exists
  const handleStep1Continue = async () => {
    setFormError(null);
    setSuccessToast(null);

    if (!formData.name?.trim()) {
      setFormError("Package name is required. Please enter a package name.");
      return;
    }
    if (!formData.price?.trim()) {
      setFormError("Starting price is required.");
      return;
    }

    try {
      if (!packageId) {
        // POST to create package and retrieve id
        const fd = await buildFormData("DRAFT", true);
        const res = await createAdminPackage(fd).unwrap();
        const createdId = res.data?.id;

        if (createdId) {
          // Keep id in the URL!
          updateQueryParams({ id: createdId, step: "media" });
          dispatch(setWizardStep("media"));
          setSuccessToast("Package created successfully. Proceed to media & educational content.");
        }
      } else {
        // PATCH with existing id
        const fd = await buildFormData(
          formData.status?.toUpperCase() === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          false
        );
        await updateAdminPackage({ id: packageId, formData: fd }).unwrap();
        updateQueryParams({ id: packageId, step: "media" });
        dispatch(setWizardStep("media"));
      }
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Failed to save Step 1 info. Please verify your inputs.")
      );
    }
  };

  // Step 2 Continue: PATCH with id from URL
  const handleStep2Continue = async () => {
    setFormError(null);
    setSuccessToast(null);

    try {
      if (!packageId) {
        // Fallback POST if somehow id wasn't set yet
        const fd = await buildFormData("DRAFT", true);
        const res = await createAdminPackage(fd).unwrap();
        const createdId = res.data?.id;
        if (createdId) {
          updateQueryParams({ id: createdId, step: "review" });
          dispatch(setWizardStep("review"));
        }
      } else {
        // PATCH existing package
        const fd = await buildFormData(
          formData.status?.toUpperCase() === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          false
        );
        await updateAdminPackage({ id: packageId, formData: fd }).unwrap();
        updateQueryParams({ id: packageId, step: "review" });
        dispatch(setWizardStep("review"));
      }
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Failed to save educational content and media.")
      );
    }
  };

  // Step 3 Publish: PATCH with status: PUBLISHED
  const handlePublish = async () => {
    setFormError(null);
    setSuccessToast(null);

    try {
      if (packageId) {
        const fd = await buildFormData("PUBLISHED", false);
        await updateAdminPackage({ id: packageId, formData: fd }).unwrap();
        dispatch(resetDraft());
        onSuccess();
      } else {
        const fd = await buildFormData("PUBLISHED", true);
        await createAdminPackage(fd).unwrap();
        dispatch(resetDraft());
        onSuccess();
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to publish package."));
    }
  };

  // Save as Draft button (works from any step): POST if no ID, else PATCH with ID
  const handleSaveDraft = async () => {
    setFormError(null);
    setSuccessToast(null);

    if (!formData.name?.trim()) {
      setFormError("Please enter a package name to save as draft.");
      return;
    }

    try {
      if (!packageId) {
        const fd = await buildFormData("DRAFT", true);
        const res = await createAdminPackage(fd).unwrap();
        const createdId = res.data?.id;
        if (createdId) {
          updateQueryParams({ id: createdId });
          setSuccessToast("Package created and saved as draft! ID updated in URL.");
        }
      } else {
        const fd = await buildFormData("DRAFT", false);
        await updateAdminPackage({ id: packageId, formData: fd }).unwrap();
        setSuccessToast("Draft package updated successfully!");
      }
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to save draft."));
    }
  };

  // Manual step navigation: keeps ID in URL and triggers fresh GET if id exists
  const handleStepChange = (nextStep: WizardStep) => {
    setFormError(null);
    setSuccessToast(null);
    dispatch(setWizardStep(nextStep));

    if (packageId) {
      updateQueryParams({ id: packageId, step: nextStep });
      refetchPackage();
    } else {
      updateQueryParams({ step: nextStep });
    }
  };

  const steps: { id: WizardStep; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "media", label: "Educational Content & Media" },
    { id: "review", label: "Review" },
  ];

  const stepOrder: WizardStep[] = ["basic", "media", "review"];
  const currentIndex = stepOrder.indexOf(currentStep);

  // Initial loader while fetching package by ID from URL
  if (isEditMode && isFetchingPackage && !draft.formData.name) {
    return (
      <div className="bg-canvas border border-hairline rounded-2xl p-16 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-trade font-bold text-main">Loading package details from server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-xs text-sub">
        <button
          onClick={onBack}
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Packages
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted" />
        <span className="font-semibold text-main">
          {packageId ? "Edit Package" : "Create Package"}
        </span>
        {packageId && (
          <span className="text-[11px] text-muted font-mono bg-canvas px-2 py-0.5 rounded border border-hairline ml-2">
            ID: {packageId}
          </span>
        )}
      </nav>

      {/* Global Form Error Banner */}
      {formError && (
        <div className="flex items-center justify-between p-4 rounded-xl text-sm font-medium text-danger bg-danger-bg border border-danger/20 shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{formError}</span>
          </div>
          <button
            onClick={() => setFormError(null)}
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Toast Banner */}
      {successToast && (
        <div className="flex items-center justify-between p-4 rounded-xl text-sm font-semibold bg-[#24B33C1F] border border-[#24B33C40] text-[#1E9432] shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 stroke-[3] shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Left Stepper Navigation + Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Wizard Stepper */}
        <div className="lg:col-span-4 bg-canvas border border-hairline rounded-xl p-4 space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = step.id === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepChange(step.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-trade font-bold text-base transition-all cursor-pointer ${
                  isCompleted
                    ? "bg-[#B44000] text-white shadow-xs"
                    : isActive
                      ? "bg-[#FF6900] text-white shadow-xs"
                      : "bg-white border border-hairline text-sub hover:text-main"
                }`}
              >
                {/* Icon / Badge Container */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted || isActive
                      ? "bg-[#FFE9D6]"
                      : "bg-canvas border border-hairline text-muted"
                  }`}
                >
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#FF6900] flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full bg-[#FF6900] flex items-center justify-center text-white font-sans text-xs font-bold">
                      {idx + 1}
                    </div>
                  ) : (
                    <span className="font-sans text-xs font-semibold text-muted">
                      {idx + 1}
                    </span>
                  )}
                </div>

                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Step Rendering */}
        <div className="lg:col-span-8">
          {currentStep === "basic" && (
            <WizardStepBasicInfo
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleStep1Continue}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === "media" && (
            <WizardStepMedia
              formData={formData}
              updateFormData={updateFormData}
              onNext={handleStep2Continue}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === "review" && (
            <WizardStepReview
              formData={formData}
              updateFormData={updateFormData}
              onPublish={handlePublish}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
