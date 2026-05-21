"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingProps {
  variant?: "spinner" | "dots" | "skeleton" | "pulse";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  color = "primary",
  text,
  fullScreen = false,
  className = "",
}) => {
  const sizeValues = {
    xs: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    primary: "text-[var(--theme)]",
    secondary: "text-gray-500",
    success: "text-green-600",
    warning: "text-yellow-500",
    error: "text-red-600",
    gray: "text-gray-400",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const renderSpinner = () => (
    <Loader2 className={cn("animate-spin", sizeValues[size], colorClasses[color])} />
  );

  const renderDots = () => (
    <div className="flex gap-1 items-center justify-center">
      <div className={cn("rounded-full animate-bounce [animation-delay:-0.3s]", size === "xs" || size === "sm" ? "h-1 w-1" : "h-2 w-2", colorClasses[color])} style={{ backgroundColor: 'currentColor' }}></div>
      <div className={cn("rounded-full animate-bounce [animation-delay:-0.15s]", size === "xs" || size === "sm" ? "h-1 w-1" : "h-2 w-2", colorClasses[color])} style={{ backgroundColor: 'currentColor' }}></div>
      <div className={cn("rounded-full animate-bounce", size === "xs" || size === "sm" ? "h-1 w-1" : "h-2 w-2", colorClasses[color])} style={{ backgroundColor: 'currentColor' }}></div>
    </div>
  );

  const renderSkeleton = () => (
    <Skeleton className={cn(sizeValues[size], "rounded-md")} />
  );

  const renderPulse = () => (
    <div className={cn("animate-pulse rounded-full", sizeValues[size], colorClasses[color])} style={{ backgroundColor: 'currentColor', opacity: 0.5 }}></div>
  );

  const renderLoading = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "skeleton":
        return renderSkeleton();
      case "pulse":
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const containerClasses = cn(
    "flex flex-col items-center justify-center",
    fullScreen && "fixed inset-0 bg-white/80 backdrop-blur-sm z-50",
    className
  );

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-center">
        {renderLoading()}
      </div>
      {text && (
        <div className={cn("mt-2 font-medium", textSizeClasses[size], colorClasses[color])}>
          {text}
        </div>
      )}
    </div>
  );
};

// Preset loading components for common use cases
export const LoadingSpinner: React.FC<Omit<LoadingProps, "variant">> = (
  props,
) => <Loading variant="spinner" {...props} />;

export const LoadingDots: React.FC<Omit<LoadingProps, "variant">> = (props) => (
  <Loading variant="dots" {...props} />
);

export const LoadingSkeleton: React.FC<Omit<LoadingProps, "variant">> = (
  props,
) => <Loading variant="skeleton" {...props} />;

export const LoadingPulse: React.FC<Omit<LoadingProps, "variant">> = (
  props,
) => <Loading variant="pulse" {...props} />;

// Full screen loading overlay
export const LoadingOverlay: React.FC<Omit<LoadingProps, "fullScreen">> = (
  props,
) => <Loading fullScreen={true} {...props} />;

export default Loading;
