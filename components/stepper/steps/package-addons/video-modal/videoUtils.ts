/**
 * Normalizes video URLs to embeddable player URLs.
 * Handles standard YouTube watch links, shortened youtu.be, Vimeo, direct embeds, or provides fallback.
 * Includes playsinline=1 for smooth playback on iOS & mobile browsers.
 */
export function getEmbedUrl(rawUrl?: string): { url: string; isDirect: boolean } {
  if (!rawUrl || rawUrl.trim() === "") {
    return {
      url: "https://www.youtube-nocookie.com/embed/x5B2XZ7PIGQ?autoplay=1&playsinline=1&rel=0&modestbranding=1",
      isDirect: false,
    };
  }

  const trimmed = rawUrl.trim();

  // Check direct MP4/WebM video file
  if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
    return { url: trimmed, isDirect: true };
  }

  // Already a YouTube embed URL
  if (trimmed.includes("youtube.com/embed/") || trimmed.includes("youtube-nocookie.com/embed/")) {
    const sep = trimmed.includes("?") ? "&" : "?";
    return {
      url: `${trimmed}${sep}autoplay=1&playsinline=1&rel=0&modestbranding=1`,
      isDirect: false,
    };
  }

  // YouTube watch or short links
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/)([\w-]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      url: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&playsinline=1&rel=0&modestbranding=1`,
      isDirect: false,
    };
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&playsinline=1`,
      isDirect: false,
    };
  }

  return { url: trimmed, isDirect: false };
}
