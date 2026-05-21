import React from "react";
import { Textarea, TiptapRichTextEditor } from "@/app/Components/Form";
import { useForm } from "@/lib/hooks";
import { UpdateTourData } from "@/lib/types/tour";
import { FileText } from "lucide-react";

interface DescriptionsSectionProps {
  form: ReturnType<typeof useForm<UpdateTourData>>;
}

export const DescriptionsSection: React.FC<DescriptionsSectionProps> = ({
  form,
}) => {
  return (
    <div className="form-section bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="section-header mb-4">
        <h3 className="flex items-center gap-3 font-semibold text-gray-900 text-lg">
          <FileText className="h-5 w-5 text-[#fd7d02]" />
          Tour Descriptions
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Provide detailed information about your tour
        </p>
      </div>
      <div className="form-group mb-4">
        <Textarea
          label="Short Description"
          description="Brief overview (2-3 sentences) that appears in tour listings"
          {...form.getFieldProps("shortDescription")}
          placeholder="e.g., Discover the rich cultural heritage of ancient temples and bustling markets in this immersive 3-day journey through historic landmarks and local traditions."
          rows={3}
          maxLength={200}
          showCharCount
          required
        />
      </div>
      <div className="form-group">
        <TiptapRichTextEditor
          label="Full Description"
          description="Detailed description that appears on the tour details page"
          {...form.getFieldProps("description")}
          placeholder="e.g., Embark on an unforgettable journey through centuries of history and culture. This comprehensive tour takes you through ancient temples, traditional villages, and modern cities, offering a perfect blend of historical exploration and contemporary experiences."
          rows={6}
          maxLength={2000}
          showCharCount
          required
        />
      </div>
    </div>
  );
};
