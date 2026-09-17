"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus, Eye } from "lucide-react";
import { PackageItem, AddonItem, PackageCategory } from "@/types/packages";
import { initialPackages, initialAddons } from "@/data/packagesData";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { PackageCard } from "@/components/admin/packages/PackageCard";
import { AddonCard } from "@/components/admin/packages/AddonCard";
import { PackageDetailsView } from "@/components/admin/packages/PackageDetailsView";
import { CreatePackageWizard } from "@/components/admin/packages/CreatePackageWizard";

function PackageManagementContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State Management
  const currentTab = searchParams.get("tab") === "addons" ? "addons" : "packages";
  const currentCategory =
    searchParams.get("category") === "new-construction"
      ? "New Construction"
      : "Resale Home";
  const currentView = searchParams.get("view") || "list"; // 'list' | 'details' | 'create'
  const selectedId = searchParams.get("id");

  // Local Data State
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to update URL search params
  const updateQueryParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Selected package for details view
  const selectedPackage = packages.find((p) => p.id === selectedId) || packages[0];

  // Filtered lists based on search and category
  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory = pkg.category === currentCategory;
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredAddons = addons.filter((addon) =>
    addon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If viewing details page
  if (currentView === "details" && selectedPackage) {
    return (
      <PackageDetailsView
        packageItem={selectedPackage}
        onBack={() => updateQueryParams({ view: "list", id: null })}
        onEdit={() => updateQueryParams({ view: "create" })}
      />
    );
  }

  // If viewing create/edit wizard page
  if (currentView === "create") {
    return (
      <CreatePackageWizard
        onBack={() => updateQueryParams({ view: "list" })}
        onSave={(data) => {
          const newPkg: PackageItem = {
            id: String(Date.now()),
            ...data,
            updated: "Just now",
            image: "/assets/images/safe_home_package.jpg",
          };
          setPackages((prev) => [newPkg, ...prev]);
          updateQueryParams({ view: "list" });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls: Title, Search, Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="font-trade font-bold text-2xl sm:text-3xl text-main tracking-tight">
          Package Management
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2.5 sm:space-y-0 sm:space-x-3">
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder={
              currentTab === "packages"
                ? "Search packages..."
                : "Search add-ons..."
            }
            className="w-full sm:w-64"
          />

          <Button
            variant="primary"
            onClick={() => updateQueryParams({ view: "create" })}
            className="flex items-center justify-center space-x-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>
              {currentTab === "packages" ? "New package" : "New Add On"}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => alert("Reviewing draft packages.")}
            className="flex items-center justify-center space-x-1.5 whitespace-nowrap bg-canvas border-hairline text-sub hover:text-main"
          >
            <Eye className="w-4 h-4" />
            <span>Review 1 draft</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs Header: Packages (count) vs Add-ons (count) */}
      <div className="border-b border-hairline">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => updateQueryParams({ tab: "packages" })}
            className={`pb-3 font-trade font-bold text-base sm:text-lg transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
              currentTab === "packages"
                ? "border-primary text-primary"
                : "border-transparent text-sub hover:text-main"
            }`}
          >
            <span>Packages</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                currentTab === "packages"
                  ? "bg-primary-subtle text-primary"
                  : "bg-canvas text-sub"
              }`}
            >
              {packages.length}
            </span>
          </button>

          <button
            onClick={() => updateQueryParams({ tab: "addons" })}
            className={`pb-3 font-trade font-bold text-base sm:text-lg transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
              currentTab === "addons"
                ? "border-primary text-primary"
                : "border-transparent text-sub hover:text-main"
            }`}
          >
            <span>Add-ons</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                currentTab === "addons"
                  ? "bg-primary-subtle text-primary"
                  : "bg-canvas text-sub"
              }`}
            >
              {addons.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: PACKAGES */}
      {currentTab === "packages" && (
        <div className="space-y-6">
          {/* Sub Tabs: Resale Home vs New Construction */}
          <div className="flex items-center bg-canvas border border-hairline p-1 rounded-xl w-fit">
            <button
              onClick={() =>
                updateQueryParams({ category: "resale" })
              }
              className={`px-5 py-2 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
                currentCategory === "Resale Home"
                  ? "bg-main text-white shadow-xs"
                  : "text-sub hover:text-main"
              }`}
            >
              Resale Home
            </button>

            <button
              onClick={() =>
                updateQueryParams({ category: "new-construction" })
              }
              className={`px-5 py-2 rounded-lg font-trade font-bold text-sm transition-all cursor-pointer ${
                currentCategory === "New Construction"
                  ? "bg-main text-white shadow-xs"
                  : "text-sub hover:text-main"
              }`}
            >
              New Construction
            </button>
          </div>

          {/* Package Cards Grid */}
          {filteredPackages.length === 0 ? (
            <div className="bg-canvas border border-hairline rounded-2xl p-12 text-center text-sub">
              No packages found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  item={pkg}
                  onSelect={(item) =>
                    updateQueryParams({ view: "details", id: item.id })
                  }
                  onEdit={(item) =>
                    updateQueryParams({ view: "create", id: item.id })
                  }
                  onDelete={(item) => {
                    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                      setPackages((prev) => prev.filter((p) => p.id !== item.id));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ADD-ONS */}
      {currentTab === "addons" && (
        <div>
          {filteredAddons.length === 0 ? (
            <div className="bg-canvas border border-hairline rounded-2xl p-12 text-center text-sub">
              No add-ons found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAddons.map((addon) => (
                <AddonCard key={addon.id} item={addon} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PackageManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-main font-bold">Loading...</div>
      }
    >
      <PackageManagementContent />
    </Suspense>
  );
}
