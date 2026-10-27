import { PackageCategory, PackageType } from "./packages";

export type WizardStep = "basic" | "media" | "review";

export interface PackageFormData {
  type: PackageType;
  category: PackageCategory;
  name: string;
  shortDescription: string;
  price: string;
  serviceIds: string[];
  whyItMatters: string;
  featuresIncluded: string[];
  image: string;
  videoUrl?: string;
  file?: File | null;
  existingMediaUrl?: string;
  isRecommended: boolean;
  status: "Published" | "Draft";
}
