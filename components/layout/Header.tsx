import React from "react";
import { PhoneCall } from "lucide-react";
import Image from "next/image";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[var(--layout-bg,#FFFFFF)] border-b border-[var(--border-hairline,#E3E3E1)] py-3 px-4 sm:px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/assets/images/logo.png"
          alt="At Ease Inspections Logo"
          width={140}
          height={45}
          className="w-24 sm:w-28 md:w-36 h-auto object-contain"
          priority
        />
      </div>

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="hidden sm:inline text-[var(--text-secondary,#555555)] font-medium">
          Need help?
        </span>
        <a
          href="tel:7707656869"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[var(--brand-primary-subtle,#FFE9D6)]/70 border border-[var(--brand-primary,#FF6900)]/20 text-[var(--brand-primary,#FF6900)] font-bold text-xs sm:text-sm transition-all hover:bg-[var(--brand-primary-subtle,#FFE9D6)] hover:border-[var(--brand-primary,#FF6900)]/40 shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--brand-primary,#FF6900)]" />
          <span>(770) 765-6869</span>
        </a>
      </div>
    </header>
  );
};
