import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center" | "right";
}

export const SectionHeading = React.forwardRef<
  HTMLDivElement,
  SectionHeadingProps
>(({ className, title, subtitle, align = "center", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 mb-8 md:mb-12 flex flex-col gap-2 md:gap-3",
        align === "center" && "text-center items-center",
        align === "left" && "text-left items-start",
        align === "right" && "text-right items-end",
        className
      )}
      {...props}
    >
      {subtitle && (
        <span className="text-primary font-heading text-lg md:text-[22px] font-normal capitalize block tracking-wide">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground m-0 leading-tight">
        {title}
      </h2>
    </div>
  );
});

SectionHeading.displayName = "SectionHeading";
