"use client";
import React, { useState } from "react";
import { Badge, Button, Card, ActionIcon } from "../Common";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";
import Textarea from "./Textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, CalendarCheck, Plus, X } from "lucide-react";

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
  const [newDay, setNewDay] = useState<number | undefined>(undefined);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = () => {
    const trimmedTitle = newTitle.trim();
    const trimmedDescription = newDescription.trim();

    if (
      newDay !== undefined &&
      newDay > 0 &&
      trimmedTitle.length >= 1 &&
      trimmedDescription.length >= 5 &&
      (!maxItems || items.length < maxItems)
    ) {
      onAdd({
        day: newDay,
        title: trimmedTitle,
        description: trimmedDescription,
      });
      setNewDay(undefined);
      setNewTitle("");
      setNewDescription("");
    }
  };

  const canAdd =
    newDay !== undefined &&
    newDay > 0 &&
    newTitle.trim().length >= 1 &&
    newDescription.trim().length >= 5 &&
    (!maxItems || items.length < maxItems);

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="flex flex-col gap-4">
        {/* Add Item Form */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-1/4">
              <NumberInput
                label="Day"
                value={newDay}
                onChange={(value) => setNewDay(value)}
                placeholder="1"
                min={1}
              />
            </div>
            <div className="sm:flex-1">
              <TextInput
                label="Day Title / Location"
                value={newTitle}
                onChange={(value) => setNewTitle(value)}
                placeholder="e.g., Skardu, Arrival & City Tour"
              />
            </div>
          </div>
          
          <Textarea
            label="Activity Description"
            value={newDescription}
            onChange={(value) => setNewDescription(value)}
            placeholder="e.g., Arrive at the airport, transfer to hotel, city tour including historical sites, lunch at local restaurant, evening free time"
            rows={4}
            maxLength={400}
            showCharCount
          />
          
          <Button
            color="primary"
            onClick={handleAdd}
            disabled={!canAdd}
            className="self-end"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Day
          </Button>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <Card key={index} padding="md" variant="bordered">
              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge color="primary" size="sm" radius="xl">
                      DAY {item.day}
                    </Badge>
                    <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {maxItems && (
                    <p className="text-xs text-gray-400 mt-1">
                      {index + 1}/{maxItems} days
                    </p>
                  )}
                </div>
                <ActionIcon
                  color="error"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="h-8 w-8 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Remove day"
                >
                  <X className="h-4 w-4" />
                </ActionIcon>
              </div>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 flex flex-col items-center gap-2">
              <CalendarCheck className="h-8 w-8 text-gray-300" />
              <p className="text-sm">No itinerary days added yet</p>
            </div>
          )}
        </div>

        {maxItems && (
          <div className="text-xs text-gray-500 ml-auto">
            {items.length}/{maxItems} days
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1 mt-0.5">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

export default ItineraryManager;
