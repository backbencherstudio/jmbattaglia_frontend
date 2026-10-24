import { StepperFormData } from "@/types/stepper";
import { PropertyDto, ContactDto } from "@/types/booking";

export const BOOKING_STORAGE_KEY = "at_ease_direct_booking_state";

export const US_STATES = [
  "Georgia (GA)",
  "North Carolina (NC)",
  "South Carolina (SC)",
  "Florida (FL)",
  "Tennessee (TN)",
  "Alabama (AL)",
  "California (CA)",
  "Colorado (CO)",
  "Connecticut (CT)",
  "Delaware (DE)",
  "Illinois (IL)",
  "Indiana (IN)",
  "Kentucky (KY)",
  "Maryland (MD)",
  "Massachusetts (MA)",
  "Michigan (MI)",
  "Missouri (MO)",
  "New Jersey (NJ)",
  "New York (NY)",
  "Ohio (OH)",
  "Pennsylvania (PA)",
  "Texas (TX)",
  "Virginia (VA)",
  "Washington (WA)",
];

const VALID_STATE_CODES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY"
]);

/**
 * Checks if a string is a valid UUIDv4.
 */
export const isUuid = (val?: string | null): boolean => {
  if (!val || typeof val !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val.trim());
};

/**
 * Strict phone number validation matching backend direct order API schema:
 * /^[+()0-9 .-]{7,30}$/
 */
export const PHONE_REGEX = /^[+()0-9 .-]{7,30}$/;

export const isValidPhone = (val?: string | null): boolean => {
  if (!val || typeof val !== "string") return false;
  return PHONE_REGEX.test(val.trim());
};

/**
 * Mapping legacy string slugs to active ISN UUIDs.
 */
export const LEGACY_ADDON_UUID_MAP: Record<string, string> = {
  "chemical-balancing": "a52111c7-212d-475a-948a-84f5b00c18d3",
  "spa-maintenance": "56a45531-1ba6-432f-8cc5-2626337ac231",
  "filter-replacement": "0f347f94-0f6a-4560-9ec0-8f4563f5f722",
  "pool-inspection": "71da77a4-f11f-4462-a160-1ab33a5139bf",
};

export const LEGACY_PACKAGE_UUID_MAP: Record<string, string> = {
  "safe-home-package": "e2ff6ec2-72b3-4e31-b06b-680c17aec45b",
  "safe-home-package-1": "da540feb-c721-4da3-992a-8c7aeee37147",
  "residential-home": "d0d3f4f4-d184-4168-9e87-725f37bda9e9",
  "radon-testing": "e3526673-db55-489b-9bc3-018ecfd32c1b",
  "pre-drywall": "c32cb328-765a-4239-a936-b35d2c04a1c5",
  "final-inspection": "10e8a223-122f-42fc-91d6-9d43994558a4",
};

export const NEW_CONSTRUCTION_SERVICES: Record<string, string> = {
  "pre-drywall": "c32cb328-765a-4239-a936-b35d2c04a1c5",
  "c32cb328-765a-4239-a936-b35d2c04a1c5": "c32cb328-765a-4239-a936-b35d2c04a1c5",
  "final-inspection": "10e8a223-122f-42fc-91d6-9d43994558a4",
  "10e8a223-122f-42fc-91d6-9d43994558a4": "10e8a223-122f-42fc-91d6-9d43994558a4",
  "2ce2bbe8-209e-4a62-9893-1841674c3c8b": "c32cb328-765a-4239-a936-b35d2c04a1c5",
};

/**
 * Sanitizes serviceIds ensuring ONLY valid UUIDs are kept, converting legacy slugs.
 */
export const sanitizeServiceIds = (serviceIds?: string[] | null): string[] => {
  if (!Array.isArray(serviceIds)) return [];
  const mapped = serviceIds
    .map((id) => (isUuid(id) ? id : LEGACY_ADDON_UUID_MAP[id] || null))
    .filter((id): id is string => Boolean(id) && isUuid(id));

  return Array.from(new Set(mapped));
};

/**
 * Ensures packageId and serviceIds match ISN requirements:
 * 1. packageId must be a valid UUID or omitted.
 * 2. All serviceIds must be valid UUIDs.
 * 3. For NEW_CONSTRUCTION, ensures the primary ISN service is included in serviceIds.
 */
