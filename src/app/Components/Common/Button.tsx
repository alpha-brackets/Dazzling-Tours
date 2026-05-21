"use client";
import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "light" | "outline" | "subtle" | "transparent";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "round";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = React.memo(
  ({
    variant = "filled",
    color = "primary",
    size = "md",
    radius = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
    children,
    ...rest
  }) => {
    // Map variant
    const getVariant = () => {
      if (color === "error" && variant === "filled") return "destructive";
      if (variant === "outline") return "outline";
      if (variant === "subtle" || variant === "transparent") return "ghost";
      if (variant === "light") return "secondary";
      return "default";
    };

    // Map size
    const getSize = () => {
      if (size === "xs") return "sm"; // Shadcn doesn't have xs, use sm
      if (size === "sm") return "sm";
      if (size === "lg") return "lg";
      if (size === "xl") return "lg"; // Use lg for xl too or handle via custom padding
      return "default";
    };

    // Map custom colors and radius via Tailwind
    const colorClasses = {
      primary: "bg-[var(--theme)] text-white hover:bg-[var(--theme)]/90",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      error: "bg-red-600 text-white hover:bg-red-700",
      gray: "bg-gray-500 text-white hover:bg-gray-600",
    };

    const radiusClasses = {
      xs: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      round: "rounded-full",
    };

    const sizeClasses = {
      xs: "h-7 px-2 text-xs",
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-base",
      xl: "h-12 px-8 text-lg",
    };

    const shadcnVariant = getVariant();
    const shadcnSize = getSize();

    // If using custom color on filled/outline, we might need to override Shadcn defaults
    const useCustomColor = variant === "filled" && color !== "error";
    
    return (
      <ShadcnButton
        variant={shadcnVariant}
        size={shadcnSize}
        disabled={disabled || loading}
        className={cn(
          radiusClasses[radius],
          sizeClasses[size],
          fullWidth && "w-full",
          useCustomColor && colorClasses[color],
          variant === "outline" && color === "primary" && "border-[var(--theme)] text-[var(--theme)] hover:bg-[var(--theme)]/10",
          className
        )}
        {...rest}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </ShadcnButton>
    );
  },
);

Button.displayName = "Button";

export default Button;
