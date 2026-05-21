import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
}

/**
 * Standard Container component to replace Bootstrap's .container and .container-fluid
 * Forces a max-width and handles responsive padding globally.
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  fluid = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        !fluid && "max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
