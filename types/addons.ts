import type { ApiEnvelope } from "@/types/packages";

export interface ApiAddonMedia {
  id: number | string;
  objectKey?: string;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
  checksum?: string;
  url: string;
  altText?: string;
  status?: string;
  createdBy?: number | string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiAddonItem {
  id: number | string;
  name: string;
  description?: string;
  category?: "RESALE_HOME" | "NEW_CONSTRUCTION" | string;
  kind?: "ADDON" | string;
  priceCents?: number;
  price?: number;
  formattedPrice?: string;
  recommended?: boolean;
  whyItMatters?: string;
  features?: string[];
  media?: ApiAddonMedia[];
  mediaIds?: (number | string)[];
  mediaUrl?: string | null;
  mediaId?: number | string | null;
  mediaType?: string;
  isVideo?: boolean;
  videoUrl?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  isnServiceId?: string | null;
  isnServiceIds?: string[];
  services?: Array<{
    id: string;
    name: string;
    priceCents?: number;
    ancillary?: boolean;
  }>;
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED" | string;
  localCatalogId?: number | string;
}

export interface AdminAddonsResponseData {
  items: ApiAddonItem[];
  total: number;
  page: number;
  limit: number;
}

export type AdminAddonsResponse = ApiEnvelope<AdminAddonsResponseData>;

export interface GetAddonsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: "RESALE_HOME" | "NEW_CONSTRUCTION";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export function formatAddonPrice(addon: ApiAddonItem): string {
  if (addon.formattedPrice) return addon.formattedPrice;
  if (typeof addon.price === "number") return `$${addon.price}`;
  if (typeof addon.priceCents === "number") {
    const dollars = addon.priceCents / 100;
    return `$${dollars.toLocaleString(undefined, {
      minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return "$0";
}

export function getAddonImage(addon: ApiAddonItem): string {
  if (addon.image) return addon.image;
  if (addon.imageUrl) return addon.imageUrl;
  if (addon.mediaUrl) return addon.mediaUrl;
  if (addon.media && addon.media.length > 0 && addon.media[0].url) {
    return addon.media[0].url;
  }
  return "/assets/images/pool_inspection.jpg";
}
