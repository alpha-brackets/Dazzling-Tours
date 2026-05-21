"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Minus } from "lucide-react";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "onChange" | "onBlur" | "onFocus" | "checked"
> {
  label?: string;
  description?: string;
  error?: string;
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
  children?: React.ReactNode;
  // Form integration props
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      error,
      size = "md",
      disabled = false,
      className = "",
      indeterminate = false,
      children,
      // Form integration props
      checked: formChecked = false,
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

    const internalRef = React.useRef<HTMLInputElement>(null);

    // Merge internal ref with forwarded ref
    const setRefs = React.useCallback(
      (element: HTMLInputElement | null) => {
        internalRef.current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref]
    );

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      if (formOnChange) {
        formOnChange(checked);
      }
    };

    const sizeClasses = {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    };

    const labelSizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-sm",
      lg: "text-base",
    };

    const iconSizeClasses = {
      xs: "h-2.5 w-2.5",
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              ref={setRefs}
              type="checkbox"
              className={cn(
                "peer sr-only",
                className
              )}
              disabled={disabled}
              checked={formChecked}
              onChange={handleChange}
              onBlur={formOnBlur}
              onFocus={formOnFocus}
              {...props}
            />

            {/* Custom Checkbox visual */}
            <div
              className={cn(
                "flex items-center justify-center rounded-[4px] border border-gray-300 bg-white transition-colors cursor-pointer",
                sizeClasses[size],
                "peer-focus-visible:ring-3 peer-focus-visible:ring-[var(--theme)]/20 peer-focus-visible:border-[var(--theme)]",
                "peer-checked:bg-[var(--theme)] peer-checked:border-[var(--theme)] peer-checked:text-white",
                indeterminate && "bg-[var(--theme)] border-[var(--theme)] text-white",
                disabled && "opacity-50 cursor-not-allowed bg-gray-50 peer-checked:bg-gray-400 peer-checked:border-gray-400",
                internalError && "border-red-500"
              )}
              onClick={() => {
                if (!disabled && internalRef.current) {
                  internalRef.current.click();
                }
              }}
            >
              {indeterminate ? (
                <Minus className={cn("stroke-[3px]", iconSizeClasses[size])} />
              ) : (
                <Check className={cn("hidden peer-checked:block stroke-[3px]", iconSizeClasses[size])} />
              )}
            </div>
          </div>

          <div className="flex-1">
            {label && (
              <Label
                className={cn(
                  "font-medium cursor-pointer text-gray-700",
                  labelSizeClasses[size],
                  disabled && "text-gray-400 cursor-not-allowed"
                )}
                onClick={() => {
                  if (!disabled && internalRef.current) {
                    internalRef.current.click();
                  }
                }}
              >
                {label}
              </Label>
            )}

            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}

            {children && <div className="mt-1">{children}</div>}
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

Checkbox.displayName = "Checkbox";

export default Checkbox;
