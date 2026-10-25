"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MainStep, StepperFormData, FormValidationErrors } from "@/types/stepper";
import {
  loadBookingFromStorage,
  saveBookingToStorage,
  clearBookingFromStorage,
  saveConfirmedOrderToStorage,
  loadConfirmedOrderFromStorage,
  clearConfirmedOrderFromStorage,
} from "@/lib/bookingUtils";


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

const generateIdempotencyKey = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const DEFAULT_FORM_DATA: StepperFormData = {
  customerRole: "home-buyer",
  inspectionKind: "resale-home",
  state: "Georgia (GA)",
  hearAboutUs: "Google Search / Web",
  clientAttending: "Yes – Client Will Attend Entire Inspection",
  homeOccupied: "Occupied (Furnished & Inhabited)",
  isGatedCommunity: "No – Open Access Community",
  hasAlarmSystem: "No Alarm System",
  hasPoolSpa: "None (No Pool or Spa)",
  sewageSystem: "Public Sewer Line",
  waterSystem: "Public / Municipal Water",
  utilitiesOn: "All Utilities Fully Operational (Electric, Water, Gas)",
};

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

  const initialSteps = useMemo(() => parseUrlSteps(), [parseUrlSteps]);

  const [currentMainStepIndex, setCurrentMainStepIndex] = useState(initialSteps.mainIndex);
  const [currentSubStepIndex, setCurrentSubStepIndex] = useState(initialSteps.subIndex);

  const [formData, setFormData] = useState<StepperFormData>(() => {
    if (typeof window !== "undefined") {
      const isConfirmation = searchParams.get("substep") === "confirmation";
      if (isConfirmation) {
        const confirmed = loadConfirmedOrderFromStorage();
        if (confirmed && Object.keys(confirmed).length > 0) {
          return {
            ...DEFAULT_FORM_DATA,
            ...confirmed,
            ...initialData,
          };
        }
      }
      const saved = loadBookingFromStorage();
      const idempotencyKey = saved?.idempotencyKey || generateIdempotencyKey();
      return {
        ...DEFAULT_FORM_DATA,
        ...saved,
        ...initialData,
        idempotencyKey,
      };
    }
    return {
      ...DEFAULT_FORM_DATA,
      ...initialData,
      idempotencyKey: generateIdempotencyKey(),
    };
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when URL search parameters change (e.g. browser Back/Forward or manual refresh)
  useEffect(() => {
    const { mainIndex, subIndex } = parseUrlSteps();
    setCurrentMainStepIndex(mainIndex);
    setCurrentSubStepIndex(subIndex);
  }, [searchParams, parseUrlSteps]);

  // Load persistence on client mount
  useEffect(() => {
    const isConfirmation = searchParams.get("substep") === "confirmation";
    if (isConfirmation) {
      const confirmed = loadConfirmedOrderFromStorage();
      if (confirmed && Object.keys(confirmed).length > 0) {
        setFormData((prev) => ({ ...prev, ...confirmed }));
      }
    } else {
      const saved = loadBookingFromStorage();
      if (saved && Object.keys(saved).length > 0) {
        setFormData((prev) => {
          const merged = { ...prev, ...saved };
          if (!merged.idempotencyKey) {
            merged.idempotencyKey = generateIdempotencyKey();
          }
          return merged;
        });
      }
    }
  }, [searchParams]);

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
    setFormData((prev) => {
      const next = { ...prev, ...fields };
      // Save draft booking to sessionStorage
      saveBookingToStorage(next);
      return next;
    });
  }, []);

  const completeOrder = useCallback(
    (orderReceipt: any, orderId: string) => {
      // 1. Immediately clear the draft booking from sessionStorage
      clearBookingFromStorage();

      // 2. Snapshot the completed booking and persist in confirmed order storage
      setFormData((prev) => {
        const confirmedSnapshot: StepperFormData = {
          ...prev,
          orderReceipt,
          orderId,
        };
        saveConfirmedOrderToStorage(confirmedSnapshot);
        return confirmedSnapshot;
      });

      // 3. Clear any validation errors
      setErrors({});

      // 4. Navigate directly to confirmation step (Review & confirm -> Confirmation)
      const reviewConfirmIdx = STEP_CONFIG.findIndex((s) => s.id === "review-confirm");
      const confirmationSubIdx =
        reviewConfirmIdx !== -1
          ? STEP_CONFIG[reviewConfirmIdx].subSteps.findIndex((sub) => sub.id === "confirmation")
          : 1;

      setCurrentMainStepIndex(reviewConfirmIdx !== -1 ? reviewConfirmIdx : 3);
      setCurrentSubStepIndex(confirmationSubIdx !== -1 ? confirmationSubIdx : 1);
      pushStepUrl(
        reviewConfirmIdx !== -1 ? reviewConfirmIdx : 3,
        confirmationSubIdx !== -1 ? confirmationSubIdx : 1
      );
    },
    [pushStepUrl]
  );

  const resetFormData = useCallback(() => {
    // Clear both draft and confirmed booking state from sessionStorage
    clearBookingFromStorage();
    clearConfirmedOrderFromStorage();

    const newKey = generateIdempotencyKey();
    const freshData: StepperFormData = {
      ...DEFAULT_FORM_DATA,
      idempotencyKey: newKey,
    };
    setFormData(freshData);
    setErrors({});
    setCurrentMainStepIndex(0);
    setCurrentSubStepIndex(0);
    pushStepUrl(0, 0);
  }, [pushStepUrl]);


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

  // Validation strategy per substep
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
      if (!formData.firstName?.trim()) {
        newErrors.firstName = "First name is required.";
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = "Last name is required.";
      }
      if (!formData.email?.trim()) {
        newErrors.email = "Email address is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = "Mobile phone number is required.";
      } else if (!/^[+()0-9 .-]{7,30}$/.test(formData.phone.trim())) {
        newErrors.phone = "Phone number must be between 7 and 30 characters (digits, spaces, +, -, (), . allowed).";
      }

      if (formData.customerRole === "buyers-agent") {
        if (formData.buyerPhone?.trim() && !/^[+()0-9 .-]{7,30}$/.test(formData.buyerPhone.trim())) {
          newErrors.buyerPhone = "Buyer phone number must be between 7 and 30 characters.";
        }
        if (formData.buyerEmail?.trim() && !/\S+@\S+\.\S+/.test(formData.buyerEmail.trim())) {
          newErrors.buyerEmail = "Please enter a valid buyer email address.";
        }
      }
    } else if (currentSubStep?.id === "inspection-type") {
      if (!formData.inspectionKind) {
        newErrors.inspectionKind = "Please select what kind of inspection you need.";
      }
    } else if (currentSubStep?.id === "property-address") {
      if (!formData.addressLine1?.trim()) {
        newErrors.addressLine1 = "Address Line 1 is required.";
      }
      if (!formData.city?.trim()) {
        newErrors.city = "City is required.";
      }
      if (!formData.state?.trim()) {
        newErrors.state = "State is required.";
      }
      if (!formData.zipCode?.trim()) {
        newErrors.zipCode = "Zip Code is required.";
      }
    } else if (currentSubStep?.id === "property-details") {
      if (!formData.yearBuilt) {
        newErrors.yearBuilt = "Year Built is required.";
      }
      if (!formData.squareFeet) {
        newErrors.squareFeet = "Square Feet is required.";
      }
      if (!formData.foundationType) {
        newErrors.foundationType = "Foundation Type is required.";
      }
    } else if (currentSubStep?.id === "package-addons") {
      if (!formData.selectedPackage) {
        newErrors.selectedPackage = "Please select an inspection package.";
      }
    } else if (currentSubStep?.id === "date-time") {
      if (!formData.selectedDate) {
        newErrors.selectedDate = "Please select an inspection date.";
      }
      if (!formData.selectedTimeSlot) {
        newErrors.selectedTimeSlot = "Please select an appointment time slot.";
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
    resetFormData,
    errors,
    setError,
    clearError,
    goToNext,
    goToBack,
    selectMainStep,
    selectSubStep,
    navigateToStep,
    completeOrder,
    isFirstStep,
    isLastStep,
    isSubmitting,
    setIsSubmitting,
  };
};
