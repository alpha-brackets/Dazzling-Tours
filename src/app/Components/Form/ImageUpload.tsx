"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useNotification, useUploadImages, useDeleteImage } from "@/lib/hooks";
import { Group, ActionIcon } from "../Common";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, UploadCloud, X } from "lucide-react";
import { ImageVariant, IMAGE_DIMENSIONS } from "@/lib/constants/imageDimensions";

export interface ImageUploadProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  value?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
  disabled?: boolean;
  variant?: ImageVariant;
}

const ImageUpload: React.FC<ImageUploadProps> = React.memo(
  ({
    label,
    description,
    error,
    required = false,
    multiple = true,
    maxFiles = 3,
    maxSize = 5, // 5MB default
    acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
    value = [],
    onChange,
    className = "",
    disabled = false,
    variant,
  }) => {
    const { showError, showSuccess } = useNotification();
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);

    const uploadMutation = useUploadImages();
    const deleteMutation = useDeleteImage();

    // Update ref when onChange changes
    React.useEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    // Clear input value when component unmounts
    React.useEffect(() => {
      const input = fileInputRef.current;
      return () => {
        if (input) {
          input.value = "";
        }
      };
    }, []);

    const handleFileSelect = useCallback(
      async (files: FileList | null) => {
        if (!files || disabled || uploadMutation.isPending) {
          return;
        }

        const fileArray = Array.from(files);

        const validFiles: File[] = [];

        for (const file of fileArray) {
          if (!acceptedTypes.includes(file.type)) {
            showError(`${file.name} is not a supported image type`);
            continue;
          }
          if (file.size > maxSize * 1024 * 1024) {
            showError(
              `${file.name} is too large. Maximum size is ${maxSize}MB`,
            );
            continue;
          }

          if (variant) {
            const expected = IMAGE_DIMENSIONS[variant];
            const isValidDimensions = await new Promise<boolean>((resolve) => {
              const img = new window.Image();
              img.src = URL.createObjectURL(file);
              img.onload = () => {
                URL.revokeObjectURL(img.src);
                resolve(img.width === expected.width && img.height === expected.height);
              };
              img.onerror = () => {
                URL.revokeObjectURL(img.src);
                resolve(false);
              };
            });

            if (!isValidDimensions) {
              showError(`${file.name} does not match required dimensions of ${expected.width}x${expected.height}px.`);
              continue;
            }
          }

          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          return;
        }

        // Check total file count
        if (value.length + validFiles.length > maxFiles) {
          showError(`Maximum ${maxFiles} images allowed`);
          return;
        }

        // Create FormData and upload

        try {
          // Upload files to Cloudinary via mutation
          const formData = new FormData();
          validFiles.forEach((file) => {
            formData.append("files", file);
          });

          const result = await uploadMutation.mutateAsync(formData);

          // Extract URLs from Cloudinary response
          const newUrls = result.data.map((item) => item.url);

          const updatedUrls = multiple ? [...value, ...newUrls] : newUrls;

          // Call onChange using ref to avoid dependency issues
          onChangeRef.current?.(updatedUrls);
          showSuccess("Images uploaded successfully");

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } catch (err) {
          console.error("Error uploading files:", err);
          showError(
            err instanceof Error
              ? err.message
              : "Error uploading images. Please try again.",
          );
        }
      },
      [value, multiple, maxFiles, maxSize, acceptedTypes, disabled, showError, showSuccess, uploadMutation, variant],
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFileSelect(e.dataTransfer.files);
      },
      [handleFileSelect],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
          handleFileSelect(files);
        }
      },
      [handleFileSelect],
    );

    const removeImage = useCallback(
      async (index: number) => {
        if (disabled || deleteMutation.isPending) return;

        const imageUrl = value[index];

        // Optimistically update UI
        const newUrls = value.filter((_, i) => i !== index);

        if (onChangeRef.current) {
          onChangeRef.current(newUrls);
        } else if (onChange) {
          onChange(newUrls);
        }

        // Call API to delete from Cloudinary via mutation
        try {
          await deleteMutation.mutateAsync({ url: imageUrl });
        } catch (err) {
          console.error("Error calling delete API:", err);
        }
      },
      [value, disabled, onChange, deleteMutation],
    );

    const canAddMore = value.length < maxFiles;

    const handleUploadAreaClick = useCallback(() => {
      if (disabled || !canAddMore || uploadMutation.isPending) return;
      fileInputRef.current?.click();
    }, [disabled, canAddMore, uploadMutation.isPending]);

    const isUploading = uploadMutation.isPending;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full", className)}>
        {label && (
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        {description && <p className="text-xs text-gray-500">{description}</p>}

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer min-h-[150px]",
            isDragOver && "border-[var(--theme)] bg-[var(--theme)]/5",
            (disabled || isUploading) && "opacity-50 cursor-not-allowed bg-gray-50",
            canAddMore && !isUploading && "hover:border-[var(--theme)] hover:bg-gray-50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadAreaClick}
          style={{ cursor: disabled || !canAddMore || isUploading ? "default" : "pointer" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <div className="flex flex-col items-center text-center gap-1">
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-[var(--theme)] animate-spin" />
            ) : (
              <UploadCloud className="h-8 w-8 text-gray-400" />
            )}
            <p className="text-sm font-medium text-gray-700">
              {isUploading
                ? "Uploading..."
                : value.length > 0
                  ? `${value.length} image${value.length === 1 ? "" : "s"
                  } selected • Click here to add more`
                  : canAddMore
                    ? "Drag images here or click to select"
                    : `Maximum ${maxFiles} images reached`}
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.join(", ")} • Max {maxSize}MB each
            </p>
            {variant && (
              <p className="text-xs font-bold text-[#EF7C00] mt-1">
                Required Dimensions: {IMAGE_DIMENSIONS[variant].label}
              </p>
            )}
          </div>
        </div>

        {/* Image Preview Grid */}
        {value.length > 0 && (
          <Group className="mt-2 flex-wrap">
            {value.map((url, index) => (
              <div
                key={index}
                className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
              >
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
                {!disabled && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ActionIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      title="Remove image"
                      disabled={deleteMutation.isPending}
                      variant="subtle"
                      color="error"
                      size="sm"
                      className="text-white hover:text-red-500 bg-white/20 hover:bg-white"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </ActionIcon>
                  </div>
                )}
              </div>
            ))}
          </Group>
        )}

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  },
);

ImageUpload.displayName = "ImageUpload";

export default ImageUpload;
