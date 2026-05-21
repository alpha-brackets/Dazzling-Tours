"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "onChange" | "onBlur" | "onFocus" | "value"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  showCharCount?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
  // Form integration props
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      error,
      required = false,
      size = "md",
      variant = "default",
      disabled = false,
      className = "",
      maxLength,
      showCharCount = false,
      resize = "vertical",
      // Form integration props
      value: formValue,
      onChange: formOnChange,
      onBlur: formOnBlur,
      onFocus: formOnFocus,
      ...props
    },
    ref,
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>(
      error,
    );

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    const sizeClasses = {
      xs: "min-h-[60px] text-xs",
      sm: "min-h-[80px] text-sm",
      md: "min-h-[100px] text-base",
      lg: "min-h-[120px] text-lg",
    };

    const variantClasses = {
      default: "",
      filled: "bg-gray-100 focus:bg-white",
      unstyled: "border-none shadow-none focus:ring-0 px-0",
    };

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(value);
      }
    };

    const handleBlur = () => {
      // Call form onBlur if provided (for form integration)
      if (formOnBlur) {
        formOnBlur();
      }
    };

    const handleFocus = () => {
      // Call form onFocus if provided (for form integration)
      if (formOnFocus) {
        formOnFocus();
      }
    };

    const currentValue = formValue !== undefined ? formValue : "";
    const currentLength = currentValue ? String(currentValue).length : 0;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        {description && <p className="text-xs text-gray-500">{description}</p>}

        <div className="relative w-full">
          <ShadcnTextarea
            ref={ref}
            className={cn(
              sizeClasses[size],
              variantClasses[variant],
              resizeClasses[resize],
              internalError && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...props}
          />
        </div>

        {(showCharCount || maxLength || internalError) && (
          <div className="flex justify-between items-center text-xs mt-0.5">
            {internalError ? (
              <p className="text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {internalError}
              </p>
            ) : <div></div>}
            
            {(showCharCount || maxLength) && (
              <div className="text-gray-500 ml-auto">
                {currentLength}
                {maxLength ? `/${maxLength}` : ""} characters
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
