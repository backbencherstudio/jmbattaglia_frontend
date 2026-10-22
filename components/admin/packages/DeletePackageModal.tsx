"use client";

import React, { useEffect, useId } from "react";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import { PackageItem } from "@/types/packages";

interface DeletePackageModalProps {
  isOpen: boolean;
  packageItem: PackageItem | null;
  isDeleting: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeletePackageModal({
  isOpen,
  packageItem,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeletePackageModalProps) {
  const titleId = useId();

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !packageItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!isDeleting) onClose();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md bg-canvas border border-hairline rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-muted hover:text-main rounded-lg hover:bg-neutral-200/60 transition-colors disabled:opacity-40 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Danger Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-danger-bg text-danger flex items-center justify-center shrink-0 shadow-xs border border-danger/20">
            <Trash2 className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-1 pr-6">
            <h2 id={titleId} className="font-trade font-bold text-xl text-main tracking-tight">
              Delete Package
            </h2>
            <p className="text-sm text-sub leading-relaxed">
              Are you sure you want to permanently delete this package? This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Selected Package Details Pill */}
        <div className="p-3.5 bg-neutral-100/80 rounded-xl border border-hairline space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-main text-sm truncate font-trade">
              {packageItem.name}
            </span>
            <span className="font-trade font-bold text-sm text-primary shrink-0">
              {packageItem.price}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-sub">
            <span className="capitalize">{packageItem.category.toLowerCase().replace(/_/g, " ")}</span>
            <span>•</span>
            <span className="capitalize">{packageItem.type.toLowerCase()}</span>
            <span>•</span>
            <span
              className={
                packageItem.status === "Published"
                  ? "text-[#24B33C] font-medium"
                  : "text-[#BB960B] font-medium"
              }
            >
              {packageItem.status}
            </span>
          </div>
        </div>

        {/* Error message alert if API call fails */}
        {errorMessage && (
          <div className="p-3 bg-danger-bg text-danger text-xs rounded-xl border border-danger/20 flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Warning Callout */}
        <div className="flex items-center gap-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-lg p-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Deleting this package will remove it from the customer catalog and portals.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-hairline bg-white hover:bg-neutral-100 text-main text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="px-5 py-2.5 rounded-xl bg-danger hover:bg-[#b82626] text-white text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
