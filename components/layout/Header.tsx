import React from "react";
import { PhoneCall } from "lucide-react";
import Image from "next/image";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-layout-bg border-b border-hairline py-3 px-4 sm:px-6 md:px-12">
      <div className="max-w-376 w-full mx-auto flex items-center justify-between">
        <div className="w-full flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="At Ease Inspections Logo"
            width={140}
            height={45}
            className="w-24 sm:w-28 md:w-32 h-14 object-contain"
            priority
          />
        </div>

        <div className="w-full flex items-center gap-2 text-base sm:text-sm justify-end">
          <span className="hidden sm:inline text-sub font-medium">
            Need help?
          </span>
          <a
            href="tel:7707656869"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-primary-subtle/70 border border-primary/20 text-primary font-bold text-xs sm:text-sm transition-all hover:bg-primary-subtle hover:border-primary/40 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span>(770) 765-6869</span>
          </a>
        </div>
      </div>
    </header>
  );
};
