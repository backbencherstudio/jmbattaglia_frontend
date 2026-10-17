"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";

interface ProfilePictureUploaderProps {
  avatarUrl?: string | null;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onAvatarDelete: () => void;
  disabled?: boolean;
}

export function ProfilePictureUploader({
  avatarUrl,
  previewUrl,
  onFileSelect,
  onAvatarDelete,
  disabled = false,
}: ProfilePictureUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5 MiB. Please select a smaller JPEG or PNG image.");
        return;
      }
      onFileSelect(file);
    }
  };

  const displayImageSrc =
    previewUrl ||
    (avatarUrl?.startsWith("http")
      ? avatarUrl
      : avatarUrl
        ? `http://10.10.9.230:3000${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`
        : "/assets/images/safe_home_package.jpg");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-sub uppercase tracking-wider">
        Profile Picture
      </label>

      <div className="flex items-center space-x-3">
        {/* Avatar Image Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-hairline shrink-0 shadow-2xs">
          <Image
            src={displayImageSrc}
            alt="Profile Avatar"
            fill
            sizes="64px"
            className="object-cover"
            priority
            unoptimized={Boolean(previewUrl || displayImageSrc.startsWith("http"))}
          />
        </div>

        {/* Upload & Delete Buttons */}
        <div className="flex flex-col space-y-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={disabled}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 bg-white border border-hairline rounded-lg text-sub hover:text-main hover:bg-canvas transition-colors shadow-2xs cursor-pointer flex items-center justify-center disabled:opacity-50"
            title="Upload Profile Picture (Max 5 MiB)"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onAvatarDelete}
            disabled={disabled}
            className="p-2 bg-white border border-hairline rounded-lg text-danger hover:bg-danger-bg transition-colors shadow-2xs cursor-pointer flex items-center justify-center disabled:opacity-50"
            title="Remove Profile Picture"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted">
        Optional JPEG/PNG file, max 5 MiB.
      </p>
    </div>
  );
}

export default ProfilePictureUploader;
