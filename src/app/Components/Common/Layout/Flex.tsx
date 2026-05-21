import React from "react";
import { cn } from "@/lib/utils";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  align?: "start" | "end" | "center" | "stretch" | "baseline";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

/**
 * Standardized Flex wrapper to replace Bootstrap flex patterns.
 */
export const Flex: React.FC<FlexProps> = ({
  children,
  direction = "row",
  justify = "start",
  align = "start",
  wrap = "nowrap",
  gap = "none",
  className,
  ...props
}) => {
  const directionMap = {
    row: "flex-row",
    col: "flex-col",
    "row-reverse": "flex-row-reverse",
    "col-reverse": "flex-col-reverse",
  };

  const justifyMap = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const alignMap = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const wrapMap = {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  };

  const gapMap = {
    none: "gap-0",
    xs: "gap-1 sm:gap-2",
    sm: "gap-2 sm:gap-3",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "flex",
        directionMap[direction],
        justifyMap[justify],
        alignMap[align],
        wrapMap[wrap],
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
