export type PackageStatus = "Published" | "Draft";
export type PackageCategory =
  | "Resale Home"
  | "New Construction"
  | "Commercial"
  | "Add-on";
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
  videoUrl?: string;
  isRecommended?: boolean;
  whyItMatters?: string;
  featuresIncluded?: string[];
  priceCents?: number;
}

export interface AddonItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface ApiPackageMedia {
  id: string;
  objectKey?: string;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
  checksum?: string;
  url: string;
  altText?: string;
  status?: string;
  createdBy?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiPackage {
  id: string;
  name: string;
  active?: boolean;
  visible?: boolean;
  serviceIds?: string[];
  description?: string;
  best?: boolean;
  sequence?: number;
  modifierIds?: string[];
  source?: string;
  category: "RESALE_HOME" | "NEW_CONSTRUCTION" | string;
  type: "BUNDLE" | "SINGLE" | string;
  priceCents: number;
  whyItMatters?: string;
  features?: string[];
  media?: ApiPackageMedia[];
  mediaIds?: string[];
  mediaUrl?: string;
  mediaId?: string;
  status?: "DRAFT" | "PUBLISHED" | string;
  recommended?: boolean;
  localCatalogId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type AdminPackagesResponse = ApiEnvelope<
  ApiPackage[] | { items: ApiPackage[]; total?: number; page?: number; limit?: number }
>;

export type AdminPackageDetailResponse = ApiEnvelope<ApiPackage>;

export function mapApiPackageToPackageItem(apiPkg: ApiPackage): PackageItem {
  const categoryUpper = (apiPkg.category || "").toUpperCase();
  const category: PackageCategory =
    categoryUpper === "NEW_CONSTRUCTION" || categoryUpper === "NEW CONSTRUCTION"
      ? "New Construction"
      : "Resale Home";

  const typeUpper = (apiPkg.type || "").toUpperCase();
  const type: PackageType = typeUpper === "SINGLE" ? "Single" : "Bundle";

  const statusUpper = (apiPkg.status || "").toUpperCase();
  const status: PackageStatus = statusUpper === "DRAFT" ? "Draft" : "Published";

  const priceCents = typeof apiPkg.priceCents === "number" ? apiPkg.priceCents : 0;
  const dollars = priceCents / 100;
  const formattedPrice = `$${dollars.toLocaleString(undefined, {
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

  const primaryMedia = apiPkg.media?.[0];
  const rawMediaUrl = apiPkg.mediaUrl || primaryMedia?.url;
  const isVideo =
    primaryMedia?.mimeType?.startsWith("video/") ||
    (rawMediaUrl ? /\.mp4($|\?)/i.test(rawMediaUrl) : false);

  const imageUrl = isVideo
    ? "/assets/images/safe_home_package.jpg"
    : rawMediaUrl || "/assets/images/safe_home_package.jpg";

  const videoUrl = isVideo ? rawMediaUrl : undefined;

  return {
    id: apiPkg.id,
    name: apiPkg.name || "Untitled Package",
    category,
    type,
    price: formattedPrice,
    status,
    updated: apiPkg.updatedAt
      ? new Date(apiPkg.updatedAt).toLocaleDateString()
      : "Recently",
    shortDescription: apiPkg.description || "",
    image: imageUrl,
    videoUrl,
    isRecommended: Boolean(apiPkg.recommended ?? apiPkg.best),
    whyItMatters: apiPkg.whyItMatters || "",
    featuresIncluded: Array.isArray(apiPkg.features) ? apiPkg.features : [],
    priceCents,
  };
}
