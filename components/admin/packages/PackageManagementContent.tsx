"use client";

import { useState } from "react";
import { Plus, Eye, Check, AlertCircle, X, RefreshCw } from "lucide-react";
import {
  PackageItem,
  AddonItem,
  ApiPackage,
  mapApiPackageToPackageItem,
} from "@/types/packages";
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
import { CreateAddonModal } from "@/components/admin/packages/CreateAddonModal";
import { EditAddonModal } from "@/components/admin/packages/EditAddonModal";
import { DeleteAddonModal } from "@/components/admin/packages/DeleteAddonModal";
import {
  PackageCardSkeleton,
  AddonCardSkeleton,
} from "@/components/admin/packages/PackageManagementSkeleton";
import { PackageVideoModal } from "@/components/stepper/steps/package-addons/PackageVideoModal";
import { PackageOption } from "@/types/packageAddons";
import {
  useGetAdminPackagesQuery,
} from "@/redux/features/packages/packageApi";
import {
  useGetAdminAddonsQuery,
  useDeleteAdminAddonMutation,
} from "@/redux/features/packages/addonApi";
import type { ApiAddonItem } from "@/types/addons";
import { useAppDispatch } from "@/redux/store";
import { initNewDraft } from "@/redux/features/packages/packageDraftSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";

