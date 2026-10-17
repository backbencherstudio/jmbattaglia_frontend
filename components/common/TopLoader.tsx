import React from "react";
import NextTopLoader from "nextjs-toploader";

export interface TopLoaderProps {
  /**
   * Color for the TopLoader bar and shadow glow.
   * Matches the brand primary color (#FF6900).
   */
  color?: string;
  /**
   * The initial position for the TopLoader in percentage (0.08 is 8%).
   */
  initialPosition?: number;
  /**
   * The increment delay speed in milliseconds.
   */
  crawlSpeed?: number;
  /**
   * Height of the top loader bar in pixels.
   */
  height?: number;
  /**
   * Auto-incrementing behaviour for the TopLoader.
   */
  crawl?: boolean;
  /**
   * Whether to show the top-right spinner circle.
   */
  showSpinner?: boolean;
  /**
   * Animation easing function.
   */
  easing?: string;
  /**
   * Animation speed in milliseconds.
   */
  speed?: number;
  /**
   * Box-shadow glow for the loader head.
   */
  shadow?: string;
  /**
   * z-index of the loader.
   */
  zIndex?: number;
}

export function TopLoader({
  color = "#FF6900",
  initialPosition = 0.08,
  crawlSpeed = 200,
  height = 3,
  crawl = true,
  showSpinner = false,
  easing = "ease",
  speed = 200,
  shadow = "0 0 10px #FF6900, 0 0 5px #FF6900",
  zIndex = 99999,
}: TopLoaderProps) {
  return (
    <NextTopLoader
      color={color}
      initialPosition={initialPosition}
      crawlSpeed={crawlSpeed}
      height={height}
      crawl={crawl}
      showSpinner={showSpinner}
      easing={easing}
      speed={speed}
      shadow={shadow}
      zIndex={zIndex}
    />
  );
}

export default TopLoader;