export const sanitizePackageAndServices = (
  category: "RESALE_HOME" | "NEW_CONSTRUCTION",
  packageId?: string | null,
  serviceIds?: string[] | null,
  availablePackages?: any[]
): { packageId?: string; serviceIds: string[] } => {
  let cleanServiceIds = sanitizeServiceIds(serviceIds);
  let cleanPkgId = isUuid(packageId)
    ? packageId!
    : packageId && LEGACY_PACKAGE_UUID_MAP[packageId]
    ? LEGACY_PACKAGE_UUID_MAP[packageId]
    : undefined;

  if (category === "NEW_CONSTRUCTION") {
    const primaryServiceId =
      (cleanPkgId && NEW_CONSTRUCTION_SERVICES[cleanPkgId]) ||
      (packageId && NEW_CONSTRUCTION_SERVICES[packageId]) ||
      "c32cb328-765a-4239-a936-b35d2c04a1c5";

    if (!cleanServiceIds.includes(primaryServiceId)) {
      cleanServiceIds = [primaryServiceId, ...cleanServiceIds];
    }

    const isLiveIsnPkg = availablePackages?.some(
      (p) => p.id === cleanPkgId && p.source === "ISN" && p.serviceIds?.length > 0
    );

    return {
      packageId: isLiveIsnPkg ? cleanPkgId : undefined,
      serviceIds: cleanServiceIds,
    };
  }

  // Resale home
  if (!cleanPkgId) {
    cleanPkgId = "e2ff6ec2-72b3-4e31-b06b-680c17aec45b";
  }

  return {
    packageId: cleanPkgId,
    serviceIds: cleanServiceIds,
  };
};

/**
 * Extracts a valid 2-letter uppercase US state code from strings like "Georgia (GA)" or "ga".
 */
export const mapStateToAbbreviation = (stateRaw?: string): string => {
  if (!stateRaw) return "GA";
  const trimmed = stateRaw.trim().toUpperCase();
  if (VALID_STATE_CODES.has(trimmed)) return trimmed;

  const match = stateRaw.match(/\(([A-Za-z]{2})\)/);
  if (match && VALID_STATE_CODES.has(match[1].toUpperCase())) {
    return match[1].toUpperCase();
  }

  for (const code of VALID_STATE_CODES) {
    if (new RegExp(`\\b${code}\\b`, "i").test(stateRaw)) {
      return code;
    }
  }

  return "GA";
};

/**
 * Safely parses integer from user inputs like "2,200 sq ft" or "1998".
 */
export const parseCleanNumber = (val: any, fallback: number): number => {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (!val) return fallback;
  const cleaned = String(val).replace(/[^0-9]/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) || num <= 0 ? fallback : num;
};

/**
 * Normalizes sewage system string to OpenAPI enum.
 */
export const mapSewageSystem = (val?: string): "PUBLIC" | "SEPTIC" | "ATU" | "SHARED_SEPTIC" => {
  const lower = (val || "").toLowerCase();
  if (lower.includes("aerobic") || lower.includes("atu")) return "ATU";
  if (lower.includes("shared")) return "SHARED_SEPTIC";
  if (lower.includes("septic")) return "SEPTIC";
  return "PUBLIC";
};

/**
 * Normalizes water system string to OpenAPI enum.
 */
export const mapWaterSystem = (val?: string): "PUBLIC" | "WELL" | "SHARED_WELL" | "CISTERN" => {
  const lower = (val || "").toLowerCase();
  if (lower.includes("cistern")) return "CISTERN";
  if (lower.includes("shared")) return "SHARED_WELL";
  if (lower.includes("well")) return "WELL";
  return "PUBLIC";
};

/**
 * Converts form data to strict PropertyDto required by backend quote & order endpoints.
 */
