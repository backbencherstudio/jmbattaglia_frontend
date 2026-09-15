"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
      { id: "inspection-type", number: 1, title: "Inspection type", mainStepId: "inspection" },
      { id: "property-address", number: 2, title: "Property address", mainStepId: "inspection" },
      { id: "property-details", number: 3, title: "Property details", mainStepId: "inspection" },
      { id: "package-addons", number: 4, title: "Package & add-ons", mainStepId: "inspection" },

    ],
  },
  {
    id: "schedule",
    number: 3,
    title: "Schedule",
    iconName: "calendar",
    subSteps: [
      { id: "date-time", number: 1, title: "Date and time", mainStepId: "schedule" },
    ],
  },
  {
    id: "review-confirm",
    number: 4,
    title: "Review & confirm",
    iconName: "file-text",
    subSteps: [
      { id: "review", number: 1, title: "Review", mainStepId: "review-confirm" },
      { id: "confirmation", number: 2, title: "Confirmation", mainStepId: "review-confirm" },
    ],
  },
];

export const useStepperForm = (initialData: Partial<StepperFormData> = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to parse step & substep from URL search parameters
  const parseUrlSteps = useCallback(() => {
    const stepParam = searchParams.get("step");
    const subStepParam = searchParams.get("substep");

    let mainIndex = 0;
    let subIndex = 0;

    if (stepParam) {
      const foundMainIdx = STEP_CONFIG.findIndex(
        (s) => s.id === stepParam || String(s.number) === stepParam
      );
      if (foundMainIdx !== -1) mainIndex = foundMainIdx;
    }

    if (subStepParam) {
      const targetMain = STEP_CONFIG[mainIndex];
      const foundSubIdx = targetMain?.subSteps.findIndex(
        (sub) => sub.id === subStepParam || String(sub.number) === subStepParam
      );
      if (foundSubIdx !== -1 && foundSubIdx !== undefined) {
        subIndex = foundSubIdx;
      }
    }

    return { mainIndex, subIndex };
  }, [searchParams]);

  const initialSteps = useMemo(() => parseUrlSteps(), []);

  const [currentMainStepIndex, setCurrentMainStepIndex] = useState(initialSteps.mainIndex);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(initialSteps.subIndex);

  const [formData, setFormData] = useState<StepperFormData>({
    customerRole: "home-buyer",
    ...initialData,
  });
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when URL search parameters change (e.g. browser Back/Forward or manual refresh)
  useEffect(() => {
    const { mainIndex, subIndex } = parseUrlSteps();
    setCurrentMainStepIndex(mainIndex);
    setCurrentSubStepIndex(subIndex);
  }, [searchParams, parseUrlSteps]);

  // Helper to update URL search parameters without full page reload
  const pushStepUrl = useCallback(
    (mainIdx: number, subIdx: number) => {
      const targetMain = STEP_CONFIG[mainIdx];
      const targetSub = targetMain?.subSteps[subIdx];

      if (!targetMain || !targetSub) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("step", targetMain.id);
      params.set("substep", targetSub.id);

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

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
    } else if (currentSubStep?.id === "your-info") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required.";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required.";
      }
      if (!formData.email) {
        newErrors.email = "Email address is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!formData.phone) {
        newErrors.phone = "Mobile phone number is required.";
      }
    } else if (currentSubStep?.id === "inspection-type") {
      if (!formData.inspectionKind) {
        newErrors.inspectionKind = "Please select what kind of inspection you need.";
      }
    } else if (currentSubStep?.id === "property-address") {
      if (!formData.addressLine1) {
        newErrors.addressLine1 = "Address Line 1 is required.";
      }
      if (!formData.city) {
        newErrors.city = "City is required.";
      }
      if (!formData.state) {
        newErrors.state = "State is required.";
      }
      if (!formData.zipCode) {
        newErrors.zipCode = "Zip Code is required.";
      }
    } else if (currentSubStep?.id === "property-details") {
      if (!formData.yearBuilt) {
        newErrors.yearBuilt = "Year Built is required.";
      }
      if (!formData.squareFeet) {
        newErrors.squareFeet = "Square Feet is required.";
      }
    } else if (currentSubStep?.id === "date-time") {
      if (!formData.selectedDate) {
        newErrors.selectedDate = "Please select an inspection date.";
      }
      if (!formData.selectedTimeSlot) {
        newErrors.selectedTimeSlot = "Please select a time slot.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentSubStep, formData]);

  const goToNext = useCallback(() => {
    if (!validateCurrentStep()) return false;

    let nextMain = currentMainStepIndex;
    let nextSub = currentSubStepIndex;

    if (currentSubStepIndex < currentMainStep.subSteps.length - 1) {
      nextSub = currentSubStepIndex + 1;
    } else if (currentMainStepIndex < STEP_CONFIG.length - 1) {
      nextMain = currentMainStepIndex + 1;
      nextSub = 0;
    } else {
      return true;
    }

    setCurrentMainStepIndex(nextMain);
    setCurrentSubStepIndex(nextSub);
    pushStepUrl(nextMain, nextSub);
    return true;
  }, [
    currentMainStep,
    currentMainStepIndex,
    currentSubStepIndex,
    validateCurrentStep,
    pushStepUrl,
  ]);

  const goToBack = useCallback(() => {
    let nextMain = currentMainStepIndex;
    let nextSub = currentSubStepIndex;

    if (currentSubStepIndex > 0) {
      nextSub = currentSubStepIndex - 1;
    } else if (currentMainStepIndex > 0) {
      nextMain = currentMainStepIndex - 1;
      nextSub = STEP_CONFIG[nextMain].subSteps.length - 1;
    } else {
      return;
    }

    setCurrentMainStepIndex(nextMain);
    setCurrentSubStepIndex(nextSub);
    pushStepUrl(nextMain, nextSub);
  }, [currentMainStepIndex, currentSubStepIndex, pushStepUrl]);

  const selectMainStep = useCallback(
    (mainStepIndex: number) => {
      if (mainStepIndex <= currentMainStepIndex) {
        setCurrentMainStepIndex(mainStepIndex);
        setCurrentSubStepIndex(0);
        pushStepUrl(mainStepIndex, 0);
      }
    },
    [currentMainStepIndex, pushStepUrl]
  );

  const selectSubStep = useCallback(
    (subStepIndex: number) => {
      if (subStepIndex <= currentSubStepIndex || currentMainStepIndex > 0) {
        setCurrentSubStepIndex(subStepIndex);
        pushStepUrl(currentMainStepIndex, subStepIndex);
      }
    },
    [currentSubStepIndex, currentMainStepIndex, pushStepUrl]
  );

  const navigateToStep = useCallback(
    (mainIdx: number, subIdx: number) => {
      const targetMain = STEP_CONFIG[mainIdx];
      const targetSub = targetMain?.subSteps[subIdx];

      if (targetMain && targetSub) {
        setCurrentMainStepIndex(mainIdx);
        setCurrentSubStepIndex(subIdx);
        pushStepUrl(mainIdx, subIdx);
      }
    },
    [pushStepUrl]
  );

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
    navigateToStep,
    isFirstStep,
    isLastStep,
    isSubmitting,
    setIsSubmitting,
  };
};
