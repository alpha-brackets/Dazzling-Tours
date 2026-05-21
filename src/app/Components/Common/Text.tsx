"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Font weight */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  /** Text color */
  color?:
    | "default"
    | "dimmed"
    | "muted"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  /** Text alignment */
  align?: "left" | "center" | "right" | "justify";
  /** Transform text */
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  /** Line height */
  lineHeight?: number | string;
  /** Underline text */
  underline?: boolean;
  /** Strike through text */
  strikethrough?: boolean;
  /** Italic text */
  italic?: boolean;
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Component to render as */
  component?: "p" | "span" | "div" | "label" | "strong" | "em" | "small";
  /** HTML for attribute (for labels) */
  htmlFor?: string;
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  size = "md",
  weight = 400,
  color = "default",
  align,
  transform,
  lineHeight,
  underline = false,
  strikethrough = false,
  italic = false,
  truncate = false,
  component = "p",
  className = "",
  style,
  children,
  ...rest
}) => {
  const Component = component;

  // Size mapping
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Weight mapping
  const weightClasses = {
    100: "font-thin",
    200: "font-extralight",
    300: "font-light",
    400: "font-normal",
    500: "font-medium",
    600: "font-semibold",
    700: "font-bold",
    800: "font-extrabold",
    900: "font-black",
  };

  // Color mapping
  const colorClasses = {
    default: "text-[#2c3e50]",
    dimmed: "text-gray-500",
    muted: "text-gray-400",
    primary: "text-[var(--theme)]",
    secondary: "text-gray-600",
    success: "text-green-600",
    warning: "text-yellow-500",
    error: "text-red-600",
  };

  // Align mapping
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  // Transform mapping
  const transformClasses = {
    none: "normal-case",
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
  };

  return (
    <Component
      className={cn(
        "m-0 font-sans",
        sizeClasses[size],
        weightClasses[weight],
        colorClasses[color],
        align && alignClasses[align],
        transform && transformClasses[transform],
        underline && "underline",
        strikethrough && "line-through",
        italic && "italic",
        truncate && "truncate",
        className
      )}
      style={{
        lineHeight: lineHeight,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text;
