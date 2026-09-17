import React from "react";
import { Package, Plus } from "lucide-react";

export default function PackageManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-main">Package Management</h2>
          <p className="text-sm text-sub mt-1">
            Create, edit, and organize inspection bundles and single packages.
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-hairline text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-main">Package Manager Ready</h3>
        <p className="text-sm text-sub max-w-md mx-auto">
          Here you can configure price tiers, features, and inspection scopes for your customers.
        </p>
      </div>
    </div>
  );
}
