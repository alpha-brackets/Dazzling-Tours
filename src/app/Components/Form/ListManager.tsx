"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, List, Plus, X } from "lucide-react";

export interface ListManagerProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  addButtonText?: string;
  emptyStateText?: string;
  emptyStateIcon?: React.ReactNode;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  maxItems?: number;
  maxWords?: number;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
  itemClassName?: string;
  addButtonClassName?: string;
  removeButtonClassName?: string;
}

const ListManager: React.FC<ListManagerProps> = ({
  label,
  description,
  error: propError,
  required = false,
  placeholder = "Add item...",
  addButtonText = "Add",
  emptyStateText = "No items added yet",
  emptyStateIcon,
  items,
  onAdd,
  onRemove,
  maxItems,
  maxWords,
  maxLength,
  showCharCount = false,
  className = "",
  itemClassName = "",
  addButtonClassName = "",
  removeButtonClassName = "",
}) => {
  const [newItem, setNewItem] = useState("");
  const [localError, setLocalError] = useState("");

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleAdd = () => {
    const wordCount = getWordCount(newItem);

    if (maxWords && wordCount > maxWords) {
      setLocalError(
        `Each item must be ${maxWords} words or less (currently ${wordCount} words)`,
      );
      return;
    }

    if (newItem.trim() && (!maxItems || items.length < maxItems)) {
      onAdd(newItem.trim());
      setNewItem("");
      setLocalError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const canAdd = newItem.trim() && (!maxItems || items.length < maxItems);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => {
              setNewItem(e.target.value);
              if (localError) setLocalError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={maxItems ? items.length >= maxItems : false}
            maxLength={maxLength}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={cn("shrink-0", addButtonClassName)}
          >
            <Plus className="h-4 w-4 mr-1" /> {addButtonText}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-3">
            {maxWords && (
              <div
                className={cn(getWordCount(newItem) > maxWords && "text-red-500")}
              >
                {getWordCount(newItem)}/{maxWords} words
              </div>
            )}

            {(showCharCount || maxLength) && (
              <div
                className={cn(maxLength && newItem.length >= maxLength && "text-red-500")}
              >
                {newItem.length}
                {maxLength ? `/${maxLength}` : ""} characters
              </div>
            )}
          </div>
          
          {maxItems && (
            <div className="ml-auto">
              {items.length}/{maxItems} items
            </div>
          )}
        </div>

        {localError && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-0.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {localError}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-1">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-sm hover:bg-gray-100 transition-colors",
                itemClassName
              )}
            >
              <span className="truncate mr-4 text-gray-700">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className={cn("h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0", removeButtonClassName)}
                title="Remove item"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 flex flex-col items-center gap-2">
              {emptyStateIcon || <List className="h-8 w-8 text-gray-300" />}
              <p className="text-sm">{emptyStateText}</p>
            </div>
          )}
        </div>
      </div>

      {propError && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-0.5">
          <AlertCircle className="h-3.5 w-3.5" />
          {propError}
        </p>
      )}
    </div>
  );
};

export default ListManager;
