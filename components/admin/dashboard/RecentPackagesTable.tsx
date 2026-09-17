"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  category: string;
  type: string;
  price: string;
  status: "Published" | "Draft";
  updated: string;
}

const packages: PackageItem[] = [
  {
    id: "1",
    name: "Safe Home Package",
    category: "Resale Home",
    type: "Bundle",
    price: "$425",
    status: "Published",
    updated: "2 hours ago",
  },
  {
    id: "2",
    name: "Residential Home Inspection",
    category: "Resale Home",
    type: "Single",
    price: "$350",
    status: "Published",
    updated: "30 minutes ago",
  },
  {
    id: "3",
    name: "Radon Testing Service",
    category: "Resale Home",
    type: "Bundle",
    price: "$275",
    status: "Published",
    updated: "1 day ago",
  },
  {
    id: "4",
    name: "EcoHome Energy",
    category: "Resale Home",
    type: "Single",
    price: "$500",
    status: "Draft",
    updated: "3 days ago",
  },
  {
    id: "5",
    name: "SafeGuard Electrical",
    category: "New Construction",
    type: "Bundle",
    price: "$400",
    status: "Draft",
    updated: "45 minutes ago",
  },
  {
    id: "6",
    name: "ClearView Roofing",
    category: "Resale Home",
    type: "Single",
    price: "$375",
    status: "Published",
    updated: "2 hours ago",
  },
  {
    id: "7",
    name: "UrbanAir HVAC",
    category: "New Construction",
    type: "Bundle",
    price: "$320",
    status: "Published",
    updated: "4 hours ago",
  },
];

export function RecentPackagesTable() {
  return (
    <div className="space-y-3 sm:space-y-4 pt-2">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-main">Recent Package</h2>
        <Link
          href="/admin/packages"
          className="flex items-center space-x-1 text-xs font-semibold text-sub hover:text-primary transition-colors"
        >
          <span>View all</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-hairline overflow-hidden shadow-xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm text-main whitespace-nowrap">
            <thead className="bg-canvas border-b border-hairline text-xs font-bold text-sub uppercase">
              <tr>
                <th scope="col" className="py-3 sm:py-3.5 px-4 sm:px-6">
                  Package Name
                </th>
                <th scope="col" className="py-3 sm:py-3.5 px-4 sm:px-6">
                  Category
                </th>
                <th scope="col" className="py-3 sm:py-3.5 px-4 sm:px-6">
                  Type
                </th>
                <th scope="col" className="py-3 sm:py-3.5 px-4 sm:px-6">
                  Price
                </th>
                <th scope="col" className="py-3 sm:py-3.5 px-4 sm:px-6">
                  Status
                </th>
                <th scope="col" className="py-3 sm:py-3.5 px-4 sm:px-6">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline font-medium">
              {packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="hover:bg-canvas/60 transition-colors"
                >
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-semibold text-main">
                    {pkg.name}
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-sub">
                    {pkg.category}
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-sub">
                    {pkg.type}
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-semibold text-main">
                    {pkg.price}
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                    <span
                      className={`inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${
                        pkg.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-xs text-sub">
                    {pkg.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
