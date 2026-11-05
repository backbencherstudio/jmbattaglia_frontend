export interface ClientLookupData {
  found: boolean;
  client: any;
  contact: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
  customerType: "HOME_BUYER" | "HOME_OWNER" | "BUYERS_AGENT" | null;
  previousProperty?: any;
}

export interface FoundationTypeItem {
  id: string;
  name: string;
  visible?: boolean;
}

export interface OrderTypeItem {
  id: string;
  name: string;
  visible?: boolean;
}

export interface PortalPackageItem {
  id: string;
  name: string;
  description: string;
  category: "RESALE_HOME" | "NEW_CONSTRUCTION";
  type: "BUNDLE" | "SINGLE" | string;
  priceCents: number;
  price: number;
  formattedPrice: string;
  bundlePrice?: string;
  recommended?: boolean;
  best?: boolean;
  whyItMatters?: string;
  features?: string[];
  media?: any[];
  mediaUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  serviceIds?: string[];
  services?: {
    id: string;
    name: string;
    priceCents: number;
    ancillary?: boolean;
  }[];
  active?: boolean;
  visible?: boolean;
  status?: string;
  source?: string;
}

export interface PortalAddonItem {
  id: number | string;
  name: string;
  description: string;
  category: "RESALE_HOME" | "NEW_CONSTRUCTION";
  kind?: string;
  priceCents: number;
  price: number;
  formattedPrice: string;
  recommended?: boolean;
  whyItMatters?: string;
  features?: string[];
  media?: any[];
  mediaUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  isnServiceId?: string | null;
  services?: {
    id: string;
    name: string;
    priceCents: number;
  }[];
}

export interface PropertyDto {
  foundationType: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  yearBuilt: number;
  squareFeet: number;
  clientAttending: boolean;
  occupied: boolean;
  gatedCommunity: boolean;
  alarmSystem: boolean;
  poolSpa: boolean;
  sewageSystem: "PUBLIC" | "SEPTIC" | "ATU" | "SHARED_SEPTIC";
  waterSystem: "PUBLIC" | "WELL" | "SHARED_WELL" | "CISTERN";
  utilitiesOn: boolean;
  referral: string;
  gateCode?: string;
  dueDiligence?: string;
  dueDiligenceDate?: string;
  notes?: string;
}

export interface ContactDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface QuoteLineItem {
  id: string;
  name: string;
  amountCents: number;
}

export interface CalculatedQuoteData {
  quoteId: string;
  lines: QuoteLineItem[];
  totalCents: number;
  durationMinutes: number;
  serviceIds: string[];
  packageId?: string;
  orderTypeId?: string;
  currency: string;
  expiresAt: string;
  timezone?: string;
  pricingStatus?: string;
}

export interface AvailableSlotItem {
  date: string;
  time: string;
  inspectorId: string;
  inspectorName: string;
  durationMinutes: number;
}

export interface AvailableSlotsData {
  quoteId: string;
  timezone?: string;
  appointments: AvailableSlotItem[];
}

export interface DirectOrderPayload {
  quoteId: string;
  category: "RESALE_HOME" | "NEW_CONSTRUCTION";
  packageId?: string;
  serviceIds: string[];
  orderTypeId?: string;
  property: PropertyDto;
  customerType: "HOME_BUYER" | "HOME_OWNER" | "BUYERS_AGENT";
  contact: ContactDto;
  buyerContact?: ContactDto;
  date: string;
  time: string;
  inspectorId: string;
}
