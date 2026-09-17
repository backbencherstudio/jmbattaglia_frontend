"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { UserProfileData } from "@/types/settings";
import { ProfilePictureUploader } from "@/components/admin/settings/ProfilePictureUploader";
import { ProfileForm } from "@/components/admin/settings/ProfileForm";

export function SettingsContent() {
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: "Dana",
    email: "dana@gmail.com",
    avatarUrl: "/assets/images/safe_home_package.jpg",
    currentPassword: "password123",
    newPassword: "password123",
    confirmPassword: "password123",
  });

  const handleSave = (updatedData: UserProfileData) => {
    setProfileData(updatedData);
    alert("Profile settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Corrected Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-xs text-sub">
        <span className="text-sub">Settings</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted" />
        <span className="font-semibold text-main">Profile Settings</span>
      </nav>

      {/* Main Form Container */}
      <div className="bg-canvas border border-hairline rounded-lg py-4 px-4 space-y-8">
        <ProfilePictureUploader
          avatarUrl={profileData.avatarUrl}
          onAvatarChange={(newUrl) =>
            setProfileData((prev) => ({ ...prev, avatarUrl: newUrl }))
          }
          onAvatarDelete={() =>
            setProfileData((prev) => ({ ...prev, avatarUrl: "" }))
          }
        />

        <ProfileForm initialData={profileData} onSave={handleSave} />
      </div>
    </div>
  );
}
