export interface PackageOption {
  id: string;
  title: string;
  isRecommended?: boolean;
  priceText: string;
  priceNumeric: number;
  priceSubLabel?: string;
  description: string;
  image?: string;
  whyItMatters?: string;
  features?: string[];
}

export interface AddonOption {
  id: string;
  title: string;
  priceText: string;
  priceNumeric: number;
  image?: string;
  whyItMatters?: string;
  repairRisk?: string;
}

export interface IncludedItem {
  name: string;
  priceText: string;
  priceNumeric?: number;
}
