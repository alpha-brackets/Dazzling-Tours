"use client";
import React from "react";
import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "rounded";
  className?: string;
  fallbackColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  shape = "circle",
  className = "",
  fallbackColor = "#6b7280",
}) => {
  const sizeClasses = {
    xs: "h-5 w-5 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  return (
    <ShadcnAvatar
      className={cn(
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
      style={{ backgroundColor: fallbackColor }}
    >
      {src && <AvatarImage src={src} alt={alt} className="object-cover" />}
      <AvatarFallback className={cn("text-white font-medium", shapeClasses[shape])} style={{ backgroundColor: fallbackColor }}>
        {alt ? alt.substring(0, 2).toUpperCase() : (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-1/2 h-1/2 opacity-70"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;
