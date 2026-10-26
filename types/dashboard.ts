export interface DashboardSummary {
  totalPackages: number;
  livePackages: number;
  draftPackages: number;
  addOnServices: number;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: number | string;
  iconKey?: "packages" | "live" | "draft" | "addons" | string;
  color?: string;
  iconBgClass?: string;
  iconColorClass?: string;
}

export interface DashboardActions {
  newPackageUrl?: string;
  reviewDraftsUrl?: string;
  draftCount?: number;
  reviewDraftText?: string;
}

export interface DashboardRecentPackage {
  id: string;
  name: string;
  category: string;
  rawCategory?: string;
  type: string;
  rawType?: string;
  price: string;
  priceCents?: number;
  currency?: string;
  status: string;
  rawStatus?: string;
  updated: string;
  updatedAt?: string;
  createdAt?: string;
  isRecommended?: boolean;
  recommended?: boolean;
  description?: string;
  whyItMatters?: string;
  features?: string[];
  servicesCount?: number;
  isnPackageId?: string;
  mediaUrl?: string;
  imageUrl?: string;
}

export interface DashboardPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  showingStart?: number;
  showingEnd?: number;
  showingText?: string;
}

export interface DashboardData {
  summary?: DashboardSummary;
  cards?: DashboardCard[];
  actions?: DashboardActions;
  recentPackages: DashboardRecentPackage[];
  pagination: DashboardPagination;
  totalPackages?: number;
  livePackages?: number;
  draftPackages?: number;
  addOnServices?: number;
  recent?: unknown[];
}

export interface DashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardData;
}

export interface GetDashboardQueryParams {
  page?: number;
  limit?: number;
}
