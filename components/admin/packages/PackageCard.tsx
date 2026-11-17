"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit, Trash2, Play, Copy, Globe, EyeOff, Calendar, User } from "lucide-react";
import { PackageItem } from "@/types/packages";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useDeleteAdminPackageMutation, useUpdateAdminPackageMutation } from "@/redux/features/packages/packageApi";
import { DeletePackageModal } from "./DeletePackageModal";

interface PackageCardProps {
  item: PackageItem;
  onSelect: (item: PackageItem) => void;
  onEdit?: (item: PackageItem) => void;
  onDelete?: (item: PackageItem) => void;
  onDuplicate?: (item: PackageItem) => void;
  onTogglePublish?: (item: PackageItem) => void;
  onOpenVideo?: (item: PackageItem) => void;
}

export function PackageCard({
  item,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublish,
  onOpenVideo,
}: PackageCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteAdminPackage, { isLoading: isDeleting }] =
    useDeleteAdminPackageMutation();
  const [updateAdminPackage, { isLoading: isUpdatingStatus }] =
    useUpdateAdminPackageMutation();

  const handleOpenDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteError(null);
      await deleteAdminPackage(item.id).unwrap();
      setShowDeleteModal(false);
      if (onDelete) {
        (onDelete as any)(item, true);
      }
    } catch (err) {
      setDeleteError(getErrorMessage(err, "Failed to delete package."));
    }
  };

  const handleQuickTogglePublish = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = item.status === "Published" ? "DRAFT" : "PUBLISHED";
    
    // Check published $0 price protection
    if (nextStatus === "PUBLISHED") {
      const numericPrice = (item.price || "").replace(/[^0-9.]/g, "");
      const dollars = parseFloat(numericPrice) || (item.priceCents ? item.priceCents / 100 : 0);
      if (dollars <= 0 && !item.quoteRequired) {
        alert("Cannot publish a package with $0 price without enabling 'Quote Required / Custom Pricing'.");
        return;
      }
    }

    try {
      const fd = new FormData();
      fd.append("status", nextStatus);
      fd.append("show", nextStatus === "PUBLISHED" ? "true" : "false");
      await updateAdminPackage({ id: item.id, formData: fd }).unwrap();
      if (onTogglePublish) {
        onTogglePublish({
          ...item,
          status: nextStatus === "PUBLISHED" ? "Published" : "Draft",
        });
      }
    } catch (err) {
      alert(getErrorMessage(err, "Failed to toggle package publication status."));
    }
  };

  return (
    <>
      <div
        onClick={() => onSelect(item)}
        className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="p-3">
          {/* Thumbnail Image with Action Icons & Play Button */}
          <div
            onClick={(e) => {
              if (onOpenVideo) {
                e.stopPropagation();
                onOpenVideo(item);
              }
            }}
            className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-neutral-900 group/thumb cursor-pointer"
          >
            <Image
              src={item?.image || "/assets/images/safe_home_package.jpg"}
              alt={item?.name || "Package"}
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover/thumb:scale-105 transition-transform duration-500"
            />

            {/* Action Icons Top Right */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(item);
                }}
                className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg text-main hover:text-primary transition-colors shadow-xs cursor-pointer"
                title="Edit Package"
              >
                <Edit className="w-4 h-4" />
              </button>

              {onDuplicate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(item);
                  }}
                  className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg text-main hover:text-primary transition-colors shadow-xs cursor-pointer"
                  title="Duplicate Package"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handleQuickTogglePublish}
                disabled={isUpdatingStatus}
                className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg text-main hover:text-primary transition-colors shadow-xs cursor-pointer"
                title={item.status === "Published" ? "Quick Unpublish to Draft" : "Quick Publish"}
              >
                {item.status === "Published" ? (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                ) : (
                  <Globe className="w-4 h-4 text-accent-green" />
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenDelete}
                className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg text-danger hover:bg-danger-bg transition-colors shadow-xs cursor-pointer"
                title="Delete Package"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Video Play Overlay Center */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-black/35 transition-colors">
              <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVideo?.(item);
              }}
              className="w-11 h-11 rounded-xl bg-black/50 group-hover/thumb:bg-primary group-hover/thumb:text-white backdrop-blur-xs border border-white/25 flex items-center justify-center text-primary group-hover/thumb:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Watch package video"
              aria-label="Watch package video"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          </div>

          {/* Watch Video Chip Bottom Left */}
          <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
            <span className="text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5 shadow-xs">
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>Watch Video</span>
            </span>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {item.isRecommended && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-md uppercase tracking-wide">
                Recommended
              </span>
            )}
            <span className="px-3 py-1 bg-[#8EA800] text-white text-xs font-bold rounded-md capitalize">
              {item.type}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              item.status === "Published"
                ? "bg-[#24B33C1F] text-[#24B33C]"
                : item.status === "Archived"
                ? "bg-neutral-100 text-neutral-600 border border-neutral-300"
                : "bg-[#FFFAE7] text-[#BB960B]"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Title & Price Row */}
        <div className="flex items-baseline justify-between mt-3 gap-2">
          <h3 className="font-trade font-bold text-xl sm:text-2xl text-main tracking-tight group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-trade font-bold text-2xl sm:text-3xl text-primary shrink-0">
            {item.price}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-sub mt-1.5 line-clamp-2 leading-relaxed">
          {item.shortDescription}
        </p>

        {/* Footer Meta: Real Date & Editor */}
        <div className="flex items-center justify-between text-[11px] text-muted border-t border-hairline/80 pt-2.5 mt-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted" />
            <span>Updated: {item.updated}</span>
          </span>
          {item.editor && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-muted" />
              <span>{item.editor}</span>
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Delete Confirmation Modal */}
    <DeletePackageModal
      isOpen={showDeleteModal}
      packageItem={item}
      isDeleting={isDeleting}
      errorMessage={deleteError}
      onClose={() => {
        if (!isDeleting) {
          setShowDeleteModal(false);
          setDeleteError(null);
        }
      }}
      onConfirm={handleConfirmDelete}
    />
  </>
  );
}
