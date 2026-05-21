"use client";
import React from "react";
import { cn } from "@/lib/utils";

type Spacing = number | string;

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: Spacing; // gap between children
  align?: React.CSSProperties["alignItems"]; // cross-axis alignment
  justify?: React.CSSProperties["justifyContent"]; // main-axis alignment
  wrap?: boolean; // allow wrapping
  grow?: boolean; // children grow equally
  position?: "left" | "center" | "right" | "apart"; // convenience
  fullWidth?: boolean;
}

const Group: React.FC<GroupProps> = ({
  spacing = 12,
  align = "center",
  justify,
  position,
  wrap = false,
  grow = false,
  fullWidth = false,
  style,
  className = "",
  children,
  ...rest
}) => {
  // Map position to justify-content
  const getJustifyClass = () => {
    if (justify) return ""; // Use inline style if specific justify is provided
    switch (position) {
      case "left": return "justify-start";
      case "center": return "justify-center";
      case "right": return "justify-end";
      case "apart": return "justify-between";
      default: return "";
    }
  };

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

  // Map spacing to gap
  const gapStyle = typeof spacing === "number" ? `${spacing}px` : spacing;

  const processedChildren = React.Children.map(children, (child) => {
    if (!grow || !React.isValidElement(child)) return child;
    const element = child as React.ReactElement<{
      style?: React.CSSProperties;
    }>;
    const prevStyle = element.props.style;
    return React.cloneElement(element, {
      style: { ...prevStyle, flex: 1, minWidth: 0 },
    });
  });

  return (
    <div
      className={cn(
        "flex flex-row",
        getAlignClass(),
        getJustifyClass(),
        wrap ? "flex-wrap" : "flex-nowrap",
        fullWidth && "w-full",
        className
      )}
      style={{
        gap: gapStyle,
        justifyContent: justify, // Override if specific justify is provided
        ...style,
      }}
      {...rest}
    >
      {processedChildren}
    </div>
  );
};

export default Group;
