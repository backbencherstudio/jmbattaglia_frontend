"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PackageItem } from "@/types/packages";
import { ColumnDef } from "@/types/table";
import { initialPackages } from "@/data/packagesData";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";

export function RecentPackagesTable() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const total = initialPackages.length;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Slice paginated items
  const paginatedData = initialPackages.slice(
    (page - 1) * limit,
    page * limit
  );

  // Define columns for DataTable
  const columns: ColumnDef<PackageItem>[] = [
    {
      key: "name",
      header: "Package Name",
      render: (item) => (
        <span className="font-normal text-lg text-main">{item.name}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <span className="text-sub">{item.category}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (item) => <span className="text-sub">{item.type}</span>,
    },
    {
      key: "price",
      header: "Price",
      render: (item) => (
        <span className="font-semibold text-main">{item.price}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-3 rounded-md capitalize text-base font-semibold ${item.status === "Published"
            ? "bg-[#24B33C1F] text-[#24B33C]"
            : "bg-[#FFFAE7] text-[#BB960B]"
            }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (item) => (
        <span className="text-muted">{item.updated}</span>
      ),
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 pt-2">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h2 className=" font-bold text-xl md:text-2xl text-main">
          Recent Package
        </h2>
        <Link
          href="/admin/packages"
          className="flex items-center space-x-1 px-3 py-2 md:py-3 rounded-lg border border-hairline bg-canvas hover:bg-white text-base font-semibold text-muted hover:text-main transition-all shadow-2xs"
        >
          <span>View all</span>
          <ArrowUpRight />
        </Link>
      </div>

      {/* Reusable DataTable & Pagination */}
      <div className="space-y-0 overflow-hidden">
        <DataTable<PackageItem>
          columns={columns}
          data={paginatedData}
          keyExtractor={(item) => item.id}
          bordered={true}
        />

        <Pagination
          total={total}
          page={page}
          limit={limit}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onPageChange={(newPage) => setPage(newPage)}
          onNextPage={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPrevPage={() => setPage((p) => Math.max(p - 1, 1))}
        />
      </div>
    </div>
  );
}
