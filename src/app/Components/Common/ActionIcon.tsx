"use client";
import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ActionIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "light" | "outline" | "subtle" | "transparent";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "round";
  loading?: boolean;
  children: React.ReactNode;
}

const ActionIcon: React.FC<ActionIconProps> = React.memo(
  ({
    variant = "filled",
    color = "primary",
    size = "md",
    radius = "md",
    loading = false,
    disabled = false,
    className = "",
    children,
    ...rest
  }) => {
    // Map variant to Shadcn Button variants
    const getVariant = () => {
      if (variant === "outline") return "outline";
      if (variant === "subtle" || variant === "transparent") return "ghost";
      return "default"; // For filled and light, we'll use custom classes
    };

    // Map custom colors via Tailwind
    const colorClasses = {
      filled: {
        primary: "bg-[var(--theme)] text-white hover:bg-[var(--theme)]/90",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
        error: "bg-red-600 text-white hover:bg-red-700",
        gray: "bg-gray-500 text-white hover:bg-gray-600",
      },
      light: {
        primary: "bg-[var(--theme)]/10 text-[var(--theme)] hover:bg-[var(--theme)]/20",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        success: "bg-green-100 text-green-700 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        error: "bg-red-100 text-red-700 hover:bg-red-200",
        gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      outline: {
        primary: "border-[var(--theme)] text-[var(--theme)] hover:bg-[var(--theme)]/10",
        secondary: "border-gray-300 text-gray-700 hover:bg-gray-50",
        success: "border-green-600 text-green-700 hover:bg-green-50",
        warning: "border-yellow-500 text-yellow-700 hover:bg-yellow-50",
        error: "border-red-600 text-red-700 hover:bg-red-50",
        gray: "border-gray-500 text-gray-700 hover:bg-gray-50",
      },
      subtle: {
        primary: "text-[var(--theme)] hover:bg-[var(--theme)]/10",
        secondary: "text-gray-700 hover:bg-gray-100",
        success: "text-green-700 hover:bg-green-100",
        warning: "text-yellow-700 hover:bg-yellow-100",
        error: "text-red-700 hover:bg-red-100",
        gray: "text-gray-700 hover:bg-gray-100",
      },
      transparent: {
        primary: "text-[var(--theme)]",
        secondary: "text-gray-700",
        success: "text-green-700",
        warning: "text-yellow-700",
        error: "text-red-700",
        gray: "text-gray-700",
      }
    };

    const sizeClasses = {
      xs: "h-6 w-6 p-0",
      sm: "h-8 w-8 p-0",
      md: "h-10 w-10 p-0",
      lg: "h-12 w-12 p-0",
      xl: "h-14 w-14 p-0",
    };

    const radiusClasses = {
      xs: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      round: "rounded-full",
    };

    const shadcnVariant = getVariant();

    return (
      <ShadcnButton
        variant={shadcnVariant}
        size="icon"
        disabled={disabled || loading}
        className={cn(
          sizeClasses[size],
          radiusClasses[radius],
          variant === "filled" || variant === "light" ? colorClasses[variant][color] : "",
          variant === "outline" || variant === "subtle" || variant === "transparent" ? colorClasses[variant][color] : "",
          className
        )}
        {...rest}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          children
        )}
      </ShadcnButton>
    );
  },
);

ActionIcon.displayName = "ActionIcon";

export default ActionIcon;
