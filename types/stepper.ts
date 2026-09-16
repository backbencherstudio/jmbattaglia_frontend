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
  
  // Step 2 & 3: Info & Details
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  
  // Step 2: Inspection
  inspectionKind?: "resale-home" | "new-construction";
  selectedPackage?: string;
  selectedAddons?: string[];

  // Step 2: Inspection - Property Details
  yearBuilt?: string;
  squareFeet?: string;
  foundationType?: string;
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
  
  // Step 3: Schedule
  selectedDate?: string;
  selectedTimeSlot?: string;

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
}
