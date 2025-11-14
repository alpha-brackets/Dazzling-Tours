"use client";
import React, { useState } from "react";
import { Badge } from "../Common";

export interface ItineraryManagerProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  items: Array<{ day: number; title: string; description: string }>;
  onAdd: (item: { day: number; title: string; description: string }) => void;
  onRemove: (index: number) => void;
  maxItems?: number;
  className?: string;
}

const ItineraryManager: React.FC<ItineraryManagerProps> = ({
  label,
  description,
  error,
  required = false,
  items,
  onAdd,
  onRemove,
  maxItems,
  className = "",
}) => {
  const [newDay, setNewDay] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = () => {
    if (
      newDay &&
      newTitle &&
      newDescription &&
      (!maxItems || items.length < maxItems)
    ) {
      onAdd({
        day: parseInt(newDay),
        title: newTitle.trim(),
        description: newDescription.trim(),
      });
      setNewDay("");
      setNewTitle("");
      setNewDescription("");
    }
  };

  const canAdd =
    newDay &&
    newTitle &&
    newDescription &&
    (!maxItems || items.length < maxItems);

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
        <div className="add-item itinerary-form">
          <div className="itinerary-inputs">
            <input
              type="number"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              placeholder="1"
              min="1"
              title="Day number"
              className="day-input"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Arrival & City Tour"
              title="Day title"
              className="title-input"
            />
          </div>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="e.g., Arrive at the airport, transfer to hotel, city tour including historical sites, lunch at local restaurant, evening free time"
            rows={2}
            title="Day description"
            className="description-input"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="btn-add"
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>

        <div className="item-list">
          {items.map((item, index) => (
            <div key={index} className="item itinerary-item">
              <div className="itinerary-content">
                <div className="day-header">
                  <Badge color="blue" size="sm" radius="xl">
                    Day {item.day}
                  </Badge>
                  <h4 className="day-title">{item.title}</h4>
                </div>
                <p className="day-description">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="btn-remove"
                title="Remove day"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
          ))}

          {items.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-calendar-check"></i>
              <p>No itinerary days added yet</p>
            </div>
          )}
        </div>

        {maxItems && (
          <div className="form-text-xs form-text-gray-500 form-mt-2">
            {items.length}/{maxItems} days
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

export default ItineraryManager;