export const buildPropertyDto = (
  formData: StepperFormData,
  defaultFoundationId = "ec5c1636-7864-11e1-bfb4-b15dbfa5fbfd"
): PropertyDto => {
  const yearBuilt = Math.min(2200, Math.max(1600, parseCleanNumber(formData.yearBuilt, 2000)));
  const squareFeet = Math.min(1000000, Math.max(10, parseCleanNumber(formData.squareFeet, 2200)));

  const clientAttending = !formData.clientAttending?.toLowerCase().includes("unable");
  const occupied = !formData.homeOccupied?.toLowerCase().includes("vacant");
  const gatedCommunity = Boolean(formData.isGatedCommunity?.toLowerCase().includes("yes"));
  const alarmSystem = Boolean(formData.hasAlarmSystem?.toLowerCase().includes("yes"));
  const poolSpa = !formData.hasPoolSpa?.toLowerCase().includes("none") && Boolean(formData.hasPoolSpa);
  const utilitiesOn = !formData.utilitiesOn?.toLowerCase().includes("off");

  const foundation = isUuid(formData.foundationType)
    ? formData.foundationType!
    : defaultFoundationId;

  return {
    foundationType: foundation,
    address1: formData.addressLine1?.trim() || "123 Main Street",
    address2: formData.addressLine2?.trim() || undefined,
    city: formData.city?.trim() || "Atlanta",
    state: mapStateToAbbreviation(formData.state),
    zip: (formData.zipCode?.trim() || "30301").slice(0, 10),
    yearBuilt,
    squareFeet,
    clientAttending,
    occupied,
    gatedCommunity,
    alarmSystem,
    poolSpa,
    sewageSystem: mapSewageSystem(formData.sewageSystem),
    waterSystem: mapWaterSystem(formData.waterSystem),
    utilitiesOn,
    referral: formData.hearAboutUs?.trim() || "Google Search / Web",
    gateCode: formData.gateCode?.trim() || undefined,
    dueDiligence: formData.dueDiligence?.trim() || undefined,
    notes: formData.specialInstructions?.trim() || undefined,
  };
};

/**
 * Builds contact info from form.
 */
export const buildContactDto = (formData: StepperFormData): ContactDto => {
  const rawPhone = formData.phone?.trim();
  const phone = isValidPhone(rawPhone) ? rawPhone! : "404-555-0100";
  return {
    firstName: formData.firstName?.trim() || "Customer",
    lastName: formData.lastName?.trim() || "Name",
    email: formData.email?.trim() || "info@example.com",
    phone,
  };
};

/**
 * Builds buyer contact info for buyer's agent.
 */
export const buildBuyerContactDto = (formData: StepperFormData): ContactDto | undefined => {
  if (formData.customerRole !== "buyers-agent") return undefined;
  if (!formData.buyerFirstName && !formData.buyerEmail) return undefined;
  const rawPhone = formData.buyerPhone?.trim();
  const phone = isValidPhone(rawPhone) ? rawPhone! : "404-555-0101";
  return {
    firstName: formData.buyerFirstName?.trim() || "Buyer",
    lastName: formData.buyerLastName?.trim() || "Client",
    email: formData.buyerEmail?.trim() || "buyer@example.com",
    phone,
  };
};

/**
 * Converts 12h time format like "8:00 AM" or "1:00 PM" into 24h format "08:00" or "13:00".
 */
export const formatTimeSlotTo24h = (timeSlot?: string): string => {
  if (!timeSlot) return "09:00";
  if (/^(?:[01]\d|2[0-3]):(?:00|15|30|45)$/.test(timeSlot.trim())) {
    return timeSlot.trim();
  }

  const match = timeSlot.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return "09:00";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = (match[3] || "").toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

/**
 * Converts 24h time format "08:00" to "8:00 AM".
 */
export const format24hToDisplayTime = (time24?: string): string => {
  if (!time24) return "9:00 AM";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${mStr || "00"} ${ampm}`;
};

/**
 * Browser LocalStorage persistence helpers with automatic sanitization of legacy non-UUID items.
 */
export const loadBookingFromStorage = (): Partial<StepperFormData> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return null;
    const parsed: Partial<StepperFormData> = JSON.parse(raw);

    // Sanitize any legacy slugs in selectedAddons
    if (Array.isArray(parsed.selectedAddons)) {
      parsed.selectedAddons = sanitizeServiceIds(parsed.selectedAddons);
    }

    // Sanitize any legacy slug in selectedPackage
    if (parsed.selectedPackage && !isUuid(parsed.selectedPackage)) {
      parsed.selectedPackage =
        LEGACY_PACKAGE_UUID_MAP[parsed.selectedPackage] || "e2ff6ec2-72b3-4e31-b06b-680c17aec45b";
    }

    return parsed;
  } catch (err) {
    console.error("Failed to load booking from storage:", err);
    return null;
  }
};

export const saveBookingToStorage = (data: StepperFormData): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save booking to storage:", err);
  }
};

export const clearBookingFromStorage = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(BOOKING_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear booking storage:", err);
  }
};
