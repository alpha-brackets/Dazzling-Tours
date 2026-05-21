"use client";
import React, { forwardRef, useEffect, useState, useRef } from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, ChevronDown, ChevronUp, Search, XCircle } from "lucide-react";

export interface SelectProps extends Omit<
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
  // Backend search support
  onSearchChange?: (searchTerm: string) => void;
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
      searchable = false,
      clearable = false,
      validateOnChange = false,
      validator,
      // Form integration props
      value: formValue,
      onChange: formOnChange,
      onBlur: formOnBlur,
      onFocus: formOnFocus,
      // Backend search support
      onSearchChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ...props
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref,
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>(
      error,
    );
    const [hasBeenTouched, setHasBeenTouched] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedLabel, setSelectedLabel] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update internal error when external error changes
    useEffect(() => {
      setInternalError(error);
    }, [error]);

    // Update selected label when value changes
    useEffect(() => {
      if (formValue && data) {
        const selectedItem = data.find((item) => item.value === formValue);
        if (selectedItem) {
          setSelectedLabel(selectedItem.label);
        }
      } else {
        setSelectedLabel("");
      }
    }, [formValue, data]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Calculate the current label synchronously to avoid hydration mismatch and empty renders
    const currentLabel = React.useMemo(() => {
      if (formValue !== undefined && data) {
        const item = data.find((d) => d.value === formValue);
        if (item) return item.label;
      }
      return "";
    }, [formValue, data]);

    const sizeClasses = {
      xs: "h-7 text-xs",
      sm: "h-8 text-sm",
      md: "h-10 text-base",
      lg: "h-11 text-lg",
    };

    const variantClasses = {
      default: "",
      filled: "bg-gray-100 focus:bg-white",
      unstyled: "border-none shadow-none focus:ring-0 px-0",
    };

    // Filter data based on search term
    const filteredData =
      data?.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || [];

    const handleChange = (value: string | null) => {
      const val = value || "";
      // Run validation if enabled and validator is provided
      if (validateOnChange && validator && hasBeenTouched) {
        const validationError = validator(val);
        setInternalError(validationError);
      }

      // Call form onChange if provided (for form integration)
      if (formOnChange) {
        formOnChange(val);
      }

      setIsOpen(false);
      setSearchTerm("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange("");
    };

    const handleToggleDropdown = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
      setHasBeenTouched(true);
      if (!isOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggleDropdown();
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    // If not searchable, render as regular Shadcn Select
    if (!searchable) {
      return (
        <div className="flex flex-col gap-1.5 w-full">
          {label && (
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
          )}

          {description && <p className="text-xs text-gray-500">{description}</p>}

          <ShadcnSelect
            value={formValue !== undefined ? formValue : ""}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-full justify-between rounded-lg border border-input bg-transparent",
                sizeClasses[size],
                variantClasses[variant],
                internalError && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
                className
              )}
              onBlur={formOnBlur}
              onFocus={formOnFocus}
            >
              <SelectValue placeholder={placeholder || "Select an option..."}>
                {currentLabel || undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {placeholder && (
                  <SelectItem value="" disabled>
                    {placeholder}
                  </SelectItem>
                )}
                {data
                  ? data.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                    >
                      {item.label}
                    </SelectItem>
                  ))
                  : children}
              </SelectGroup>
            </SelectContent>
          </ShadcnSelect>

          {internalError && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-0.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {internalError}
            </p>
          )}
        </div>
      );
    }

    // Searchable select implementation with Tailwind
    return (
      <div className="flex flex-col gap-1.5 w-full" ref={dropdownRef}>
        {label && (
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>
        )}

        {description && <p className="text-xs text-gray-500">{description}</p>}

        <div className="relative w-full">
          <div
            className={cn(
              "flex items-center justify-between rounded-lg border border-input bg-transparent cursor-pointer px-3",
              sizeClasses[size],
              variantClasses[variant],
              internalError && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed bg-gray-50",
              className
            )}
            onClick={handleToggleDropdown}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="select-options-list"
            onBlur={formOnBlur}
            onFocus={formOnFocus}
          >
            <span className={cn("truncate", !currentLabel && "text-gray-400")}>
              {currentLabel || placeholder || "Select an option..."}
            </span>

            <div className="flex items-center gap-1 ml-2 text-gray-400">
              {clearable && formValue && (
                <button
                  type="button"
                  className="hover:text-gray-600 focus:outline-none"
                  onClick={handleClear}
                  aria-label="Clear selection"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          {isOpen && (
            <div id="select-options-list" role="listbox" className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden flex flex-col">
              <div className="p-2 border-bottom flex items-center gap-2 bg-gray-50">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-400 focus:ring-0"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => {
                    const newSearchTerm = e.target.value;
                    setSearchTerm(newSearchTerm);
                    if (onSearchChange) {
                      onSearchChange(newSearchTerm);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      setSearchTerm("");
                      if (onSearchChange) {
                        onSearchChange("");
                      }
                    }
                  }}
                />
              </div>

              <div className="overflow-y-auto flex-1">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <div
                      key={item.value}
                      role="option"
                      aria-selected={item.value === formValue}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-100",
                        item.value === formValue && "bg-gray-50 font-medium text-[var(--theme)]",
                        item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent text-gray-400"
                      )}
                      onClick={() => !item.disabled && handleChange(item.value)}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.value === formValue && (
                        <Check className="h-4 w-4 text-[var(--theme)] shrink-0 ml-2" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
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

Select.displayName = "Select";

export default Select;
