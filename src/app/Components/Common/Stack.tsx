"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Spacing = number | string;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: Spacing; // gap between children
  align?: React.CSSProperties["alignItems"]; // cross-axis alignment
  justify?: React.CSSProperties["justifyContent"]; // main-axis alignment
  wrap?: boolean; // allow wrapping
  direction?: "column" | "row"; // default column like Mantine Stack
  fullWidth?: boolean;
}

const Stack: React.FC<StackProps> = ({
  spacing = 12,
  align,
  justify,
  wrap = false,
  direction = "column",
  fullWidth = false,
  style,
  className = "",
  children,
  ...rest
}) => {
  // Map align to align-items
  const getAlignClass = () => {
    switch (align) {
      case "flex-start": return "items-start";
      case "center": return "items-center";
      case "flex-end": return "items-end";
      case "baseline": return "items-baseline";
      case "stretch": return "items-stretch";
      default: return "";
    }
  };

  // Map justify to justify-content
  const getJustifyClass = () => {
    switch (justify) {
      case "flex-start": return "justify-start";
      case "center": return "justify-center";
      case "flex-end": return "justify-end";
      case "space-between": return "justify-between";
      case "space-around": return "justify-around";
      case "space-evenly": return "justify-evenly";
      default: return "";
    }
  };

  const gapStyle = typeof spacing === "number" ? `${spacing}px` : spacing;

  return (
    <div
      className={cn(
        "flex",
        direction === "column" ? "flex-col" : "flex-row",
        getAlignClass(),
        getJustifyClass(),
        wrap ? "flex-wrap" : "flex-nowrap",
        fullWidth && "w-full",
        className
      )}
      style={{
        gap: gapStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Stack;
