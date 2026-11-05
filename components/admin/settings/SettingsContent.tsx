"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, AlertCircle } from "lucide-react";
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from "@/redux/features/profile/profileApi";
import { useAppDispatch } from "@/redux/store";
import { logOut } from "@/redux/features/auth/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { ProfilePictureUploader } from "@/components/admin/settings/ProfilePictureUploader";
import { ProfileForm } from "@/components/admin/settings/ProfileForm";
import { SettingsSkeleton } from "@/components/admin/settings/SettingsSkeleton";
import { getErrorMessage } from "@/lib/getErrorMessage";

export function SettingsContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    data: profileResponse,
    isLoading: isFetching,
    isError,
    error: fetchError,
    refetch,
  } = useGetAdminProfileQuery();

  const [updateAdminProfile, { isLoading: isSaving }] =
    useUpdateAdminProfileMutation();

  const profile = profileResponse?.data;

  // Local state for avatar file & removal
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setRemoveProfilePicture(false);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleAvatarDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveProfilePicture(true);
  };

  const handleSave = async (formDataState: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("name", formDataState.name);
    formData.append("email", formDataState.email);

    if (formDataState.currentPassword) {
      formData.append("currentPassword", formDataState.currentPassword);
    }
    if (formDataState.newPassword) {
      formData.append("newPassword", formDataState.newPassword);
    }
    if (formDataState.confirmPassword) {
      formData.append("confirmPassword", formDataState.confirmPassword);
    }

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    } else if (removeProfilePicture) {
      formData.append("removeProfilePicture", "true");
    }

    try {
      const response = await updateAdminProfile(formData).unwrap();

      const requiresReauth = response.data?.requiresReauthentication;
      if (requiresReauth) {
        dispatch(logOut());
        dispatch(baseApi.util.resetApiState());
        router.push("/admin/login?message=" + encodeURIComponent("Security credentials updated. Please log in again with your new credentials."));
        return;
      }

      setSuccessMessage(
        response.message || "Profile updated successfully!",
      );

      // Reset file change states
      setSelectedFile(null);
      setPreviewUrl(null);
      setRemoveProfilePicture(false);

      refetch();
    } catch (err) {
      setErrorMessage(
        getErrorMessage(err, "Failed to update profile settings."),
      );
    }
  };

  if (isFetching) {
    return <SettingsSkeleton />;
  }

  if (isError && !profile) {
    return (
      <div className="space-y-6">
        <nav className="flex items-center space-x-1.5 text-xs text-sub">
          <span className="text-sub">Settings</span>
          <ChevronRight className="w-3.5 h-3.5 text-muted" />
          <span className="font-semibold text-main">Profile Settings</span>
        </nav>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <p className="text-sm font-semibold text-red-900">
            {getErrorMessage(fetchError, "Failed to load profile settings.")}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1.5 text-xs text-sub">
        <span className="text-sub">Settings</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted" />
        <span className="font-semibold text-main">Profile Settings</span>
      </nav>

      {/* Main Form Container */}
      <div className="bg-canvas border border-hairline rounded-2xl p-6 md:p-8 space-y-8 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-main">Administrator Profile</h2>
          <p className="text-xs sm:text-sm text-sub mt-0.5">
            Manage your personal administrative information and account credentials.
          </p>
        </div>

        {/* Profile Picture Uploader */}
        <ProfilePictureUploader
          avatarUrl={removeProfilePicture ? null : profile?.avatarUrl}
          previewUrl={previewUrl}
          onFileSelect={handleFileSelect}
          onAvatarDelete={handleAvatarDelete}
          disabled={isSaving}
        />

        {/* Profile Details & Password Form */}
        <ProfileForm
          initialData={{
            name: profile?.name || "",
            email: profile?.email || "",
          }}
          isSaving={isSaving}
          error={errorMessage}
          successMessage={successMessage}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default SettingsContent;
