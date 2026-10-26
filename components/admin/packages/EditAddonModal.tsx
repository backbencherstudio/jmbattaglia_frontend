"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import Image from "next/image";
import {
  X,
  UploadCloud,
  Check,
  AlertCircle,
  Loader2,
  Edit,
  RotateCcw,
} from "lucide-react";
import {
  useGetAdminAddonByIdQuery,
  useUpdateAdminAddonMutation,
} from "@/redux/features/packages/addonApi";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { AddonItem } from "@/types/packages";
import type { ApiAddonItem } from "@/types/addons";
import { getAddonImage } from "@/types/addons";

export interface EditAddonModalProps {
  isOpen: boolean;
  addon: ApiAddonItem | AddonItem | null;
  onClose: () => void;
  onSuccess: (updatedAddon?: ApiAddonItem) => void;
}

interface EditAddonFormContentProps {
  activeAddon: ApiAddonItem | AddonItem;
  isLoadingSingle: boolean;
  onClose: () => void;
  onSuccess: (updatedAddon?: ApiAddonItem) => void;
  titleId: string;
}

function EditAddonFormContent({
  activeAddon,
  isLoadingSingle,
  onClose,
  onSuccess,
  titleId,
}: EditAddonFormContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addonId = activeAddon.id;

  // Initial value derivations
  const initialName = activeAddon.name || "";

  let initialPrice = "";
  if ("price" in activeAddon && typeof activeAddon.price === "number") {
    initialPrice = String(activeAddon.price);
  } else if (
    "priceCents" in activeAddon &&
    typeof activeAddon.priceCents === "number"
  ) {
    initialPrice = String(activeAddon.priceCents / 100);
  } else if (activeAddon.price) {
    const parsed = parseFloat(String(activeAddon.price).replace(/[^0-9.]/g, ""));
    initialPrice = !isNaN(parsed) ? String(parsed) : "";
  }

  const cat = ("category" in activeAddon ? activeAddon.category || "" : "").toUpperCase();
  const initialCategory: "RESALE_HOME" | "NEW_CONSTRUCTION" =
    cat.includes("NEW_CONSTRUCTION") || cat.includes("NEW CONSTRUCTION")
      ? "NEW_CONSTRUCTION"
      : "RESALE_HOME";

  const stat = ("status" in activeAddon ? activeAddon.status : "")?.toUpperCase();
  const initialStatus: "PUBLISHED" | "DRAFT" =
    stat === "DRAFT" ? "DRAFT" : "PUBLISHED";

  const initialDescription =
    "description" in activeAddon ? activeAddon.description || "" : "";

  const initialImage =
    "priceCents" in activeAddon
      ? getAddonImage(activeAddon as ApiAddonItem)
      : activeAddon.image || "/assets/images/pool_inspection.jpg";

  // Form states initialized directly
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const [category, setCategory] = useState<"RESALE_HOME" | "NEW_CONSTRUCTION">(initialCategory);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(initialStatus);
  const [description, setDescription] = useState(initialDescription);

  // Media states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [updateAddon, { isLoading: isSubmitting }] =
    useUpdateAdminAddonMutation();

  const cleanupObjectUrl = useCallback(() => {
    if (newPreviewUrl && newPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(newPreviewUrl);
    }
    setNewPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [newPreviewUrl]);

  const handleClose = () => {
    cleanupObjectUrl();
    setFormError(null);
    onClose();
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setFormError("Please select a valid image or video file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setFormError("File size must not exceed 50MB.");
      return;
    }
    setFormError(null);
    setSelectedFile(file);
    if (newPreviewUrl && newPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(newPreviewUrl);
    }
    const url = URL.createObjectURL(file);
    setNewPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRevertFile = () => {
    cleanupObjectUrl();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonId) return;

    setFormError(null);

    if (!name.trim()) {
      setFormError("Please enter an add-on name.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError("Please enter a valid price.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", String(parsedPrice));
      formData.append("priceCents", String(Math.round(parsedPrice * 100)));
      formData.append("category", category);
      formData.append("status", status);

      if (description.trim()) {
        formData.append("description", description.trim());
      } else {
        formData.append("description", "");
      }

      // Only append new file if user uploaded a replacement
      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const res = await updateAddon({ id: addonId, formData }).unwrap();
      cleanupObjectUrl();
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to update add-on."));
    }
  };

  const currentDisplayImage = newPreviewUrl || initialImage;

  return (
    <div
      className="relative w-full max-w-2xl bg-canvas border border-hairline rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto space-y-6"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-hairline">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Edit className="w-5 h-5" />
            </span>
            <h2
              id={titleId}
              className="font-trade font-bold text-2xl text-main tracking-tight"
            >
              Edit Add-on Service
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sub">
            Update details, pricing, publication status, and media for this add-on.
          </p>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleClose}
          className="p-2 text-muted hover:text-main rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Loading Spinner if single addon query is in progress */}
      {isLoadingSingle && (
        <div className="flex items-center gap-2 text-xs text-primary font-medium py-1 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Fetching latest add-on details...</span>
        </div>
      )}

      {/* Error Alert */}
      {formError && (
        <div className="p-3.5 bg-danger-bg border border-danger/20 rounded-xl flex items-start gap-3 text-danger text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Add-on Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-main">
            Add-on Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chemical Balancing, Thermal Imaging"
            className="w-full h-11 px-4 rounded-xl border border-hairline bg-white text-main text-sm focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
          />
        </div>

        {/* Row 2: Price & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-main">
              Price (USD $) <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub font-semibold text-sm">
                $
              </span>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="79"
                className="w-full h-11 pl-8 pr-4 rounded-xl border border-hairline bg-white text-main text-sm focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs font-trade font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-main">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "RESALE_HOME" | "NEW_CONSTRUCTION")
              }
              className="w-full h-11 px-3.5 rounded-xl border border-hairline bg-white text-main text-sm focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs cursor-pointer"
            >
              <option value="RESALE_HOME">Resale Home</option>
              <option value="NEW_CONSTRUCTION">New Construction</option>
            </select>
          </div>
        </div>

        {/* Row 3: Status Selector (Published vs Draft) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-main">
            Publication Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus("PUBLISHED")}
              className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                status === "PUBLISHED"
                  ? "bg-[#24B33C1F] border-[#24B33C80] text-[#1E9432] shadow-2xs"
                  : "bg-white border-hairline text-sub hover:bg-neutral-50"
              }`}
            >
              {status === "PUBLISHED" && <Check className="w-4 h-4" />}
              <span>Published (Live)</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus("DRAFT")}
              className={`flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                status === "DRAFT"
                  ? "bg-amber-100/80 border-amber-400 text-amber-800 shadow-2xs"
                  : "bg-white border-hairline text-sub hover:bg-neutral-50"
              }`}
            >
              {status === "DRAFT" && <Check className="w-4 h-4" />}
              <span>Draft</span>
            </button>
          </div>
        </div>

        {/* Row 4: Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-main">
            Description (Optional)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a clear description of what this add-on covers for customers..."
            className="w-full px-4 py-3 rounded-xl border border-hairline bg-white text-main text-sm focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs resize-none"
          />
        </div>

        {/* Row 5: Media Upload & Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-main">
              Add-on Media (Image / Video)
            </label>
            {selectedFile && (
              <button
                type="button"
                onClick={handleRevertFile}
                className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revert to original</span>
              </button>
            )}
          </div>

          {/* Current Media Preview with Replacement Dropzone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Thumbnail Preview */}
            <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-neutral-900 border border-hairline shadow-inner">
              <Image
                src={currentDisplayImage}
                alt={name || "Add-on media preview"}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-white font-medium">
                {selectedFile ? "New file selected" : "Current media"}
              </div>
            </div>

            {/* Upload Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-neutral-300 hover:border-primary/50 hover:bg-neutral-50/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,video/mp4"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                className="hidden"
              />

              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1.5 shadow-2xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-main">
                {selectedFile ? selectedFile.name : "Click or drag to replace"}
              </p>
              <p className="text-[11px] text-sub mt-0.5">
                JPG, PNG, or MP4 up to 50MB
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-hairline bg-white hover:bg-neutral-100 text-main text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function EditAddonModal({
  isOpen,
  addon,
  onClose,
  onSuccess,
}: EditAddonModalProps) {
  const titleId = useId();
  const addonId = addon?.id || "";

  // Optionally fetch fresh single addon data from GET /api/v1/admin/addons/:id
  const { data: singleAddonResponse, isLoading: isLoadingSingle } =
    useGetAdminAddonByIdQuery(addonId, {
      skip: !isOpen || !addonId,
      refetchOnMountOrArgChange: true,
    });

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
  }, [isOpen, onClose]);

  if (!isOpen || !addon) return null;

  const activeAddon = singleAddonResponse?.data || addon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      <EditAddonFormContent
        key={`${activeAddon.id}-${singleAddonResponse?.data ? "synced" : "init"}`}
        activeAddon={activeAddon}
        isLoadingSingle={isLoadingSingle}
        onClose={onClose}
        onSuccess={onSuccess}
        titleId={titleId}
      />
    </div>
  );
}

export default EditAddonModal;
