import type { CalculatedQuoteData } from "./booking";

export interface MainStep {
  id: string;
  number: number;
  title: string;
  iconName: "user" | "clipboard" | "calendar" | "file-text";
  subSteps: SubStep[];
}

export interface SubStep {
  id: string;
  number: number;
  title: string;
  mainStepId: string;
}

export interface StepperFormData {
  // Step 1: Who it's for
  customerRole?: "home-buyer" | "home-owner" | "buyers-agent";
  
  // Step 1: Customer Type / Email Verification
  email?: string;
  emailVerified?: boolean;
  isExistingClient?: boolean;
  
  // Step 1: Your info
  firstName?: string;
  lastName?: string;
  phone?: string;

  // Step 1: Buyer Contact (for Buyer's Agent role)
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  
  // Step 2: Inspection - Type
  inspectionKind?: "resale-home" | "new-construction";

  // Step 2: Inspection - Property Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Step 2: Inspection - Property Details
  yearBuilt?: string;
  squareFeet?: string;
  foundationType?: string; // UUID from ISN foundation types
  foundationName?: string;
  clientAttending?: string;
  homeOccupied?: string;
  isGatedCommunity?: string;
  hasAlarmSystem?: string;
  hasPoolSpa?: string;
  sewageSystem?: string;
  waterSystem?: string;
  utilitiesOn?: string;
  hearAboutUs?: string;
  gateCode?: string;
  dueDiligence?: string;
  specialInstructions?: string;

  // Step 2: Inspection - Package & Add-ons
  selectedPackage?: string; // UUID from portal packages
  selectedAddons?: string[]; // Array of UUIDs from portal addons
  
  // Calculated ISN Quote (valid for 30 minutes in Redis)
  quoteId?: string;
  calculatedQuote?: CalculatedQuoteData | null;
  quoteError?: string | null;

  // Step 3: Schedule
  selectedDate?: string;
  selectedTimeSlot?: string;
  inspectorId?: string;
  inspectorName?: string;
  durationMinutes?: number;

  // Submission & Receipt
  idempotencyKey?: string;
  orderId?: string;
  orderReceipt?: any;

  // Dynamic step metadata
  [key: string]: any;
}

export interface FormValidationErrors {
  [key: string]: string;
}

export interface StepProps {
  formData: StepperFormData;
  updateFormData: (fields: Partial<StepperFormData>) => void;
  errors: FormValidationErrors;
  clearError: (field: string) => void;
  setError: (field: string, message: string) => void;
  resetFormData?: () => void;
}
