import React from "react";
import { Layers, Plus } from "lucide-react";

export default function AddOnServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-main">Add-on Services</h2>
          <p className="text-sm text-sub mt-1">
            Manage optional inspection add-ons like Radon, Mold, Termite, and Pool inspections.
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add New Add-on</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-hairline text-center space-y-4">
        <div className="w-16 h-16 bg-lime-50 text-lime-600 rounded-2xl flex items-center justify-center mx-auto">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-main">Add-on Services Configured</h3>
        <p className="text-sm text-sub max-w-md mx-auto">
          Add-on services appear during the public inspection scheduling flow in Step 3.
        </p>
      </div>
    </div>
  );
}
