import React from "react";
import { ListManager } from "@/app/Components/Form";
import { useForm } from "@/lib/hooks";
import { UpdateTourData } from "@/lib/types/tour";
import { Star, CheckCircle, XCircle } from "lucide-react";

interface ListsSectionProps {
  form: ReturnType<typeof useForm<UpdateTourData>>;
}

export const ListsSection: React.FC<ListsSectionProps> = ({ form }) => {
  return (
    <>
      <div className="form-section bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="section-header mb-4">
          <h3 className="flex items-center gap-3 font-semibold text-gray-900 text-lg">
            <Star className="h-5 w-5 text-[#fd7d02]" />
            Highlights
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add key features and attractions that make this tour special
          </p>
        </div>
        <ListManager
          label="Highlights"
          description="Add key features and attractions that make this tour special"
          placeholder="e.g., Visit ancient temples, Scenic mountain views, Local cultural experience"
          addButtonText="Add Highlight"
          emptyStateText="No highlights added yet"
          emptyStateIcon={<Star className="h-5 w-5" />}
          items={form.values.highlights || []}
          onAdd={(item) =>
            form.setFieldValue("highlights", [
              ...(form.values.highlights || []),
              item,
            ])
          }
          onRemove={(index) =>
            form.setFieldValue(
              "highlights",
              (form.values.highlights || []).filter((_, i) => i !== index),
            )
          }
          maxItems={10}
          maxWords={15}
          maxLength={100}
          showCharCount
        />
      </div>

      <div className="form-section bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="section-header mb-4">
          <h3 className="flex items-center gap-3 font-semibold text-gray-900 text-lg">
            <CheckCircle className="h-5 w-5 text-[#fd7d02]" />
            Includes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            List what&apos;s included in the tour price (meals, transportation,
            accommodation, etc.)
          </p>
        </div>
        <ListManager
          label="Includes"
          description="List what's included in the tour price (meals, transportation, accommodation, etc.)"
          placeholder="e.g., All meals included, Professional guide, Hotel accommodation, Airport transfers"
          addButtonText="Add Include"
          emptyStateText="No includes added yet"
          emptyStateIcon={<CheckCircle className="h-5 w-5" />}
          items={form.values.includes || []}
          onAdd={(item) =>
            form.setFieldValue("includes", [
              ...(form.values.includes || []),
              item,
            ])
          }
          onRemove={(index) =>
            form.setFieldValue(
              "includes",
              (form.values.includes || []).filter((_, i) => i !== index),
            )
          }
          maxWords={20}
          maxLength={150}
          showCharCount
          maxItems={10}
        />
      </div>

      <div className="form-section bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="section-header mb-4">
          <h3 className="flex items-center gap-3 font-semibold text-gray-900 text-lg">
            <XCircle className="h-5 w-5 text-[#fd7d02]" />
            Excludes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            List what&apos;s NOT included in the tour price (optional
            activities, personal expenses, etc.)
          </p>
        </div>
        <ListManager
          label="Excludes"
          description="List what's NOT included in the tour price (optional activities, personal expenses, etc.)"
          placeholder="e.g., International flights, Travel insurance, Personal expenses, Optional activities"
          addButtonText="Add Exclude"
          emptyStateText="No excludes added yet"
          emptyStateIcon={<XCircle className="h-5 w-5" />}
          items={form.values.excludes || []}
          onAdd={(item) =>
            form.setFieldValue("excludes", [
              ...(form.values.excludes || []),
              item,
            ])
          }
          onRemove={(index) =>
            form.setFieldValue(
              "excludes",
              (form.values.excludes || []).filter((_, i) => i !== index),
            )
          }
          maxWords={20}
          maxLength={150}
          showCharCount
          maxItems={10}
        />
      </div>
    </>
  );
};
