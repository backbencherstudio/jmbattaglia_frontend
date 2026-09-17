"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { PackageItem, AddonItem } from "@/types/packages";
import { initialPackages, initialAddons } from "@/data/packagesData";
import { useTabQuery } from "@/hooks/useTabQuery";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { UnderlineTabs } from "@/components/ui/UnderlineTabs";
import { PillTabs } from "@/components/ui/PillTabs";
import { PackageCard } from "@/components/admin/packages/PackageCard";
import { AddonCard } from "@/components/admin/packages/AddonCard";
import { PackageDetailsView } from "@/components/admin/packages/PackageDetailsView";
import { CreatePackageWizard } from "@/components/admin/packages/CreatePackageWizard";

export function PackageManagementContent() {
  const { getParam, updateQueryParams } = useTabQuery();

  // URL State Management using useTabQuery hook
  const currentTab = getParam("tab") === "addons" ? "addons" : "packages";
  const categoryKey = getParam("category") === "new-construction" ? "new-construction" : "resale";
  const currentCategory = categoryKey === "new-construction" ? "New Construction" : "Resale Home";
  const currentView = getParam("view", "list"); // 'list' | 'details' | 'create'
  const selectedId = getParam("id");

  // Local Data State
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Top Header Controls */}
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
            className="w-full sm:w-64 h-11"
          />

          <Button
            variant="primary"
            onClick={() => updateQueryParams({ view: "create" })}
            className="h-11 flex items-center justify-center space-x-1.5 whitespace-nowrap px-4 py-0"
          >
            <Plus className="w-4 h-4" />
            <span>
              {currentTab === "packages" ? "New package" : "New Add On"}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => alert("Reviewing draft packages.")}
            className="h-11 flex items-center justify-center space-x-1.5 whitespace-nowrap bg-canvas border-hairline text-sub hover:text-main px-4 py-0"
          >
            <Eye className="w-4 h-4" />
            <span>Review 1 draft</span>
          </Button>
        </div>
      </div>

      {/* Main Underline Tabs Header */}
      <UnderlineTabs
        tabs={[
          { id: "packages", label: "Packages", count: packages.length },
          { id: "addons", label: "Add-ons", count: addons.length },
        ]}
        activeTab={currentTab}
        onChange={(tabId) => updateQueryParams({ tab: tabId })}
      />

      {/* TAB 1: PACKAGES */}
      {currentTab === "packages" && (
        <div className="space-y-6">
          {/* Sub Pill Tabs */}
          <PillTabs
            items={[
              { id: "resale", label: "Resale Home" },
              { id: "new-construction", label: "New Construction" },
            ]}
            activeId={categoryKey}
            onChange={(catId) => updateQueryParams({ category: catId })}
          />

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
