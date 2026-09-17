"use client";

import React from "react";
import Image from "next/image";
import { Edit, Trash2, Play } from "lucide-react";
import { PackageItem } from "@/types/packages";

interface PackageCardProps {
  item: PackageItem;
  onSelect: (item: PackageItem) => void;
  onEdit?: (item: PackageItem) => void;
  onDelete?: (item: PackageItem) => void;
}

export function PackageCard({
  item,
  onSelect,
  onEdit,
  onDelete,
}: PackageCardProps) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div className="p-3">
        {/* Thumbnail Image with Action Icons & Play Button */}
        <div className="relative w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-neutral-900">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Action Icons Top Right */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(item);
              }}
              className="p-2 bg-white/90 backdrop-blur-md rounded-lg text-main hover:text-primary transition-colors shadow-xs"
              title="Edit Package"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(item);
              }}
              className="p-2 bg-white/90 backdrop-blur-md rounded-lg text-danger hover:bg-danger-bg transition-colors shadow-xs"
              title="Delete Package"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Video Play Overlay Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-xs border border-white/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-primary" />
            </div>
          </div>
        </div>

        {/* Badges Row */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {item.isRecommended && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-md uppercase tracking-wide">
                Recommended
              </span>
            )}
            <span className="px-3 py-1 bg-[#8EA800] text-white text-xs font-bold rounded-md capitalize">
              {item.type}
            </span>
          </div>

          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              item.status === "Published"
                ? "bg-[#24B33C1F] text-[#24B33C]"
                : "bg-[#FFFAE7] text-[#BB960B]"
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Title & Price Row */}
        <div className="flex items-baseline justify-between mt-3 gap-2">
          <h3 className="font-trade font-bold text-xl sm:text-2xl text-main tracking-tight group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-trade font-bold text-2xl sm:text-3xl text-primary shrink-0">
            {item.price}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-sub mt-1.5 line-clamp-2 leading-relaxed">
          {item.shortDescription}
        </p>
      </div>
    </div>
  );
}
