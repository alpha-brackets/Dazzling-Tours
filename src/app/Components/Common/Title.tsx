"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading order (1-6), determines which HTML element to render */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Size variant (overrides order for styling) */
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Font weight */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  /** Text color */
  color?:
    | "default"
    | "dimmed"
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
  /** Component to render as */
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({
  order = 1,
  size,
  weight = 700,
  color = "default",
  align,
  transform,
  lineHeight,
  underline = false,
  component,
  className = "",
  style,
  children,
  ...rest
}) => {
  // Determine which HTML element to render
  const tagName =
    component ||
    (`h${order}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span");

  const effectiveSize = size || (`h${order}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");

  // Size mapping
  const sizeClasses = {
    h1: "text-3xl md:text-4xl font-bold", // 2rem
    h2: "text-2xl md:text-3xl font-bold", // 1.75rem
    h3: "text-xl md:text-2xl font-bold",   // 1.5rem
    h4: "text-lg md:text-xl font-bold",    // 1.25rem
    h5: "text-base md:text-lg font-bold",   // 1.125rem
    h6: "text-sm md:text-base font-bold",   // 1rem
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

  return React.createElement(
    tagName,
    {
      className: cn(
        "m-0 font-sans",
        sizeClasses[effectiveSize],
        weightClasses[weight],
        colorClasses[color],
        align && alignClasses[align],
        transform && transformClasses[transform],
        underline && "underline",
        className
      ),
      style: {
        lineHeight: lineHeight,
        ...style,
      },
      ...rest,
    },
    children,
  );
};

export default Title;
