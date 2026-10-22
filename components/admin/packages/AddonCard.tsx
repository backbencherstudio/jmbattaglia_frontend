"use client";

import React from "react";
import Image from "next/image";
import { AddonItem } from "@/types/packages";

interface AddonCardProps {
  item: AddonItem;
}

export function AddonCard({ item }: AddonCardProps) {
  return (
    <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between p-3">
      {/* Image Container */}
      <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-neutral-900">
        <Image
          src={item.image || "/assets/images/pool_inspection.jpg"}
          alt={item.name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title & Price Row */}
      <div className="flex items-center justify-between mt-3 px-1">
        <h3 className="font-trade font-bold text-lg sm:text-xl text-main group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <span className="font-trade font-bold text-2xl text-primary shrink-0">
          {item.price}
        </span>
      </div>
    </div>
  );
}
