"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  LayoutGrid,
  List,
  Archive,
  Trash2,
  Globe,
  ArrowUpDown,
  Copy,
} from "lucide-react";
import {
  PackageItem,
  AddonItem,
  ApiPackage,
  mapApiPackageToPackageItem,
} from "@/types/packages";
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
  useCreateAdminPackageMutation,
  useUpdateAdminPackageMutation,
  useDeleteAdminPackageMutation,
} from "@/redux/features/packages/packageApi";
import {
  useGetAdminAddonsQuery,
  useDeleteAdminAddonMutation,
} from "@/redux/features/packages/addonApi";
import { useGetAdminDashboardQuery } from "@/redux/features/dashboard/dashboardApi";
import type { ApiAddonItem } from "@/types/addons";
import { useAppDispatch } from "@/redux/store";
import { initNewDraft } from "@/redux/features/packages/packageDraftSlice";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { Pagination } from "@/components/ui/Pagination";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@/types/table";

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
  const rawStatus = getParam("status")?.toUpperCase();
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    rawStatus === "DRAFT" || rawStatus === "PUBLISHED" ? rawStatus : null
  );
  const [isCreateAddonModalOpen, setIsCreateAddonModalOpen] = useState(false);
  const [videoModalPackage, setVideoModalPackage] =
    useState<PackageItem | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sync status filter when URL status query changes
  useEffect(() => {
    const nextStatus = getParam("status")?.toUpperCase();
    setActiveStatusFilter(
      nextStatus === "DRAFT" || nextStatus === "PUBLISHED" ? nextStatus : null
    );
  }, [getParam]);

  const addonCategoryApi =
    categoryKey === "new-construction" ? "NEW_CONSTRUCTION" : "RESALE_HOME";

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
      category: addonCategoryApi,
      status: (activeStatusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED") || undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

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
      status: (activeStatusFilter as "DRAFT" | "PUBLISHED" | "ARCHIVED") || undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Compute live packages from API or empty list while loading
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
      : [];

  // Compute live add-ons from API or empty list while loading
  const apiAddonsList: ApiAddonItem[] = addonsResponse?.data?.items || [];
  const totalAddonsCount: number =
    typeof addonsResponse?.data?.total === "number"
      ? addonsResponse.data.total
      : apiAddonsList.length;

  const addons: ApiAddonItem[] =
    addonsResponse && Array.isArray(apiAddonsList)
      ? apiAddonsList
      : [];

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

  // Global metrics for real draft counts across all pages
  const { data: dashboardData } = useGetAdminDashboardQuery();

  const [layoutMode, setLayoutMode] = useState<"card" | "table">("card");
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"name" | "price" | "category" | "status" | "updated">("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // RTK Mutations for bulk & duplicate
  const [createAdminPackage] = useCreateAdminPackageMutation();
  const [updateAdminPackage] = useUpdateAdminPackageMutation();
  const [deleteAdminPackage] = useDeleteAdminPackageMutation();

  // Helper to toggle sort
  const handleSort = (field: "name" | "price" | "category" | "status" | "updated") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Count draft packages & addons (synchronize with global DB summary when available)
  const globalDrafts =
    dashboardData?.data?.summary?.draftPackages ??
    dashboardData?.data?.actions?.draftCount;
  const packageDraftCount =
    typeof globalDrafts === "number"
      ? globalDrafts
      : packages.filter((p) => p.status === "Draft").length;
  const addonDraftCount = addons.filter(
    (a) => (a.status || "").toUpperCase() === "DRAFT",
  ).length;
  const currentDraftCount =
    currentTab === "packages" ? packageDraftCount : addonDraftCount;

  // Filtered and Sorted packages
  const filteredAndSortedPackages = [...packages]
    .filter((pkg) => {
      const matchesCategory = pkg.category === currentCategory;
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        activeStatusFilter === "DRAFT"
          ? pkg.status.toLowerCase() === "draft"
          : activeStatusFilter === "PUBLISHED"
          ? pkg.status.toLowerCase() === "published"
          : true;
      return matchesCategory && matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comp = 0;
      if (sortField === "name") {
        comp = a.name.localeCompare(b.name);
      } else if (sortField === "price") {
        comp = (a.priceCents || 0) - (b.priceCents || 0);
      } else if (sortField === "category") {
        comp = a.category.localeCompare(b.category);
      } else if (sortField === "status") {
        comp = a.status.localeCompare(b.status);
      } else if (sortField === "updated") {
        const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        comp = timeA - timeB;
      }
      return sortOrder === "asc" ? comp : -comp;
    });

  const filteredPackages = filteredAndSortedPackages;

  const filteredAddons = addons.filter((addon) => {
    const matchesSearch =
      addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (addon.description || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const addonStatus = (addon.status || "").toLowerCase();
    const matchesStatus =
      activeStatusFilter === "DRAFT"
        ? addonStatus === "draft"
        : activeStatusFilter === "PUBLISHED"
        ? addonStatus === "published"
        : true;
    return matchesSearch && matchesStatus;
  });

  // Duplicate package action
  const handleDuplicatePackage = async (item: PackageItem) => {
    try {
      const fd = new FormData();
      fd.append("name", `Copy of ${item.name}`);
      fd.append("type", item.type === "Single" ? "SINGLE" : "BUNDLE");
      fd.append("category", item.category === "New Construction" ? "NEW_CONSTRUCTION" : "RESALE_HOME");
      fd.append("priceCents", String(item.priceCents || 0));
      fd.append("description", item.shortDescription || "");
      fd.append("whyItMatters", item.whyItMatters || "");
      fd.append("status", "DRAFT");
      fd.append("recommended", item.isRecommended ? "true" : "false");
      if (item.quoteRequired) {
        fd.append("quoteRequired", "true");
      }
      if (item.serviceIds && item.serviceIds.length > 0) {
        item.serviceIds.forEach((id) => {
          fd.append("services[]", id);
          fd.append("serviceIds[]", id);
        });
      }
      if (item.featuresIncluded && item.featuresIncluded.length > 0) {
        item.featuresIncluded.forEach((f) => {
          fd.append("features[]", f);
        });
      }

      await createAdminPackage(fd).unwrap();
      setNotification({
        type: "success",
        message: `Package "${item.name}" duplicated as "Copy of ${item.name}" (Draft).`,
      });
      refetchPackages();
    } catch (err) {
      setNotification({
        type: "error",
        message: getErrorMessage(err, "Failed to duplicate package."),
      });
    }
  };

  // Bulk actions
  const handleBulkPublish = async () => {
    if (selectedPackageIds.length === 0) return;
    try {
      let publishedCount = 0;
      let skippedZeroCount = 0;
      for (const id of selectedPackageIds) {
        const pkg = packages.find((p) => p.id === id);
        if (pkg) {
          const numericPrice = (pkg.price || "").replace(/[^0-9.]/g, "");
          const dollars = parseFloat(numericPrice) || (pkg.priceCents ? pkg.priceCents / 100 : 0);
          if (dollars <= 0 && !pkg.quoteRequired) {
            skippedZeroCount++;
            continue; // Skip $0 packages without quote required
          }
        }
        const fd = new FormData();
        fd.append("status", "PUBLISHED");
        fd.append("show", "true");
        await updateAdminPackage({ id, formData: fd }).unwrap();
        publishedCount++;
      }
      setNotification({
        type: "success",
        message:
          skippedZeroCount > 0
            ? `Published ${publishedCount} package(s). Skipped ${skippedZeroCount} package(s) with $0 price (Quote Required needed).`
            : `Successfully published ${publishedCount} package(s).`,
      });
      setSelectedPackageIds([]);
      refetchPackages();
    } catch (err) {
      setNotification({
        type: "error",
        message: getErrorMessage(err, "Failed to bulk publish packages."),
      });
    }
  };

  const handleBulkArchive = async () => {
    if (selectedPackageIds.length === 0) return;
    try {
      for (const id of selectedPackageIds) {
        const fd = new FormData();
        fd.append("status", "DRAFT");
        fd.append("show", "false");
        await updateAdminPackage({ id, formData: fd }).unwrap();
      }
      setNotification({
        type: "success",
        message: `Successfully moved ${selectedPackageIds.length} package(s) to Draft.`,
      });
      setSelectedPackageIds([]);
      refetchPackages();
    } catch (err) {
      setNotification({
        type: "error",
        message: getErrorMessage(err, "Failed to bulk archive packages."),
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPackageIds.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${selectedPackageIds.length} selected package(s)? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      for (const id of selectedPackageIds) {
        await deleteAdminPackage(id).unwrap();
      }
      setNotification({
        type: "success",
        message: `Successfully deleted ${selectedPackageIds.length} package(s).`,
      });
      setSelectedPackageIds([]);
      refetchPackages();
    } catch (err) {
      setNotification({
        type: "error",
        message: getErrorMessage(err, "Failed to bulk delete packages."),
      });
    }
  };

  const handleDeletePackage = async (pkg: PackageItem | any, alreadyDeleted = false) => {
    const pkgName = pkg.name || pkg.title || "Package";
    if (alreadyDeleted) {
      setNotification({
        type: "success",
        message: `Package "${pkgName}" was successfully deleted.`,
      });
      refetchPackages();
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete package "${pkgName}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await deleteAdminPackage(pkg.id).unwrap();
      setNotification({
        type: "success",
        message: `Package "${pkgName}" was successfully deleted.`,
      });
      refetchPackages();
    } catch (err) {
      setNotification({
        type: "error",
        message: getErrorMessage(err, "Failed to delete package."),
      });
    }
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
          onDelete={(item) => {
            updateQueryParams({ view: "list", id: null });
            handleDeletePackage(item);
          }}
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

          {activeStatusFilter && (
            <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-xl text-xs font-semibold animate-in fade-in shrink-0">
              <span>
                Filter:{" "}
                {activeStatusFilter === "PUBLISHED"
                  ? "Live on Portal"
                  : "In Draft"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveStatusFilter(null);
                  updateQueryParams({ status: null, page: null });
                }}
                className="p-0.5 hover:bg-primary/20 rounded-full cursor-pointer transition-colors"
                title="Clear status filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <Button
            variant={activeStatusFilter === "DRAFT" ? "primary" : "outline"}
            onClick={() => {
              const nextState = activeStatusFilter === "DRAFT" ? null : "DRAFT";
              setActiveStatusFilter(nextState);
              updateQueryParams({
                status: nextState,
                page: null,
              });
            }}
            className="h-11 flex items-center justify-center space-x-1.5 whitespace-nowrap px-4 py-0 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>
              {activeStatusFilter === "DRAFT"
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
          {/* Sub Pill Tabs and View & Bulk Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <PillTabs
              items={[
                { id: "resale", label: "Resale Home" },
                { id: "new-construction", label: "New Construction" },
              ]}
              activeId={categoryKey}
              onChange={(catId) => updateQueryParams({ category: catId, page: null })}
            />

            <div className="flex items-center space-x-2">
              {/* Layout Toggle: Cards vs Table */}
              <div className="flex items-center bg-white border border-hairline p-1 rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLayoutMode("card")}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === "card"
                      ? "bg-primary text-white"
                      : "text-muted hover:text-main"
                  }`}
                  title="Card View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("table")}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === "table"
                      ? "bg-primary text-white"
                      : "text-muted hover:text-main"
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Bulk Action Buttons if items selected */}
              {selectedPackageIds.length > 0 && (
                <div className="flex items-center space-x-1.5 animate-in fade-in">
                  <Button
                    variant="outline"
                    onClick={handleBulkPublish}
                    className="h-10 text-xs px-2.5 bg-white border-accent-green/40 text-accent-green hover:bg-accent-green/10"
                    title="Publish selected"
                  >
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    <span>Publish ({selectedPackageIds.length})</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBulkArchive}
                    className="h-10 text-xs px-2.5 bg-white border-amber-300 text-amber-700 hover:bg-amber-50"
                    title="Move to Draft"
                  >
                    <Archive className="w-3.5 h-3.5 mr-1" />
                    <span>Draft</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="h-10 text-xs px-2.5 bg-white border-danger/30 text-danger hover:bg-danger-bg"
                    title="Delete selected"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Delete</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

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
              {activeStatusFilter && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveStatusFilter(null);
                    updateQueryParams({ status: null, page: null });
                  }}
                  className="bg-white"
                >
                  Clear filter ({activeStatusFilter === "PUBLISHED" ? "Live" : "Draft"})
                </Button>
              )}
            </div>
          ) : (
            <>
              {layoutMode === "card" ? (
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
                      onDuplicate={handleDuplicatePackage}
                      onTogglePublish={() => refetchPackages()}
                      onOpenVideo={(item) => setVideoModalPackage(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-hairline overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm text-main whitespace-nowrap border-collapse">
                      <thead className="bg-canvas border-b border-hairline text-xs font-bold text-muted uppercase">
                        <tr>
                          <th className="py-3 px-4 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={
                                filteredPackages.length > 0 &&
                                selectedPackageIds.length === filteredPackages.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPackageIds(filteredPackages.map((p) => p.id));
                                } else {
                                  setSelectedPackageIds([]);
                                }
                              }}
                              className="w-4 h-4 rounded accent-primary cursor-pointer"
                            />
                          </th>
                          <th
                            onClick={() => handleSort("name")}
                            className="py-3.5 px-4 cursor-pointer hover:text-main select-none"
                          >
                            <div className="flex items-center space-x-1">
                              <span>Package Name</span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort("category")}
                            className="py-3.5 px-4 cursor-pointer hover:text-main select-none"
                          >
                            <div className="flex items-center space-x-1">
                              <span>Category</span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="py-3.5 px-4">Type</th>
                          <th
                            onClick={() => handleSort("price")}
                            className="py-3.5 px-4 cursor-pointer hover:text-main select-none"
                          >
                            <div className="flex items-center space-x-1">
                              <span>Price</span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort("status")}
                            className="py-3.5 px-4 cursor-pointer hover:text-main select-none"
                          >
                            <div className="flex items-center space-x-1">
                              <span>Status</span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort("updated")}
                            className="py-3.5 px-4 cursor-pointer hover:text-main select-none"
                          >
                            <div className="flex items-center space-x-1">
                              <span>Updated</span>
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline font-medium">
                        {filteredPackages.map((pkg) => {
                          const isSelected = selectedPackageIds.includes(pkg.id);
                          return (
                            <tr
                              key={pkg.id}
                              onClick={() =>
                                updateQueryParams({ view: "details", id: pkg.id })
                              }
                              className={`hover:bg-canvas/60 transition-colors cursor-pointer ${
                                isSelected ? "bg-primary/5" : ""
                              }`}
                            >
                              <td
                                className="py-3 px-4 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPackageIds((prev) => [...prev, pkg.id]);
                                    } else {
                                      setSelectedPackageIds((prev) =>
                                        prev.filter((id) => id !== pkg.id)
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                                />
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-main hover:text-primary transition-colors">
                                {pkg.name}
                              </td>
                              <td className="py-3.5 px-4 text-sub">{pkg.category}</td>
                              <td className="py-3.5 px-4 text-sub">{pkg.type}</td>
                              <td className="py-3.5 px-4 font-bold text-main">{pkg.price}</td>
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                                    pkg.status === "Published"
                                      ? "bg-[#24B33C1F] text-[#24B33C]"
                                      : "bg-[#FFFAE7] text-[#BB960B]"
                                  }`}
                                >
                                  {pkg.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-xs text-muted">
                                <div>{pkg.updated}</div>
                                {pkg.editor && <div className="text-[11px] text-muted/80">{pkg.editor}</div>}
                              </td>
                              <td
                                className="py-3.5 px-4 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQueryParams({
                                        view: "create",
                                        id: pkg.id,
                                        step: "basic",
                                      })
                                    }
                                    className="p-1.5 hover:bg-canvas text-sub hover:text-primary rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDuplicatePackage(pkg)}
                                    className="p-1.5 hover:bg-canvas text-sub hover:text-primary rounded-lg transition-colors cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePackage(pkg)}
                                    className="p-1.5 hover:bg-danger-bg text-sub hover:text-danger rounded-lg transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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
            totalAddonsCount === 0 && !searchQuery.trim() && !activeStatusFilter ? (
              <div className="bg-canvas border-2 border-dashed border-hairline hover:border-primary/40 rounded-2xl p-10 sm:p-14 text-center transition-all shadow-2xs">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-trade font-bold text-xl text-main">
                      No Add-on Services Configured Yet
                    </h3>
                    <p className="text-sm text-sub leading-relaxed">
                      No Add-on services configured yet. Sync from ISN or click here to add your first ancillary inspection service.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                      variant="primary"
                      onClick={() => setIsCreateAddonModalOpen(true)}
                      className="w-full sm:w-auto h-11 px-5 flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Ancillary Inspection Service</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-canvas border border-hairline rounded-2xl p-12 text-center text-sub space-y-3">
                <p>No add-ons found matching your criteria.</p>
                {(activeStatusFilter || searchQuery.trim()) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveStatusFilter(null);
                      setSearchQuery("");
                      updateQueryParams({ status: null, page: null });
                    }}
                    className="bg-white"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )
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
