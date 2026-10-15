"use client";

import React, { useState } from "react";

interface VideoModalPlayerProps {
  embedUrl: string;
  isDirect: boolean;
  title: string;
}

export const VideoModalPlayer: React.FC<VideoModalPlayerProps> = ({
  embedUrl,
  isDirect,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 border border-black/10 shadow-lg shrink-0">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 text-white z-10 gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs sm:text-sm font-semibold text-gray-300">
            Loading inspection video...
          </span>
        </div>
      )}

      {isDirect ? (
        <video
          src={embedUrl}
          controls
          autoPlay
          playsInline
          onLoadedData={() => setIsLoading(false)}
          className="w-full h-full object-cover"
        />
      ) : (
        <iframe
          src={embedUrl}
          title={`${title} Overview Video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
};
