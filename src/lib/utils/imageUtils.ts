/**
 * Focused on ImageKit integration and avoiding base64 data URLs.
 */

export const IMAGEKIT_URL_ENDPOINT =
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.endsWith("/")
    ? process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT.slice(0, -1)
    : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
      "https://ik.imagekit.io/ojifgauic";

/**
 * Check if a string is a data URL (base64 encoded image)
 * Data URLs start with "data:" and should NOT be stored in MongoDB
 */
export function isDataUrl(url: string): boolean {
  return typeof url === "string" && url.startsWith("data:");
}

/**
 * Check if a URL is from ImageKit
 */
export function isImageKitUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("ik.imagekit.io");
}

/**
 * Check if a URL is valid (not a data URL and is an absolute URL)
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (isDataUrl(url)) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    // If it's a relative path, we consider it valid (local assets)
    return url.startsWith("/");
  }
}

/**
 * Filter an array of image URLs
 */
export function filterValidImageUrls(urls: unknown[]): string[] {
  if (!urls || !Array.isArray(urls)) return [];
  return urls
    .filter(
      (url): url is string => typeof url === "string" && isValidImageUrl(url),
    )
    .map((url) => url.trim());
}

/**
 * Filter out data URLs from a single image URL
 * Returns the URL if valid, or empty string if not
 */
export function filterValidImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  if (!isValidImageUrl(url)) return "";
  return url.trim();
}

/**
 * Extract an ID from an image URL for deletion purposes
 * Focused on ImageKit file IDs.
 */
export function extractImageId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  if (isImageKitUrl(url)) {
    // Attempt to extract the last part of the path
    // Note: Official ImageKit deletion requires fileId which isn't ALWAYS the filename.
    // However, if the user didn't store the fileId, this is our best guess.
    return url.split("/").pop() || null;
  }

  return null;
}

/**
 * Helper to get an optimized image URL
 * If the image is local (/assets/...), it can be proxied through ImageKit ifconfigured.
 * If it's already an ImageKit URL, it applies transformations.
 */
export function getOptimizedImage(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
): string {
  if (!url) return "";

  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  // If ImageKit is not configured, return the Original URL
  if (!urlEndpoint) return url;

  // Handle local images by proxying them through ImageKit
  if (url.startsWith("/assets/")) {
    const proxiedUrl = `${IMAGEKIT_URL_ENDPOINT}${url}`;
    return transformImageKit(proxiedUrl, width, height, quality);
  }

  // If it's already an ImageKit URL, just transform it
  if (isImageKitUrl(url)) {
    return transformImageKit(url, width, height, quality);
  }

  // For other URLs (like external ones), we return as is
  // (Unless they are also proxied via ImageKit)
  return url;
}

/**
 * Helper to get a transformed ImageKit URL
 */
export function transformImageKit(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
): string {
  if (!url || !isImageKitUrl(url)) return url;

  const transformations = [];
  if (width) transformations.push(`w-${width}`);
  if (height) transformations.push(`h-${height}`);
  transformations.push(`q-${quality}`);
  transformations.push("f-auto"); // Auto format

  const trString = `tr=${transformations.join(",")}`;

  // If URL already has queries, append with &, else with ?
  return url.includes("?") ? `${url}&${trString}` : `${url}?${trString}`;
}
