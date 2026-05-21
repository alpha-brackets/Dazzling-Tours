import React from "react";
import { TextInput, NumberInput, Select } from "@/app/Components/Form";
import {
  TourStatus,
  TOUR_STATUS_OPTIONS,
  TOUR_DIFFICULTY_OPTIONS,
  TourPriceType,
  TOUR_PRICE_TYPE_OPTIONS,
} from "@/lib/enums";
import { useForm } from "@/lib/hooks";
import { UpdateTourData } from "@/lib/types/tour";
import { Info } from "lucide-react";

interface BasicInfoSectionProps {
  form: ReturnType<typeof useForm<UpdateTourData>>;
  categoryOptions: { value: string; label: string }[];
  setCategorySearchTerm: (term: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  form,
  categoryOptions,
  setCategorySearchTerm,
}) => {
  return (
    <div className="form-section bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="section-header mb-4">
        <h3 className="flex items-center gap-3 font-semibold text-gray-900 text-lg">
          <Info className="h-5 w-5 text-[#fd7d02]" />
          Basic Information
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Essential details about your tour package
        </p>
      </div>
      <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Tour Title"
          placeholder="e.g., Amazing 3-Day Cultural Heritage Tour"
          {...form.getFieldProps("title")}
          maxLength={100}
          showCharCount
          required
        />

        <NumberInput
          label="Price (PKR)"
          placeholder="10,000"
          {...form.getFieldProps("price")}
          min={0}
          step={1}
          currency="₨"
          required
        />

        <Select
          label="Price Type"
          value={form.values.priceType}
          onChange={(value) =>
            form.setFieldValue("priceType", value as TourPriceType)
          }
          data={TOUR_PRICE_TYPE_OPTIONS}
          required
        />

        <TextInput
          label="Duration"
          placeholder="e.g., 3 days, 5 days, 1 week"
          {...form.getFieldProps("duration")}
          maxLength={50}
          showCharCount
          required
        />

        <TextInput
          label="Location/Destination"
          placeholder="e.g., Paris, France or Bali, Indonesia"
          {...form.getFieldProps("location")}
          maxLength={100}
          showCharCount
          required
        />

        <Select
          label="Category"
          {...form.getFieldProps("category")}
          placeholder="Select Category"
          data={categoryOptions}
          required
          searchable
          onSearchChange={setCategorySearchTerm}
        />

        <NumberInput
          label="Maximum Group Size"
          placeholder="15"
          {...form.getFieldProps("groupSize")}
          min={1}
          max={50}
        />

        <Select
          label="Difficulty Level"
          {...form.getFieldProps("difficulty")}
          data={TOUR_DIFFICULTY_OPTIONS}
        />

        <Select
          label="Status"
          value={form.values.status}
          onChange={(value) =>
            form.setFieldValue("status", value as TourStatus)
          }
          data={TOUR_STATUS_OPTIONS}
        />
      </div>
    </div>
  );
};
