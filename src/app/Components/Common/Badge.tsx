"use client";
import React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "filled" | "light" | "outline" | "dot";
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "gray"
    | "blue";
  size?: "xs" | "sm" | "md" | "lg";
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "round";
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = React.memo(
  ({
    variant = "filled",
    color = "primary",
    size = "md",
    radius = "xl",
    className = "",
    children,
    ...rest
  }) => {
    // Map variant
    const getVariant = () => {
      if (variant === "outline") return "outline";
      if (variant === "light") return "secondary";
      return "default";
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
        blue: "bg-blue-600 text-white hover:bg-blue-700",
      },
      light: {
        primary: "bg-[var(--theme)]/10 text-[var(--theme)] hover:bg-[var(--theme)]/20",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        success: "bg-green-100 text-green-700 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        error: "bg-red-100 text-red-700 hover:bg-red-200",
        gray: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      outline: {
        primary: "border-[var(--theme)] text-[var(--theme)]",
        secondary: "border-gray-300 text-gray-700",
        success: "border-green-600 text-green-700",
        warning: "border-yellow-500 text-yellow-700",
        error: "border-red-600 text-red-700",
        gray: "border-gray-500 text-gray-700",
        blue: "border-blue-600 text-blue-700",
      },
      dot: {
        primary: "bg-transparent text-gray-700",
        secondary: "bg-transparent text-gray-700",
        success: "bg-transparent text-gray-700",
        warning: "bg-transparent text-gray-700",
        error: "bg-transparent text-gray-700",
        gray: "bg-transparent text-gray-700",
        blue: "bg-transparent text-gray-700",
      }
    };

    const sizeClasses = {
      xs: "text-[10px] px-1.5 py-0.5",
      sm: "text-xs px-2 py-0.5",
      md: "text-xs px-2.5 py-0.5",
      lg: "text-sm px-3 py-1",
    };

    const radiusClasses = {
      xs: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-full",
      round: "rounded-full",
    };

    const shadcnVariant = getVariant();

    return (
      <ShadcnBadge
        variant={shadcnVariant}
        className={cn(
          sizeClasses[size],
          radiusClasses[radius],
          colorClasses[variant][color],
          variant === "dot" && "flex items-center gap-1.5",
          className
        )}
        {...rest}
      >
        {variant === "dot" && (
          <span className={cn("h-1.5 w-1.5 rounded-full", 
            color === "primary" ? "bg-[var(--theme)]" : 
            color === "success" ? "bg-green-600" :
            color === "warning" ? "bg-yellow-500" :
            color === "error" ? "bg-red-600" : "bg-gray-400"
          )} />
        )}
        {children}
      </ShadcnBadge>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