export function PackageManagementContent() {
  const dispatch = useAppDispatch();
  const { getParam, updateQueryParams } = useTabQuery();

  // Search State with Debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Pagination State (Directly driven by URL)
  const page = parseInt(getParam("page", "1"), 10) || 1;
  const setPage = (newPage: number) => {
    updateQueryParams({ page: newPage > 1 ? String(newPage) : null });
  };
  const pageSize = 9;

  // URL State Management using useTabQuery hook
  const currentTab = getParam("tab") === "addons" ? "addons" : "packages";
  const categoryKey =
    getParam("category") === "new-construction" ? "new-construction" : "resale";
  const currentCategory =
    categoryKey === "new-construction" ? "New Construction" : "Resale Home";
  const currentView = getParam("view", "list"); // 'list' | 'details' | 'create'
  const selectedId = getParam("id");

  // Local UI State
  const [showOnlyDrafts, setShowOnlyDrafts] = useState(false);
  const [isCreateAddonModalOpen, setIsCreateAddonModalOpen] = useState(false);
  const [videoModalPackage, setVideoModalPackage] =
    useState<PackageItem | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // API Queries & Mutations with debounced search & pagination
  const {
    data: packagesResponse,
    isLoading: isLoadingPackages,
    isFetching: isFetchingPackages,
    refetch: refetchPackages,
  } = useGetAdminPackagesQuery(
    {
      page,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const addonCategoryApi =
    categoryKey === "new-construction" ? "NEW_CONSTRUCTION" : "RESALE_HOME";

  const {
    data: addonsResponse,
    isLoading: isLoadingAddons,
    isFetching: isFetchingAddons,
    refetch: refetchAddons,
  } = useGetAdminAddonsQuery(
    {
      page,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      category: addonCategoryApi,
      status: showOnlyDrafts ? "DRAFT" : undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Compute live packages from API or fallback
  const pkgData = packagesResponse?.data;
  const apiPackagesList: ApiPackage[] = Array.isArray(pkgData)
    ? pkgData
    : pkgData && typeof pkgData === "object" && "items" in pkgData && Array.isArray(pkgData.items)
    ? (pkgData.items as ApiPackage[])
    : [];

  const totalPackagesCount: number =
    pkgData && !Array.isArray(pkgData) && typeof pkgData === "object" && "total" in pkgData && typeof pkgData.total === "number"
      ? pkgData.total
      : apiPackagesList.length;

  const packages: PackageItem[] =
    packagesResponse && Array.isArray(apiPackagesList)
      ? apiPackagesList.map(mapApiPackageToPackageItem)
      : initialPackages;

  // Compute live add-ons from API or fallback
  const apiAddonsList: ApiAddonItem[] = addonsResponse?.data?.items || [];
  const totalAddonsCount: number =
    typeof addonsResponse?.data?.total === "number"
      ? addonsResponse.data.total
      : apiAddonsList.length;

  const addons: ApiAddonItem[] =
    addonsResponse && Array.isArray(apiAddonsList)
      ? apiAddonsList
      : (initialAddons as unknown as ApiAddonItem[]);

  // Helper to map PackageItem to PackageOption for PackageVideoModal
  const toPackageOption = (item: PackageItem): PackageOption => ({
    id: item.id,
    title: item.name,
    priceText: item.price,
    priceNumeric:
      item.priceCents
        ? Math.round(item.priceCents / 100)
        : parseInt(item.price.replace(/[^0-9]/g, ""), 10) || 0,
    priceSubLabel: `${item.type} Package`,
    description: item.shortDescription,
    image: item.image,
    videoUrl: item.videoUrl || "https://www.youtube.com/watch?v=x5B2XZ7PIGQ",
    whyItMatters: item.whyItMatters,
    features: item.featuresIncluded,
    isRecommended: item.isRecommended,
  });

  // Selected package for details view
  const selectedPackage =
    packages.find((p) => p.id === selectedId) || packages[0];

  // Count draft packages & addons
  const packageDraftCount = packages.filter((p) => p.status === "Draft").length;
  const addonDraftCount = addons.filter(
    (a) => (a.status || "").toUpperCase() === "DRAFT",
  ).length;
  const currentDraftCount =
    currentTab === "packages" ? packageDraftCount : addonDraftCount;

  // Filtered lists based on search, category and draft filter
  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory = pkg.category === currentCategory;
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDraft = showOnlyDrafts ? pkg.status === "Draft" : true;
    return matchesCategory && matchesSearch && matchesDraft;
  });

  const filteredAddons = addons.filter((addon) => {
    const matchesSearch =
      addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (addon.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesDraft = showOnlyDrafts
      ? (addon.status || "").toUpperCase() === "DRAFT"
      : true;
    return matchesSearch && matchesDraft;
  });

  const handleDeletePackage = (item: PackageItem) => {
    setNotification({
      type: "success",
      message: `Package "${item.name}" was successfully deleted.`,
    });
    refetchPackages();
  };

  // Add-on Delete Modal State & Mutation
  const [addonToDelete, setAddonToDelete] = useState<ApiAddonItem | AddonItem | null>(null);
  const [deleteAddonError, setDeleteAddonError] = useState<string | null>(null);
  const [deleteAdminAddon, { isLoading: isDeletingAddon }] = useDeleteAdminAddonMutation();

  const handleOpenDeleteAddon = (item: ApiAddonItem | AddonItem) => {
    setDeleteAddonError(null);
    setAddonToDelete(item);
  };

  const handleConfirmDeleteAddon = async () => {
    if (!addonToDelete) return;
    try {
      setDeleteAddonError(null);
      await deleteAdminAddon(addonToDelete.id).unwrap();
      const deletedName = addonToDelete.name;
      setAddonToDelete(null);
      setNotification({
        type: "success",
        message: `Add-on "${deletedName}" was successfully deleted.`,
      });
      refetchAddons();
    } catch (err) {
      setDeleteAddonError(getErrorMessage(err, "Failed to delete add-on."));
    }
  };

  // Add-on Edit State & Handler
  const [editingAddon, setEditingAddon] = useState<ApiAddonItem | AddonItem | null>(null);
  const handleEditAddon = (item: ApiAddonItem | AddonItem) => {
    setEditingAddon(item);
  };

  // If viewing details page
  if (currentView === "details" && selectedId) {
    return (
      <>
        <PackageDetailsView
          packageId={selectedId}
          packageItem={selectedPackage}
          onBack={() => updateQueryParams({ view: "list", id: null })}
          onEdit={() =>
            updateQueryParams({ view: "create", id: selectedId, step: "basic" })
          }
          onOpenVideo={(item) => setVideoModalPackage(item)}
        />
        {videoModalPackage && (
          <PackageVideoModal
            pkg={toPackageOption(videoModalPackage)}
            onClose={() => setVideoModalPackage(null)}
          />
        )}
      </>
    );
  }

  // If viewing create/edit wizard page
  if (currentView === "create") {
    return (
      <CreatePackageWizard
        onBack={() =>
          updateQueryParams({ view: null, id: null, step: null, tab: "packages" })
        }
        onSuccess={() => {
          setNotification({
            type: "success",
            message: selectedId
              ? "Package updated successfully!"
              : "Package created successfully!",
          });
          updateQueryParams({
            view: null,
            id: null,
            step: null,
            tab: "packages",
          });
          refetchPackages();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl shadow-xs transition-all animate-in fade-in ${
            notification.type === "success"
              ? "bg-[#24B33C1F] border border-[#24B33C40] text-[#1E9432]"
              : "bg-danger-bg border border-danger/20 text-danger"
          }`}
        >
          <div className="flex items-center space-x-2 text-sm font-semibold">
            {notification.type === "success" ? (
              <Check className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="font-trade font-bold text-2xl sm:text-3xl text-main tracking-tight">
            Package Management
          </h2>
          {(isFetchingPackages || isFetchingAddons) && (
            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          )}
        </div>

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
            onClick={() => {
              if (currentTab === "packages") {
                dispatch(initNewDraft());
                updateQueryParams({
                  view: "create",
                  id: null,
                  step: "basic",
                  tab: "packages",
                });
              } else {
                setIsCreateAddonModalOpen(true);
              }
            }}
            className="h-11 flex items-center justify-center space-x-1.5 whitespace-nowrap px-4 py-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              {currentTab === "packages" ? "New package" : "New Add On"}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowOnlyDrafts(!showOnlyDrafts)}
            className={`h-11 flex items-center justify-center space-x-1.5 whitespace-nowrap px-4 py-0 transition-colors cursor-pointer ${
              showOnlyDrafts
                ? "bg-primary text-white border-primary"
                : "bg-canvas border-hairline text-sub hover:text-main"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>
              {showOnlyDrafts
                ? currentTab === "packages"
                  ? "Show all packages"
                  : "Show all add-ons"
                : `Review ${currentDraftCount} draft${currentDraftCount === 1 ? "" : "s"}`}
            </span>
          </Button>
        </div>
      </div>

      {/* Main Underline Tabs Header */}
      <UnderlineTabs
        tabs={[
          { id: "packages", label: "Packages", count: totalPackagesCount },
          { id: "addons", label: "Add-ons", count: totalAddonsCount },
        ]}
        activeTab={currentTab}
        onChange={(tabId) => updateQueryParams({ tab: tabId, page: null })}
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
            onChange={(catId) => updateQueryParams({ category: catId, page: null })}
          />

          {/* Loading Indicator */}
          {isLoadingPackages && packages.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, idx) => (
                <PackageCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="bg-canvas border border-hairline rounded-2xl p-12 text-center text-sub space-y-3">
              <p>No packages found matching your criteria.</p>
              {showOnlyDrafts && (
                <Button
                  variant="outline"
                  onClick={() => setShowOnlyDrafts(false)}
                  className="bg-white"
                >
                  Clear draft filter
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    item={pkg}
                    onSelect={(item) =>
                      updateQueryParams({ view: "details", id: item.id })
                    }
                    onEdit={(item) =>
                      updateQueryParams({
                        view: "create",
                        id: item.id,
                        step: "basic",
                      })
                    }
                    onDelete={handleDeletePackage}
                    onOpenVideo={(item) => setVideoModalPackage(item)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="rounded-2xl overflow-hidden border border-hairline shadow-xs mt-6">
                <Pagination
                  total={totalPackagesCount}
                  page={page}
                  limit={pageSize}
                  hasNextPage={page < Math.ceil(totalPackagesCount / pageSize)}
                  hasPrevPage={page > 1}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    updateQueryParams({ page: String(newPage) });
                  }}
                  onNextPage={() => {
                    if (page < Math.ceil(totalPackagesCount / pageSize)) {
                      const nextP = page + 1;
                      setPage(nextP);
                      updateQueryParams({ page: String(nextP) });
                    }
                  }}
                  onPrevPage={() => {
                    if (page > 1) {
                      const prevP = page - 1;
                      setPage(prevP);
                      updateQueryParams({ page: String(prevP) });
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: ADD-ONS */}
      {currentTab === "addons" && (
        <div className="space-y-6">
          {/* Sub Pill Tabs for Addons Category */}
          <PillTabs
            items={[
              { id: "resale", label: "Resale Home" },
              { id: "new-construction", label: "New Construction" },
            ]}
            activeId={categoryKey}
            onChange={(catId) => updateQueryParams({ category: catId, page: null })}
          />

          {/* Loading Indicator */}
          {isLoadingAddons && addons.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {Array.from({ length: 8 }).map((_, idx) => (
                <AddonCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredAddons.length === 0 ? (
            <div className="bg-canvas border border-hairline rounded-2xl p-12 text-center text-sub space-y-3">
              <p>No add-ons found matching your criteria.</p>
              {showOnlyDrafts && (
                <Button
                  variant="outline"
                  onClick={() => setShowOnlyDrafts(false)}
                  className="bg-white"
                >
                  Clear draft filter
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAddons.map((addon) => (
                  <AddonCard
                    key={addon.id}
                    item={addon}
                    onEdit={handleEditAddon}
                    onDelete={handleOpenDeleteAddon}
                  />
                ))}
              </div>

              {/* Pagination for Add-ons */}
              {totalAddonsCount > pageSize && (
                <div className="rounded-2xl overflow-hidden border border-hairline shadow-xs mt-6">
                  <Pagination
                    total={totalAddonsCount}
                    page={page}
                    limit={pageSize}
                    hasNextPage={page < Math.ceil(totalAddonsCount / pageSize)}
                    hasPrevPage={page > 1}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      updateQueryParams({ page: String(newPage) });
                    }}
                    onNextPage={() => {
                      if (page < Math.ceil(totalAddonsCount / pageSize)) {
                        const nextP = page + 1;
                        setPage(nextP);
                        updateQueryParams({ page: String(nextP) });
                      }
                    }}
                    onPrevPage={() => {
                      if (page > 1) {
                        const prevP = page - 1;
                        setPage(prevP);
                        updateQueryParams({ page: String(prevP) });
                      }
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Video Modal */}
      {videoModalPackage && (
        <PackageVideoModal
          pkg={toPackageOption(videoModalPackage)}
          onClose={() => setVideoModalPackage(null)}
        />
      )}

      {/* Create Add-on Modal */}
      <CreateAddonModal
        isOpen={isCreateAddonModalOpen}
        onClose={() => setIsCreateAddonModalOpen(false)}
        onSuccess={(newAddon) => {
          setNotification({
            type: "success",
            message: newAddon?.name
              ? `Add-on "${newAddon.name}" created successfully!`
              : "Add-on created successfully!",
          });
          refetchAddons();
        }}
      />

      {/* Edit Add-on Modal */}
      <EditAddonModal
        isOpen={Boolean(editingAddon)}
        addon={editingAddon}
        onClose={() => setEditingAddon(null)}
        onSuccess={(updatedAddon) => {
          setNotification({
            type: "success",
            message: updatedAddon?.name
              ? `Add-on "${updatedAddon.name}" updated successfully!`
              : "Add-on updated successfully!",
          });
          setEditingAddon(null);
          refetchAddons();
        }}
      />

      {/* Delete Add-on Modal */}
      <DeleteAddonModal
        isOpen={Boolean(addonToDelete)}
        addonItem={addonToDelete}
        isDeleting={isDeletingAddon}
        errorMessage={deleteAddonError}
        onClose={() => {
          if (!isDeletingAddon) {
            setAddonToDelete(null);
            setDeleteAddonError(null);
          }
        }}
        onConfirm={handleConfirmDeleteAddon}
      />
    </div>
  );
}
