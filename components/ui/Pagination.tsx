"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/types/table";

export function Pagination({
  total,
  page,
  limit,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onNextPage,
  onPrevPage,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePrev = () => {
    if (hasPrevPage) {
      if (onPrevPage) onPrevPage();
      else if (onPageChange) onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      if (onNextPage) onNextPage();
      else if (onPageChange) onPageChange(page + 1);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white border-t border-hairline font-sans text-xs sm:text-sm text-sub ${className}`}
    >
      {/* Items Range Info */}
      <div>
        Showing{" "}
        <span className="font-semibold text-main">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-semibold text-main">{total}</span> items
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={!hasPrevPage}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-hairline bg-white hover:bg-canvas text-main font-medium disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Number Badges */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isCurrent = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange && onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-semibold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white border border-hairline text-sub hover:bg-canvas hover:text-main"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-hairline bg-white hover:bg-canvas text-main font-medium disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
