"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Play,
  Check,
  RefreshCw,
  Trash2,
  AlertCircle,
} from "lucide-react";

interface PackageMediaUploaderProps {
  image?: string;
  videoUrl?: string;
  file?: File | null;
  onUpdateImage: (image: string) => void;
  onUpdateFile?: (file: File | null) => void;
  onUpdateVideoUrl?: (videoUrl: string) => void;
}

export function PackageMediaUploader({
  image,
  videoUrl,
  file,
  onUpdateImage,
  onUpdateFile,
  onUpdateVideoUrl,
}: PackageMediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const [fileMeta, setFileMeta] = useState<{
    name: string;
    size: string;
    type: "image" | "video";
  } | null>(() => {
    if (file) {
      return {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type.startsWith("video/") ? "video" : "image",
      };
    }
    if (image && image !== "/assets/images/safe_home_package.jpg") {
      return {
        name: "Uploaded Package Media",
        size: "Saved",
        type: videoUrl && videoUrl.includes(".mp4") ? "video" : "image",
      };
    }
    return null;
  });

  useEffect(() => {
    if (file) {
      setFileMeta({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type.startsWith("video/") ? "video" : "image",
      });
    } else if (image && image !== "/assets/images/safe_home_package.jpg") {
      setFileMeta((prev) => prev || {
        name: "Package Media Asset",
        size: "Attached",
        type: videoUrl && videoUrl.includes(".mp4") ? "video" : "image",
      });
    }
  }, [file, image, videoUrl]);

  const handleProcessFile = (selectedFile: File) => {
    setUploadError(null);

    // 50 MB Max Limit
    const MAX_SIZE = 50 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setUploadError("File size exceeds 50 MB limit. Please select a smaller file.");
      return;
    }

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setUploadError(
        "Unsupported format. Please upload a JPG, PNG, WebP image or MP4 video."
      );
      return;
    }

    const formattedSize = formatFileSize(selectedFile.size);

    if (isImage) {
      const previewUrl = URL.createObjectURL(selectedFile);
      onUpdateImage(previewUrl);
      onUpdateFile?.(selectedFile);
      setFileMeta({
        name: selectedFile.name,
        size: formattedSize,
        type: "image",
      });
    } else if (isVideo) {
      const createdVideoUrl = URL.createObjectURL(selectedFile);
      onUpdateVideoUrl?.(createdVideoUrl);
      onUpdateFile?.(selectedFile);
      setFileMeta({
        name: selectedFile.name,
        size: formattedSize,
        type: "video",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleProcessFile(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleProcessFile(selectedFile);
    }
    if (e.target) e.target.value = "";
  };

  const handleRemoveMedia = () => {
    setFileMeta(null);
    setUploadError(null);
    onUpdateImage("/assets/images/safe_home_package.jpg");
    onUpdateFile?.(null);
    onUpdateVideoUrl?.("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-main uppercase">
          Package media <span className="text-primary">*</span>
        </label>
        {fileMeta && (
          <span className="text-xs font-bold text-accent-green flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            Media Selected
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/jpeg,image/png,image/webp,image/jpg,video/mp4,video/webm"
        className="hidden"
      />

      {/* Dropzone or Preview Card */}
      {!fileMeta ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center space-y-3 transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary-subtle/30 scale-[1.01] shadow-sm"
              : "border-hairline bg-white hover:border-brand-border/60 hover:bg-canvas/50"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-transform ${
              isDragging
                ? "bg-primary text-white scale-110"
                : "bg-primary-subtle text-primary"
            }`}
          >
            <Upload className={`w-6 h-6 ${isDragging ? "animate-bounce" : ""}`} />
          </div>
          <div>
            <p className="font-trade font-bold text-base text-main">
              {isDragging ? "Drop your file here" : "Drag image or video here"}
            </p>
            <p className="text-xs text-muted mt-1">
              or click to browse • JPG, PNG, WebP, MP4 up to 50 MB
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 ${
            isDragging
              ? "border-primary bg-primary-subtle/20"
              : "border-hairline bg-white"
          } rounded-2xl p-4 sm:p-5 transition-all shadow-xs`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {/* Thumbnail / Player */}
              <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 border border-hairline shrink-0 shadow-2xs">
                {fileMeta.type === "video" ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-neutral-900">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-5 h-5 fill-primary text-primary" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={image || "/assets/images/safe_home_package.jpg"}
                    alt="Uploaded package media preview"
                    fill
                    unoptimized
                    sizes="112px"
                    className="object-cover"
                  />
                )}
              </div>

              {/* Meta Info */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-green/15 text-accent-green flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Uploaded
                  </span>
                  <span className="text-xs font-semibold text-muted uppercase">
                    {fileMeta.type}
                  </span>
                </div>
                <p className="text-sm font-bold text-main truncate max-w-xs sm:max-w-md">
                  {fileMeta.name}
                </p>
                <p className="text-xs text-sub">
                  {fileMeta.size} • Ready for package review
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl border border-hairline bg-white hover:bg-canvas text-sub hover:text-main text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                title="Change media file"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={handleRemoveMedia}
                className="p-2 rounded-xl border border-hairline bg-white hover:bg-danger-bg text-danger transition-all cursor-pointer shadow-2xs"
                title="Remove media"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dragging over existing preview overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-primary-subtle/85 backdrop-blur-xs rounded-2xl flex items-center justify-center border-2 border-primary border-dashed z-20">
              <p className="font-trade font-bold text-sm text-primary flex items-center gap-2">
                <Upload className="w-5 h-5 animate-bounce" />
                <span>Drop new file to replace</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center space-x-2 text-xs font-medium text-danger bg-danger-bg/50 border border-danger/20 p-2.5 rounded-xl animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Optional Video URL input */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-sub uppercase mb-1.5">
          Video URL (Optional)
        </label>
        <input
          type="url"
          value={videoUrl || ""}
          onChange={(e) => onUpdateVideoUrl?.(e.target.value)}
          placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 link"
          className="w-full px-4 py-2.5 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
        />
        <p className="text-[11px] text-muted mt-1">
          Provide an external YouTube, Vimeo, or MP4 link for the package overview video modal.
        </p>
      </div>
    </div>
  );
}
