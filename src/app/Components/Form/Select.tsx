"use client";
import React, { forwardRef, useEffect, useState } from "react";

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
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
  placeholder?: string;
  data?: Array<{ value: string; label: string; disabled?: boolean }>;
  searchable?: boolean;
  clearable?: boolean;
  validateOnChange?: boolean;
  validator?: (value: string) => string | undefined;
  // Form integration props
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
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
      placeholder,
      data,
      children,
      validateOnChange = false,
      validator,
      // Form integration props
      value: formValue,
      onChange: formOnChange,
      onBlur: formOnBlur,
      onFocus: formOnFocus,
      ...props
    },
    ref
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>(
      error
    );
    const [hasBeenTouched, setHasBeenTouched] = useState(false);

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    const sizeClasses = {
      xs: "form-input-xs",
      sm: "form-input-sm",
      md: "form-input-md",
      lg: "form-input-lg",
    };

    const variantClasses = {
      default: "form-input-default",
      filled: "form-input-filled",
      unstyled: "form-input-unstyled",
    };

    const baseClasses = `
      form-input-base
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${internalError ? "form-input-error" : ""}
      ${className}
    `.trim();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
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

    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
            {required && <span className="form-required">*</span>}
          </label>
        )}

        {description && <p className="form-description">{description}</p>}

        <div className="form-input-container">
          <select
            ref={ref}
            className={`${baseClasses} form-input-with-right-icon`}
            disabled={disabled}
            value={formValue !== undefined ? formValue : ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {data
              ? data.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </option>
                ))
              : children}
          </select>

          {/* Custom dropdown arrow */}
          <div className="form-input-icon-right">
            <i className="bi bi-chevron-down form-text-gray-400"></i>
          </div>
        </div>

        {internalError && (
          <p className="form-error">
            <i className="bi bi-exclamation-circle form-error-icon"></i>
            {internalError}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
