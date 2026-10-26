"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ColumnDef } from "@/types/table";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { RecentPackagesTableSkeleton } from "@/components/admin/dashboard/DashboardSkeleton";
import { useGetAdminDashboardQuery } from "@/redux/features/dashboard/dashboardApi";
import type {
  DashboardRecentPackage,
  DashboardPagination,
} from "@/types/dashboard";

export interface RecentPackagesTableProps {
  packages?: DashboardRecentPackage[];
  pagination?: DashboardPagination;
  isLoading?: boolean;
  isFetching?: boolean;
  page?: number;
  limit?: number;
  onPageChange?: (newPage: number) => void;
}

export function RecentPackagesTable({
  packages: propPackages,
  pagination: propPagination,
  isLoading: propIsLoading,
  isFetching: propIsFetching,
  page: propPage,
  limit: propLimit = 5,
  onPageChange: propOnPageChange,
}: RecentPackagesTableProps = {}) {
  const router = useRouter();
  const [internalPage, setInternalPage] = useState(1);

  const currentPage = propPage ?? internalPage;
  const handlePageChange = (newPage: number) => {
    if (propOnPageChange) {
      propOnPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  // If data is not supplied via props, fetch directly from RTK Query
  const shouldFetch = propPackages === undefined && propIsLoading === undefined;
  const {
    data: dashboardResponse,
    isLoading: queryLoading,
    isFetching: queryFetching,
  } = useGetAdminDashboardQuery(
    { page: currentPage, limit: propLimit },
    { skip: !shouldFetch },
  );

  const isLoading = propIsLoading ?? (shouldFetch ? queryLoading : false);
  const isFetching = propIsFetching ?? (shouldFetch ? queryFetching : false);

  if (isLoading) {
    return <RecentPackagesTableSkeleton />;
  }

  const apiData = dashboardResponse?.data;
  const packages: DashboardRecentPackage[] =
    propPackages ?? apiData?.recentPackages ?? [];

  const paginationData: DashboardPagination =
    propPagination ??
    apiData?.pagination ?? {
      total: packages.length,
      page: currentPage,
      limit: propLimit,
      totalPages: Math.max(1, Math.ceil(packages.length / propLimit)),
      hasNextPage: false,
      hasPrevPage: false,
    };

  const total = paginationData.total ?? packages.length;
  const totalPages =
    paginationData.totalPages || Math.max(1, Math.ceil(total / propLimit));
  const hasNextPage =
    paginationData.hasNextPage ?? currentPage < totalPages;
  const hasPrevPage =
    paginationData.hasPrevPage ?? currentPage > 1;

  // Define columns for DataTable
  const columns: ColumnDef<DashboardRecentPackage>[] = [
    {
      key: "name",
      header: "Package Name",
      render: (item) => (
        <Link
          href={`/admin/packages?view=details&id=${item.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-normal text-lg text-main hover:text-primary transition-colors underline-offset-2 hover:underline"
        >
          {item.name || "Untitled Package"}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <span className="text-main">{item.category}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (item) => <span className="text-main">{item.type}</span>,
    },
    {
      key: "price",
      header: "Price",
      render: (item) => {
        let displayPrice = item.price;
        if (!displayPrice && typeof item.priceCents === "number") {
          const dollars = item.priceCents / 100;
          displayPrice = `$${dollars.toLocaleString(undefined, {
            minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
          })}`;
        }
        return (
          <span className="font-normal text-main">
            {displayPrice || "$0"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item) => {
        const statusLower = (item.status || "").toLowerCase();
        const isPublished = statusLower === "published";
        const statusLabel =
          item.status || (isPublished ? "Published" : "Draft");

        return (
          <span
            className={`inline-flex items-center px-3 py-1.5 sm:py-2 rounded-md capitalize text-sm sm:text-base font-semibold ${
              isPublished
                ? "bg-[#24B33C1F] text-[#24B33C]"
                : "bg-[#FFFAE7] text-[#BB960B]"
            }`}
          >
            {statusLabel}
          </span>
        );
      },
    },
    {
      key: "updated",
      header: "Updated",
      render: (item) => (
        <span className="text-main">
          {item.updated ||
            (item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString()
              : "Recently")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 pt-2">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl md:text-2xl text-main">
          Recent Package
        </h2>
        <Link
          href="/admin/packages"
          className="flex items-center space-x-1 px-3 py-2 md:py-3 rounded-lg border border-hairline bg-canvas hover:bg-white text-base font-semibold text-muted hover:text-main transition-all shadow-2xs"
        >
          <span>View all</span>
          <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Reusable DataTable & Pagination */}
      <div
        className={`space-y-0 overflow-hidden transition-opacity duration-200 ${
          isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        <DataTable<DashboardRecentPackage>
          columns={columns}
          data={packages}
          keyExtractor={(item) => item.id}
          bordered={true}
          emptyMessage="No recent packages found."
          onRowClick={(item) => {
            router.push(`/admin/packages?view=details&id=${item.id}`);
          }}
        />

        <Pagination
          total={total}
          page={currentPage}
          limit={propLimit}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={handlePageChange}
          onNextPage={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          onPrevPage={() => handlePageChange(Math.max(currentPage - 1, 1))}
        />
      </div>
    </div>
  );
}

export default RecentPackagesTable;
