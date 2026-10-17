import React from "react";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

interface AuthBannerProps {
  badge?: string;
  title: string;
  highlightText?: string;
  subtitle: string;
}

export function AuthBanner({
  badge = "Admin Portal",
  title,
  highlightText,
  subtitle,
}: AuthBannerProps) {
  return (
    <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-neutral-900 overflow-hidden flex-col justify-between p-12 text-white">
      <Image
        src="/assets/images/safe_home_package.jpg"
        alt="At Ease Inspections Banner"
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover opacity-85 transition-transform duration-1000 ease-out"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      {/* Top Tag */}
      <div className="relative z-10 flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 w-fit">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold tracking-wide uppercase text-white/90">
          {badge}
        </span>
      </div>

      {/* Bottom Quote & Info */}
      <div className="relative z-10 max-w-xl space-y-4 mb-6">
        <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
          {title}{" "}
          {highlightText && (
            <>
              <br />
              <span className="text-primary">{highlightText}</span>
            </>
          )}
        </h1>
        <p className="text-base text-neutral-300 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

export default AuthBanner;
