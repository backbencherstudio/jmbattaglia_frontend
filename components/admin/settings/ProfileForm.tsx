"use client";

import React, { useState } from "react";
import { UserProfileData } from "@/types/settings";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  initialData: UserProfileData;
  onSave: (data: UserProfileData) => void;
}

export function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfileData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Profile Name & Profile Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-base font-bold  text-sub uppercase">
            Profile Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-base font-bold text-sub uppercase">
            Profile Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border"
          />
        </div>
      </div>

      {/* Row 2: Passwords Grid (New Password, Current Password, Confirm Password) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="block text-base font-bold text-sub uppercase">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword || ""}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-sub focus:outline-none focus:border-brand-border"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-base font-bold text-sub uppercase">
            Current Password
          </label>
          <input
            type="password"
            value={formData.currentPassword || ""}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-sub focus:outline-none focus:border-brand-border"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-base font-bold text-sub uppercase">
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword || ""}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <Button type="submit" variant="primary" className="px-6 py-3">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
