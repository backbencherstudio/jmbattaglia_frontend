export type PackageStatus = "Published" | "Draft";

export interface PackageItem {
  id: string;
  name: string;
  category: string;
  type: string;
  price: string;
  status: PackageStatus;
  updated: string;
}
