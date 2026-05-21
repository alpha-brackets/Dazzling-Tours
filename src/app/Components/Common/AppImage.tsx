import React from "react";
import Image, { ImageProps } from "next/image";
import { ImageVariant } from "@/lib/constants/imageDimensions";
import { cn } from "@/lib/utils";

export interface AppImageProps extends Omit<ImageProps, "fill" | "width" | "height"> {
  variant: ImageVariant;
  containerClassName?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

const getVariantClasses = (variant: ImageVariant) => {
  switch (variant) {
    case ImageVariant.HERO:
      return "aspect-video md:aspect-[21/9]"; // Flexible hero, defaults to 16:9 on mobile, wider on desktop
    case ImageVariant.CARD:
      return "aspect-[4/3]";
    case ImageVariant.THUMBNAIL:
      return "aspect-square";
    case ImageVariant.AVATAR:
      return "aspect-square rounded-full";
    default:
      return "aspect-square";
  }
};

export const AppImage: React.FC<AppImageProps> = ({
  variant,
  containerClassName,
  imageClassName,
  children,
  alt,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden w-full",
        getVariantClasses(variant),
        containerClassName
      )}
    >
      <Image
        fill
        className={cn("object-cover", imageClassName)}
        alt={alt || "Image"}
        {...props}
      />
      {children}
    </div>
  );
};
