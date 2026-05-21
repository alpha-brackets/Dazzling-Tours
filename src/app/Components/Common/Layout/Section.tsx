import React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  bg?: "default" | "muted" | "primary" | "dark";
}

/**
 * Standard Section component for consistent vertical padding.
 * Replaces .section-padding custom class.
 */
export const Section: React.FC<SectionProps> = ({
  children,
  padding = "lg",
  bg = "default",
  className,
  ...props
}) => {
  const paddingMap = {
    none: "",
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
    xl: "py-24 md:py-32",
  };

  const bgMap = {
    default: "bg-background",
    muted: "bg-muted",
    primary: "bg-primary text-primary-foreground",
    dark: "bg-slate-900 text-white",
  };

  return (
    <section
      className={cn(paddingMap[padding], bgMap[bg], className)}
      {...props}
    >
      {children}
    </section>
  );
};
