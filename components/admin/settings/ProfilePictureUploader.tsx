"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";

interface ProfilePictureUploaderProps {
  avatarUrl: string;
  onAvatarChange: (newUrl: string) => void;
  onAvatarDelete: () => void;
}

export function ProfilePictureUploader({
  avatarUrl,
  onAvatarChange,
  onAvatarDelete,
}: ProfilePictureUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onAvatarChange(url);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-bold text-sub uppercase">
        Profile Picture
      </label>

      <div className="flex items-start space-x-3">
        {/* Avatar Image Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-hairline shrink-0">
          <Image
            src={avatarUrl || "/assets/images/safe_home_package.jpg"}
            alt="Profile Avatar"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        {/* Upload & Delete Buttons */}
        <div className="flex flex-col space-y-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 bg-white border border-hairline rounded-lg text-sub hover:text-main hover:bg-canvas transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
            title="Upload Profile Picture"
          >
            <Upload className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onAvatarDelete}
            className="p-1.5 bg-white border border-hairline rounded-lg text-danger hover:bg-danger-bg transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
            title="Delete Profile Picture"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
