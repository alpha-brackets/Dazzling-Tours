"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "onBlur" | "onFocus" | "value"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  className?: string;
  validateOnChange?: boolean;
  validator?: (value: string) => string | undefined;
  maxLength?: number;
  showCharCount?: boolean;
  // Form integration props
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      description,
      error,
      required = false,
      leftIcon,
      rightIcon,
      size = "md",
      variant = "default",
      disabled = false,
      className = "",
      validateOnChange = false,
      validator,
      maxLength,
      showCharCount = false,
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
    const [hasBeenTouched, setHasBeenTouched] = useState(false);

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // Run validation if enabled and validator is provided
      if (validateOnChange && validator && hasBeenTouched) {
        const validationError = validator(value);
        setInternalError(validationError);
      }

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(value);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBeenTouched(true);

      // Run validation on blur if validator is provided
      if (validator) {
        const validationError = validator(e.target.value);
        setInternalError(validationError);
      }

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

    const sizeClasses = {
      xs: "h-7 text-xs px-2",
      sm: "h-8 text-sm px-3",
      md: "h-10 text-base px-3",
      lg: "h-11 text-lg px-4",
      xl: "h-12 text-xl px-4",
    };

    const variantClasses = {
      default: "",
      filled: "bg-gray-100 focus:bg-white",
      unstyled: "border-none shadow-none focus:ring-0 px-0",
    };

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
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <Input
            ref={ref}
            className={cn(
              sizeClasses[size],
              variantClasses[variant],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              internalError && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            disabled={disabled}
            required={required}
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            maxLength={maxLength}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
              {rightIcon}
            </div>
          )}
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

TextInput.displayName = "TextInput";

export default TextInput;
