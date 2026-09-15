"use client";

import { useState, useMemo, useCallback } from "react";
import { MainStep, StepperFormData, FormValidationErrors } from "@/types/stepper";

export const STEP_CONFIG: MainStep[] = [
  {
    id: "about-you",
    number: 1,
    title: "About you",
    iconName: "user",
    subSteps: [
      { id: "who-its-for", number: 1, title: "Who it's for", mainStepId: "about-you" },
      { id: "customer-type", number: 2, title: "Customer type", mainStepId: "about-you" },
      { id: "your-info", number: 3, title: "Your info", mainStepId: "about-you" },
    ],
  },
  {
    id: "inspection",
    number: 2,
    title: "Inspection",
    iconName: "clipboard",
    subSteps: [
      { id: "services", number: 1, title: "Select Services", mainStepId: "inspection" },
      { id: "property-details", number: 2, title: "Property Details", mainStepId: "inspection" },
    ],
  },
  {
    id: "schedule",
    number: 3,
    title: "Schedule",
    iconName: "calendar",
    subSteps: [
      { id: "date-time", number: 1, title: "Select Date & Time", mainStepId: "schedule" },
    ],
  },
  {
    id: "review-confirm",
    number: 4,
    title: "Review & confirm",
    iconName: "file-text",
    subSteps: [
      { id: "summary", number: 1, title: "Order Summary", mainStepId: "review-confirm" },
    ],
  },
];

export const useStepperForm = (initialData: Partial<StepperFormData> = {}) => {
  const [currentMainStepIndex, setCurrentMainStepIndex] = useState(0);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(0);
  const [formData, setFormData] = useState<StepperFormData>({
    customerRole: "home-buyer",
    ...initialData,
  });
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMainStep = useMemo(
    () => STEP_CONFIG[currentMainStepIndex],
    [currentMainStepIndex]
  );

  const currentSubStep = useMemo(
    () => currentMainStep?.subSteps[currentSubStepIndex],
    [currentMainStep, currentSubStepIndex]
  );

  const updateFormData = useCallback((fields: Partial<StepperFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // Validation strategy per substep (SOLID principle - easily extensible)
  const validateCurrentStep = useCallback((): boolean => {
    const newErrors: FormValidationErrors = {};

    if (currentSubStep?.id === "who-its-for") {
      if (!formData.customerRole) {
        newErrors.customerRole = "Please select who this inspection is for.";
      }
    } else if (currentSubStep?.id === "customer-type") {
      if (!formData.email) {
        newErrors.email = "Email address is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentSubStep, formData]);

  const goToNext = useCallback(() => {
    if (!validateCurrentStep()) return false;

    // Check if there's another substep in current main step
    if (currentSubStepIndex < currentMainStep.subSteps.length - 1) {
      setCurrentSubStepIndex((prev) => prev + 1);
      return true;
    }

    // Move to next main step if available
    if (currentMainStepIndex < STEP_CONFIG.length - 1) {
      setCurrentMainStepIndex((prev) => prev + 1);
      setCurrentSubStepIndex(0);
      return true;
    }

    return true;
  }, [currentMainStep, currentMainStepIndex, currentSubStepIndex, validateCurrentStep]);

  const goToBack = useCallback(() => {
    // If we're not at the first substep of current main step
    if (currentSubStepIndex > 0) {
      setCurrentSubStepIndex((prev) => prev - 1);
      return;
    }

    // Go to last substep of previous main step
    if (currentMainStepIndex > 0) {
      const prevMainIndex = currentMainStepIndex - 1;
      setCurrentMainStepIndex(prevMainIndex);
      setCurrentSubStepIndex(STEP_CONFIG[prevMainIndex].subSteps.length - 1);
    }
  }, [currentMainStepIndex, currentSubStepIndex]);

  const selectMainStep = useCallback((mainStepIndex: number) => {
    if (mainStepIndex <= currentMainStepIndex) {
      setCurrentMainStepIndex(mainStepIndex);
      setCurrentSubStepIndex(0);
    }
  }, [currentMainStepIndex]);

  const selectSubStep = useCallback((subStepIndex: number) => {
    if (subStepIndex <= currentSubStepIndex || currentMainStepIndex > 0) {
      setCurrentSubStepIndex(subStepIndex);
    }
  }, [currentSubStepIndex, currentMainStepIndex]);

  const isFirstStep = currentMainStepIndex === 0 && currentSubStepIndex === 0;
  const isLastStep =
    currentMainStepIndex === STEP_CONFIG.length - 1 &&
    currentSubStepIndex === currentMainStep?.subSteps.length - 1;

  return {
    steps: STEP_CONFIG,
    currentMainStepIndex,
    currentSubStepIndex,
    currentMainStep,
    currentSubStep,
    formData,
    updateFormData,
    errors,
    setError,
    clearError,
    goToNext,
    goToBack,
    selectMainStep,
    selectSubStep,
    isFirstStep,
    isLastStep,
    isSubmitting,
    setIsSubmitting,
  };
};
