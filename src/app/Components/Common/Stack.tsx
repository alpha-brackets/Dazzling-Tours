"use client";
import React from "react";

type Spacing = number | string;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: Spacing; // gap between children
  align?: React.CSSProperties["alignItems"]; // cross-axis alignment
  justify?: React.CSSProperties["justifyContent"]; // main-axis alignment
  wrap?: boolean; // allow wrapping
  direction?: "column" | "row"; // default column like Mantine Stack
  fullWidth?: boolean;
}

const toGap = (spacing?: Spacing) => {
  if (spacing === undefined) return undefined;
  return typeof spacing === "number" ? `${spacing}px` : spacing;
};

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
  const mergedStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? "wrap" : "nowrap",
    gap: toGap(spacing),
    width: fullWidth ? "100%" : undefined,
    ...style,
  };

  return (
    <div
      className={`ui-stack ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Stack;
