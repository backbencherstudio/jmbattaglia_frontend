import React from "react";
import Image from "next/image";

interface AuthHeaderProps {
  stepBadge?: string;
  title: string;
  subtitle: string;
}

export function AuthHeader({ stepBadge, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-start space-y-3">
      <div className="relative w-48 h-14">
        <Image
          src="/assets/images/logo.png"
          alt="At Ease Inspections Logo"
          fill
          sizes="192px"
          className="object-contain object-left"
          priority
        />
      </div>
      <div>
        {stepBadge && (
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {stepBadge}
            </span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold text-main tracking-tight mt-1.5">
          {title}
        </h2>
        <p className="text-sm text-sub mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default AuthHeader;
