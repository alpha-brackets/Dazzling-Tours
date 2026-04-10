import ImageKit from "imagekit";

let imagekitInstance: ImageKit | null = null;

function getImageKit() {
  if (!imagekitInstance) {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      // Return a dummy object during build time to avoid crashes if possible,
      // but the real fix is ensuring we don't call these during build.
      // If we are here, we are actually trying to use ImageKit.
      throw new Error("Missing ImageKit environment variables.");
    }

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }
  return imagekitInstance;
}

export interface UploadOptions {
  folder?: string;
  useUniqueFileName?: boolean;
  tags?: string[];
}

export interface UploadResult {
  url: string;
  secure_url: string;
  fileId: string;
  publicId?: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Upload an image to ImageKit
 */
export async function uploadImage(
  file: string | Buffer,
  options: UploadOptions = {},
): Promise<UploadResult> {
  try {
    const ik = getImageKit();
    const response = await ik.upload({
      file: file,
      fileName: `upload-${Date.now()}`,
      folder: options.folder || "/uploads",
      useUniqueFileName: options.useUniqueFileName ?? true,
      tags: options.tags,
    });

    return {
      ...response,
      secure_url: response.url,
      publicId: response.fileId,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to upload image to ImageKit";
    console.error("ImageKit upload error:", error);
    throw new Error(message);
  }
}

/**
 * Upload multiple images to ImageKit
 */
export async function uploadMultipleImages(
  files: (string | Buffer)[],
  options: UploadOptions = {},
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, options));

  return Promise.all(uploadPromises);
}

/**
 * Delete an image from ImageKit by fileId
 */
export async function deleteImage(fileId: string): Promise<void> {
  try {
    const ik = getImageKit();
    await ik.deleteFile(fileId);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete image from ImageKit";
    console.error("ImageKit delete error:", error);
    throw new Error(message);
  }
}

/**
 * Delete multiple images from ImageKit by fileIds
 */
export async function deleteMultipleImages(fileIds: string[]): Promise<void> {
  if (!fileIds || fileIds.length === 0) return;
  try {
    const ik = getImageKit();
    await ik.bulkDeleteFiles(fileIds);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete multiple images from ImageKit";
    console.error("ImageKit bulk delete error:", error);
    throw new Error(message);
  }
}

/**
 * Extract file ID from ImageKit URL
 */
export function extractFileIdFromUrl(url: string): string | null {
  if (!url || !url.includes("ik.imagekit.io")) return null;
  return null;
}
