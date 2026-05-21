import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "muted" | "primary" | "secondary" | "dark";
  padding?: "none" | "sm" | "md" | "lg";
  container?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = "default",
      padding = "lg",
      container = true,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-background",
      muted: "bg-muted",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-[#026df7] text-white", // legacy --theme-2
      dark: "bg-[#0b1d21] text-white", // legacy footer-bg
    };

    const paddings = {
      none: "",
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16 lg:py-20",
      lg: "py-20 md:py-[100px] lg:py-[120px]",
    };

    return (
      <section
        ref={ref}
        className={cn(variants[variant], paddings[padding], className)}
        {...props}
      >
        {container ? (
          <div className="container mx-auto px-4 md:px-6">{children}</div>
        ) : (
          children
        )}
      </section>
    );
  }
);

Section.displayName = "Section";
