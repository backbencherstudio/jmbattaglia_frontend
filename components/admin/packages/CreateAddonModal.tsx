"use client";

import React, { useState, useRef, useEffect, useId, useCallback } from "react";
import Image from "next/image";
import {
  X,
  UploadCloud,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCreateAdminAddonMutation } from "@/redux/features/packages/addonApi";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { ApiAddonItem } from "@/types/addons";

export interface CreateAddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAddon?: ApiAddonItem) => void;
}

export function CreateAddonModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAddonModalProps) {
  const titleId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<"RESALE_HOME" | "NEW_CONSTRUCTION">(
    "RESALE_HOME",
  );
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [description, setDescription] = useState("");

  // Media upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [createAddon, { isLoading: isSubmitting }] =
    useCreateAdminAddonMutation();

  const resetForm = useCallback(() => {
    setName("");
    setPrice("");
    setCategory("RESALE_HOME");
    setStatus("PUBLISHED");
    setDescription("");
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormError(null);
  }, [previewUrl]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Clean up object url on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        resetForm();
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
  }, [isOpen, isSubmitting, onClose, resetForm]);

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
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }

      if (selectedFile) {
        formData.append("media", selectedFile);
      }

      const res = await createAddon(formData).unwrap();
      resetForm();
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to create add-on."));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5"
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          if (!isSubmitting) handleClose();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in cursor-pointer"
      />

      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-canvas border border-hairline rounded-2xl shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-hairline bg-canvas">
          <div className="space-y-0.5">
            <h2
              id={titleId}
              className="font-trade font-bold text-xl sm:text-2xl text-main tracking-tight"
            >
              New Add-on
            </h2>
            <p className="text-xs sm:text-sm text-sub">
              Create a new standalone inspection service add-on.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleClose}
            className="p-2 text-muted hover:text-main rounded-xl hover:bg-neutral-200/60 transition-colors disabled:opacity-40 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5"
        >
          {/* Error Alert */}
          {formError && (
            <div className="p-3.5 bg-danger-bg text-danger text-xs sm:text-sm rounded-xl border border-danger/20 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{formError}</span>
            </div>
          )}

          {/* Name & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-main uppercase">
                Add-on Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chemical Balancing"
                disabled={isSubmitting}
                className="w-full h-11 px-3.5 bg-white border border-hairline rounded-xl text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-main uppercase">
                Price ($) <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sub font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="79"
                  disabled={isSubmitting}
                  className="w-full h-11 pl-8 pr-3.5 bg-white border border-hairline rounded-xl text-sm font-semibold text-main placeholder:text-muted focus:outline-none focus:border-primary transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-main uppercase">
                Category
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "RESALE_HOME" | "NEW_CONSTRUCTION")
                }
                disabled={isSubmitting}
                className="w-full h-11 px-3.5 bg-white border border-hairline rounded-xl text-sm text-main focus:outline-none focus:border-primary transition-all disabled:opacity-50 cursor-pointer"
              >
                <option value="RESALE_HOME">Resale Home</option>
                <option value="NEW_CONSTRUCTION">New Construction</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-main uppercase">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "PUBLISHED" | "DRAFT")
                }
                disabled={isSubmitting}
                className="w-full h-11 px-3.5 bg-white border border-hairline rounded-xl text-sm text-main focus:outline-none focus:border-primary transition-all disabled:opacity-50 cursor-pointer"
              >
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-main uppercase">
              Description <span className="text-muted font-normal text-[11px]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Complete pool and spa chemical water testing and balancing report..."
              disabled={isSubmitting}
              className="w-full p-3 bg-white border border-hairline rounded-xl text-sm text-main placeholder:text-muted focus:outline-none focus:border-primary transition-all resize-none disabled:opacity-50"
            />
          </div>

          {/* Media File Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-main uppercase">
                Add-on Image / Media
              </label>
              {selectedFile && (
                <span className="text-xs font-bold text-accent-green flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  Selected
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              accept="image/jpeg,image/png,image/webp,video/mp4"
              className="hidden"
            />

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center space-y-2 transition-all cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary-subtle/30"
                    : "border-hairline bg-white hover:border-brand-border/60 hover:bg-canvas/50"
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-main">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[11px] text-sub mt-0.5">
                    JPG, PNG, WebP or MP4 (max 50MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center gap-3 p-3 bg-white border border-hairline rounded-xl">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-xs font-semibold text-main truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-sub">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted hover:text-danger rounded-lg hover:bg-danger-bg transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-hairline bg-white hover:bg-neutral-100 text-main text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Add-on...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Add-on</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAddonModal;
