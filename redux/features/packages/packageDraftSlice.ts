import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PackageFormData, WizardStep } from "@/types/wizard";
import { ApiPackage } from "@/types/packages";

export const initialPackageFormData: PackageFormData = {
  type: "Single",
  category: "Resale Home",
  name: "",
  shortDescription: "",
  price: "",
  serviceIds: [],
  whyItMatters:
    "A persuasive sentence shown in the expandable block on the portal — e.g. 'Buyers make a six-figure decision on a single walkthrough. A Signature inspection surfaces the repairs that change the negotiation.'",
  featuresIncluded: [
    "Structural components & foundation",
    "Roofing system & attic space",
    "Electrical panels, wiring & outlets",
    "Heating & cooling systems (HVAC)",
  ],
  image: "/assets/images/safe_home_package.jpg",
  videoUrl: "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
  file: null,
  existingMediaUrl: "",
  isRecommended: true,
  status: "Published",
};

interface PackageDraftState {
  formData: PackageFormData;
  activePackageId: string | null;
  currentStep: WizardStep;
  isDirty: boolean;
}

const initialState: PackageDraftState = {
  formData: initialPackageFormData,
  activePackageId: null,
  currentStep: "basic",
  isDirty: false,
};

export const packageDraftSlice = createSlice({
  name: "packageDraft",
  initialState,
  reducers: {
    updateDraftFields: (
      state,
      action: PayloadAction<Partial<PackageFormData>>,
    ) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
      state.isDirty = true;
    },

    setDraftFile: (state, action: PayloadAction<File | null>) => {
      state.formData.file = action.payload;
      state.isDirty = true;
    },

    setWizardStep: (state, action: PayloadAction<WizardStep>) => {
      state.currentStep = action.payload;
    },

    initNewDraft: (state) => {
      state.formData = { ...initialPackageFormData };
      state.activePackageId = null;
      state.currentStep = "basic";
      state.isDirty = false;
    },

    loadPackageForEdit: (state, action: PayloadAction<ApiPackage>) => {
      const pkg = action.payload;
      const categoryUpper = (pkg.category || "").toUpperCase();
      const category =
        categoryUpper === "NEW_CONSTRUCTION" ||
        categoryUpper === "NEW CONSTRUCTION"
          ? "New Construction"
          : "Resale Home";

      const typeUpper = (pkg.type || "").toUpperCase();
      const type = typeUpper === "SINGLE" ? "Single" : "Bundle";

      const statusUpper = (pkg.status || "").toUpperCase();
      const status = statusUpper === "DRAFT" ? "Draft" : "Published";

      const priceDollars = (pkg.priceCents || 0) / 100;
      const priceString = priceDollars > 0 ? `$${priceDollars.toLocaleString()}` : "";

      const primaryMedia = pkg.media?.[0];
      const mediaUrl =
        pkg.mediaUrl ||
        primaryMedia?.url ||
        "/assets/images/safe_home_package.jpg";
      const isVideo = primaryMedia?.mimeType?.startsWith("video/") || false;

      const rawServices = pkg.serviceIds || (pkg as any).services || [];
      const serviceIds = Array.isArray(rawServices)
        ? rawServices
            .map((s: any) => (typeof s === "string" ? s : s?.id || ""))
            .filter(Boolean)
        : [];

      state.activePackageId = pkg.id;
      state.formData = {
        type,
        category,
        name: pkg.name || "",
        shortDescription: pkg.description || "",
        price: priceString,
        serviceIds,
        whyItMatters:
          pkg.whyItMatters || initialPackageFormData.whyItMatters,
        featuresIncluded:
          Array.isArray(pkg.features) && pkg.features.length > 0
            ? pkg.features
            : [...initialPackageFormData.featuresIncluded],
        image: mediaUrl,
        videoUrl: isVideo ? mediaUrl : "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
        file: null,
        existingMediaUrl: mediaUrl,
        isRecommended: Boolean(pkg.recommended ?? pkg.best),
        status,
      };
      state.isDirty = false;
    },

    resetDraft: (state) => {
      state.formData = { ...initialPackageFormData };
      state.activePackageId = null;
      state.currentStep = "basic";
      state.isDirty = false;
    },
  },
});

export const {
  updateDraftFields,
  setDraftFile,
  setWizardStep,
  initNewDraft,
  loadPackageForEdit,
  resetDraft,
} = packageDraftSlice.actions;

export default packageDraftSlice.reducer;
