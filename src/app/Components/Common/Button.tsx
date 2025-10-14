"use client";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    const baseClasses = "ui-btn";

    const variantClasses = {
      filled: "btn-filled",
      light: "btn-light",
      outline: "btn-outline",
      subtle: "btn-subtle",
      transparent: "btn-transparent",
    };

    const colorClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
      gray: "btn-gray",
    };

    const sizeClasses = {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
      xl: "btn-xl",
    };

    const radiusClasses = {
      xs: "btn-radius-xs",
      sm: "btn-radius-sm",
      md: "btn-radius-md",
      lg: "btn-radius-lg",
      xl: "btn-radius-xl",
      round: "btn-radius-round",
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      colorClasses[color],
      sizeClasses[size],
      radiusClasses[radius],
      loading && "btn-loading",
      disabled && "btn-disabled",
      fullWidth && "btn-full-width",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button className={classes} disabled={disabled || loading} {...rest}>
        {loading ? (
          <>
            <i className="bi bi-arrow-clockwise btn-spinner"></i>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="btn-left-icon">{leftIcon}</span>}
            <span className="btn-content">{children}</span>
            {rightIcon && <span className="btn-right-icon">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
