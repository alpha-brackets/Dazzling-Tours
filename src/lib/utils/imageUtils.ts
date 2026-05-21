/**
 * Focused on ImageKit integration and avoiding base64 data URLs.
 */

export const IMAGEKIT_URL_ENDPOINT = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").replace(/\/$/, "");

/**
 * Check if a string is a data URL (base64 encoded image)
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
 */
export function filterValidImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== "string") return "";
  if (!isValidImageUrl(url)) return "";
  return url.trim();
}

/**
 * Extract an ID from an image URL for deletion purposes
 */
export function extractImageId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  if (isImageKitUrl(url)) {
    return url.split("/").pop() || null;
  }
  return null;
}

/**
 * Helper to get an optimized image URL
 */
export function getOptimizedImage(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
): string {
  if (!url) return "";
  if (url.startsWith("/assets/")) {
    const proxiedUrl = `${IMAGEKIT_URL_ENDPOINT}${url}`;
    return transformImageKit(proxiedUrl, width, height, quality);
  }
  if (isImageKitUrl(url)) {
    return transformImageKit(url, width, height, quality);
  }
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
  transformations.push("f-auto");

  const trString = `tr=${transformations.join(",")}`;
  return url.includes("?") ? `${url}&${trString}` : `${url}?${trString}`;
}
