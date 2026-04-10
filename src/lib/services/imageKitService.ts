import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export interface UploadOptions {
  folder?: string;
  useUniqueFileName?: boolean;
  tags?: string[];
}

export interface UploadResult {
  url: string;
  secure_url: string; // Add for compatibility with Cloudinary logic
  fileId: string;
  publicId?: string; // Add for compatibility
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
    const response = await imagekit.upload({
      file: file, // can be a string (base64) or a Buffer
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
    const message = error instanceof Error ? error.message : "Failed to upload image to ImageKit";
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
  const uploadPromises = files.map((file) =>
    uploadImage(file, options),
  );

  return Promise.all(uploadPromises);
}

/**
 * Delete an image from ImageKit by fileId
 */
export async function deleteImage(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete image from ImageKit";
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
    await imagekit.bulkDeleteFiles(fileIds);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete multiple images from ImageKit";
    console.error("ImageKit bulk delete error:", error);
    throw new Error(message);
  }
}

/**
 * Extract file ID from ImageKit URL (if stored as URL)
 * ImageKit URLs usually look like: https://ik.imagekit.io/yhtvshsh/folder/filename.jpg
 * Unfortunately, ImageKit URLs don't contain the fileId needed for deletion.
 * Typically, we should store the fileId in the database along with the URL for deletion.
 * If we only have the URL, we might need to search using the listFiles API.
 */
export function extractFileIdFromUrl(url: string): string | null {
  if (!url || !url.includes("ik.imagekit.io")) return null;
  // This is a placeholder as fileId isn't in the URL.
  // In a real app, you should store fileId alongside the URL.
  return null;
}
