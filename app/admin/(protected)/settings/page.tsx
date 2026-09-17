import React from "react";
import { Settings, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-main">Admin Settings</h2>
        <p className="text-sm text-sub mt-1">
          Manage system configurations, notification emails, and portal preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-hairline space-y-6 shadow-xs">
        <div className="flex items-center space-x-3 pb-4 border-b border-hairline">
          <div className="p-2.5 bg-canvas rounded-xl text-main">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-main">General Information</h3>
            <p className="text-xs text-sub">Portal & Business Settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-main uppercase">
              Business Name
            </label>
            <input
              type="text"
              defaultValue="At Ease Inspections"
              className="w-full px-4 py-2.5 bg-canvas border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-main uppercase">
              Admin Contact Email
            </label>
            <input
              type="email"
              defaultValue="support@ateaseinspections.com"
              className="w-full px-4 py-2.5 bg-canvas border border-hairline rounded-xl text-sm font-medium text-main focus:outline-none focus:border-brand-border"
            />
          </div>
        </div>

        <div className="pt-2">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
