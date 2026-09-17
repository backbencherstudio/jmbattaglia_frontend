export type PackageStatus = "Published" | "Draft";
export type PackageCategory = "Resale Home" | "New Construction" | "Commercial" | "Add-on";
export type PackageType = "Bundle" | "Single";

export interface PackageItem {
  id: string;
  name: string;
  category: PackageCategory;
  type: PackageType;
  price: string;
  status: PackageStatus;
  updated: string;
  shortDescription: string;
  image: string;
  isRecommended?: boolean;
  whyItMatters?: string;
  featuresIncluded?: string[];
}

export interface AddonItem {
  id: string;
  name: string;
  price: string;
  image: string;
}
