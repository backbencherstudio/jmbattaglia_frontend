const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const defaultApiBaseUrl = "http://localhost:8000/api/v1";

const defaultJwtSecret =
  "6d8e1a3f9b2c5d704e7f0a6b1c8d3e5f9a2b4c7d0e6f1a8b3c5d9e2f4a7b6108";

export const env = {
  apiBaseUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl,
  ),
  jwtSecret:
    process.env.JWT_SECRET ??
    process.env.NEXT_PUBLIC_JWT_SECRET ??
    defaultJwtSecret,
  mediaBaseUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? ""),
  isDev: process.env.NODE_ENV !== "production",
};

/** Keeps only the path part of a value, so `http://host:5050/a/b` becomes `/a/b`. */
const toPathname = (value: string) => {
  const match = /^[a-z][a-z\d+.-]*:\/\/[^/]*(\/.*)?$/i.exec(value);
  return match ? (match[1] ?? "/") : value;
};

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const resolveMediaUrl = (pathOrUrl?: string | null) => {
  const raw = pathOrUrl?.trim();
  if (!raw || !env.mediaBaseUrl) return raw ?? null;

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  const basePath = trimSlashes(toPathname(env.mediaBaseUrl));
  let storagePath = trimSlashes(toPathname(raw));

  if (
    basePath &&
    (storagePath === basePath || storagePath.startsWith(`${basePath}/`))
  ) {
    storagePath = trimSlashes(storagePath.slice(basePath.length));
  }

  if (!storagePath) return null;

  return `${env.mediaBaseUrl}/${storagePath}`;
};
