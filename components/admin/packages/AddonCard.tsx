"use client";

import React from "react";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { AddonItem } from "@/types/packages";
import type { ApiAddonItem } from "@/types/addons";
import { formatAddonPrice, getAddonImage } from "@/types/addons";

export interface AddonCardProps {
  item: AddonItem | ApiAddonItem;
  onEdit?: (item: AddonItem | ApiAddonItem) => void;
  onDelete?: (item: AddonItem | ApiAddonItem) => void;
}

export function AddonCard({ item, onEdit, onDelete }: AddonCardProps) {
  const isApiItem = "priceCents" in item || "status" in item || "kind" in item;
  const name = item.name;
  const price = isApiItem ? formatAddonPrice(item as ApiAddonItem) : item.price;
  const image = isApiItem ? getAddonImage(item as ApiAddonItem) : item.image;
  const status = isApiItem ? (item as ApiAddonItem).status : undefined;
  const description = isApiItem ? (item as ApiAddonItem).description : undefined;

  const statusLabel =
    status === "DRAFT"
      ? "Draft"
      : status === "ARCHIVED"
      ? "Archived"
      : status === "PUBLISHED"
      ? "Published"
      : null;

  return (
    <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between p-3 relative">
      {/* Status Badge if not Published */}
      {statusLabel && statusLabel !== "Published" && (
        <div className="absolute top-5 left-5 z-10">
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-md shadow-xs ${
              statusLabel === "Draft"
                ? "bg-amber-100/90 text-amber-800 border border-amber-300/50 backdrop-blur-xs"
                : "bg-neutral-200/90 text-neutral-700 border border-neutral-300/50 backdrop-blur-xs"
            }`}
          >
            {statusLabel}
          </span>
        </div>
      )}

      {/* Image Container with Action Icons */}
      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-neutral-900 group/thumb">
        <Image
          src={image || "/assets/images/pool_inspection.jpg"}
          alt={name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Action Icons Top Right (matching PackageCard style) */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(item);
            }}
            className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg text-main hover:text-primary transition-colors shadow-xs cursor-pointer"
            title="Edit Add-on"
            aria-label="Edit Add-on"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(item);
            }}
            className="p-2 bg-white/90 hover:bg-white backdrop-blur-md rounded-lg text-danger hover:bg-danger-bg transition-colors shadow-xs cursor-pointer"
            title="Delete Add-on"
            aria-label="Delete Add-on"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3 px-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-trade font-bold text-lg sm:text-xl text-main group-hover:text-primary transition-colors leading-snug line-clamp-1">
            {name}
          </h3>
          <span className="font-trade font-bold text-xl sm:text-2xl text-primary shrink-0">
            {price}
          </span>
        </div>

        {description && description.trim() && description !== name && (
          <p className="text-xs text-sub line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddonCard;
