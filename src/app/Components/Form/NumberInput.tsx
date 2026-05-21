"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Minus, Plus } from "lucide-react";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange" | "onBlur" | "onFocus" | "value"
> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "filled" | "unstyled";
  disabled?: boolean;
  className?: string;
  currency?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  validateOnChange?: boolean;
  validator?: (value: number) => string | undefined;
  // Form integration props
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
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
      currency,
      min,
      max,
      step = 1,
      precision = 2,
      validateOnChange = false,
      validator,
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
      let value = e.target.value;

      // Handle precision if specified
      if (precision !== undefined && value.includes(".")) {
        const parts = value.split(".");
        if (parts[1] && parts[1].length > precision) {
          value = parts[0] + "." + parts[1].substring(0, precision);
        }
      }

      const numericValue = parseFloat(value) || 0;

      // Run validation if enabled and validator is provided
      if (validateOnChange && validator && hasBeenTouched) {
        const validationError = validator(numericValue);
        setInternalError(validationError);
      }

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(numericValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setHasBeenTouched(true);

      // Run validation on blur if validator is provided
      if (validator) {
        const numericValue = parseFloat(e.target.value) || 0;
        const validationError = validator(numericValue);
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

    const handleIncrement = () => {
      const current = formValue !== undefined ? formValue : 0;
      const next = current + step;
      if (max !== undefined && next > max) return;
      if (formOnChange) formOnChange(next);
    };

    const handleDecrement = () => {
      const current = formValue !== undefined ? formValue : 0;
      const next = current - step;
      if (min !== undefined && next < min) return;
      if (formOnChange) formOnChange(next);
    };

    const sizeClasses = {
      xs: "h-7 text-xs px-2",
      sm: "h-8 text-sm px-3",
      md: "h-10 text-base px-3",
      lg: "h-11 text-lg px-4",
    };

    const variantClasses = {
      default: "",
      filled: "bg-gray-100 focus:bg-white",
      unstyled: "border-none shadow-none focus:ring-0 px-0",
    };

    const buttonSizeClasses = {
      xs: "h-5 w-5",
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-9 w-9",
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

        <div className="relative flex items-center w-full">
          {currency && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
              {currency}
            </div>
          )}

          {leftIcon && !currency && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <Input
            ref={ref}
            type="number"
            className={cn(
              sizeClasses[size],
              variantClasses[variant],
              (currency || leftIcon) && "pl-10",
              "pr-24", // Make space for custom buttons
              internalError && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", // Hide native arrows
              className
            )}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            value={formValue !== undefined ? formValue : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...props}
          />

          {rightIcon && !currency && (
            <div className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center pointer-events-none">
              {rightIcon}
            </div>
          )}

          {/* Custom Buttons */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-100 rounded-md shadow-sm">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(buttonSizeClasses[size], "text-gray-500 hover:text-gray-700")}
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && (formValue || 0) <= min)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="w-px h-4 bg-gray-200" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(buttonSizeClasses[size], "text-gray-500 hover:text-gray-700")}
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && (formValue || 0) >= max)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {internalError && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {internalError}
          </p>
        )}
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
