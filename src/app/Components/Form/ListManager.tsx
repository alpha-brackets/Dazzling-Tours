"use client";
import React, { useState } from "react";

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
  className?: string;
  itemClassName?: string;
  addButtonClassName?: string;
  removeButtonClassName?: string;
}

const ListManager: React.FC<ListManagerProps> = ({
  label,
  description,
  error,
  required = false,
  placeholder = "Add item...",
  addButtonText = "Add",
  emptyStateText = "No items added yet",
  emptyStateIcon,
  items,
  onAdd,
  onRemove,
  maxItems,
  className = "",
  itemClassName = "",
  addButtonClassName = "",
  removeButtonClassName = "",
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim() && (!maxItems || items.length < maxItems)) {
      onAdd(newItem.trim());
      setNewItem("");
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
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}

      {description && <p className="form-description">{description}</p>}

      <div className="list-manager">
        <div className="add-item">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={maxItems ? items.length >= maxItems : false}
            className="form-flex-1"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`btn-add ${addButtonClassName}`}
          >
            <i className="bi bi-plus"></i> {addButtonText}
          </button>
        </div>

        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className={`item ${itemClassName}`}>
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className={`btn-remove ${removeButtonClassName}`}
                title="Remove item"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="empty-state">
              {emptyStateIcon || <i className="bi bi-list"></i>}
              <p>{emptyStateText}</p>
            </div>
          )}
        </div>

        {maxItems && (
          <div className="form-text-xs form-text-gray-500 form-mt-2">
            {items.length}/{maxItems} items
          </div>
        )}
      </div>

      {error && (
        <p className="form-error">
          <i className="bi bi-exclamation-circle form-error-icon"></i>
          {error}
        </p>
      )}
    </div>
  );
};

export default ListManager;
