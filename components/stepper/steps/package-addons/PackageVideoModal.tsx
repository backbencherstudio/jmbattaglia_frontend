"use client";

import React, { useEffect, useId } from "react";
import { PackageOption } from "@/types/packageAddons";
import {
  VideoModalHeader,
  VideoModalPlayer,
  VideoModalDetails,
  VideoModalFooter,
  getEmbedUrl,
} from "./video-modal";

export interface PackageVideoModalProps {
  pkg: PackageOption;
  isSelected?: boolean;
  onSelectPackage?: (pkgId: string) => void;
  onClose: () => void;
}

export const PackageVideoModal: React.FC<PackageVideoModalProps> = ({
  pkg,
  isSelected = false,
  onSelectPackage,
  onClose,
}) => {
  const titleId = useId();
  const { url: embedUrl, isDirect } = getEmbedUrl(pkg.videoUrl);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Dialog Card (Bottom-sheet on mobile, centered card on tablet/desktop) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-hairline overflow-hidden z-10 flex flex-col max-h-[92dvh] sm:max-h-[90dvh] transition-all transform animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Header */}
        <VideoModalHeader
          pkg={pkg}
          titleId={titleId}
          onClose={onClose}
        />

        {/* Scrollable Body */}
        <div className="overflow-y-auto overscroll-contain p-3.5 sm:p-5 md:p-6 flex flex-col gap-3.5 sm:gap-4.5 flex-1 min-h-0">
          <VideoModalPlayer
            embedUrl={embedUrl}
            isDirect={isDirect}
            title={pkg.title}
          />

          <VideoModalDetails pkg={pkg} />
        </div>

        {/* Footer */}
        <VideoModalFooter
          pkg={pkg}
          isSelected={isSelected}
          onSelectPackage={onSelectPackage}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
