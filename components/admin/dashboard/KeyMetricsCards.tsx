"use client";

import React from "react";
import { Package, Globe, FileEdit, Plus, Eye, Layers } from "lucide-react";

export function KeyMetricsCards() {
  return (
    <div className="space-y-4">
      {/* Key Metrics Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-main">Key Metrics</h2>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New package</span>
          </button>

          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-white border border-hairline hover:bg-canvas text-main text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer">
            <Eye className="w-4 h-4 text-sub" />
            <span>Review 1 draft</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Total packages */}
        <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-hairline flex items-center justify-between shadow-xs">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs font-medium text-sub">Total packages</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-main">6</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Card 2: Live on portal */}
        <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-hairline flex items-center justify-between shadow-xs">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs font-medium text-sub">Live on portal</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-main">5</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Card 3: In draft */}
        <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-hairline flex items-center justify-between shadow-xs">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs font-medium text-sub">In draft</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-main">1</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shrink-0">
            <FileEdit className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Card 4: Add on Services */}
        <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-hairline flex items-center justify-between shadow-xs">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xs font-medium text-sub">Add on Services</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-main">8</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-lime-50 text-lime-600 flex items-center justify-center border border-lime-100 shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
