"use client";
import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "bordered" | "shadow" | "flat";
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  padding = "md",
  variant = "default",
  className = "",
  children,
  ...rest
}) => {
  const paddingClasses = {
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const variantClasses = {
    default: "bg-white border border-gray-100 rounded-xl",
    bordered: "bg-white border border-gray-200 rounded-xl",
    shadow: "bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow",
    flat: "bg-gray-50 rounded-xl",
  };

  return (
    <div
      className={cn(
        paddingClasses[padding],
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
