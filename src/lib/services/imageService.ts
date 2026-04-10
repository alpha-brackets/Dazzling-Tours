import * as imagekit from "./imageKitService";
import { ImageProvider } from "../enums/imageProvider";

// Use environment variable to determine active provider, default to ImageKit
const ACTIVE_PROVIDER =
  (process.env.NEXT_PUBLIC_IMAGE_PROVIDER as ImageProvider) ||
  ImageProvider.IMAGEKIT;

/**
 * Unified image service to manage uploads and deletions across multiple providers.
 * You can switch providers globally just by changing the environment variable.
 */
export const imageService = {
  /**
   * Status check for the active provider
   */
  getProvider: () => ACTIVE_PROVIDER,

  /**
   * Upload an image to the enabled provider
   */
  async upload(
    file: string | Buffer,
    options: imagekit.UploadOptions = {},
  ): Promise<imagekit.UploadResult> {
    return imagekit.uploadImage(file, options);
  },

  /**
   * Delete an image by its URL or public/file ID
   */
  async delete(urlOrId: string): Promise<void> {
    if (!urlOrId) return;

    // ImageKit deletion requires fileId. If urlOrId is a URL, we attempt to handle it.
    if (urlOrId.includes("http")) {
      // If we only have URL, we can't easily delete from ImageKit without fileId.
      // We can try to extract ID from URL if it's an ImageKit URL
      const id = this.extractId(urlOrId);
      if (id) {
        return imagekit.deleteImage(id);
      }
      console.warn("Attempting to delete image from ImageKit with a URL. ImageKit requires fileId for deletion.");
      return;
    }
    return imagekit.deleteImage(urlOrId);
  },

  /**
   * Delete multiple images by their URLs or IDs
   */
  async deleteMultiple(urlsOrIds: string[]): Promise<void> {
    if (!urlsOrIds || urlsOrIds.length === 0) return;

    // Filter out URLs as ImageKit needs fileId
    const fileIds = urlsOrIds.map(urlOrId => {
      if (urlOrId.includes("http")) {
        return this.extractId(urlOrId);
      }
      return urlOrId;
    }).filter((id): id is string => id !== null);

    if (fileIds.length > 0) {
      return imagekit.deleteMultipleImages(fileIds);
    }
  },

  /**
   * Helper to extract a unique ID from a provider's URL
   */
  extractId(url: string | null): string | null {
    if (!url) return null;

    if (url.includes("ik.imagekit.io")) {
      return imagekit.extractFileIdFromUrl(url);
    }

    return null;
  },
};
