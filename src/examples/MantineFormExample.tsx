// Example: How to use the Mantine-like form system

import { useForm } from "@/lib/hooks";
import { createTourSchema } from "@/lib/validation/tour";
import { TextInput, NumberInput, Select } from "@/app/Components/Form";

const ExampleForm = () => {
  // Initialize form with Mantine-like API
  const form = useForm<{
    title: string;
    price: number;
    duration: string;
    location: string;
    category: string;
  }>({
    initialValues: {
      title: "",
      price: 0,
      duration: "",
      location: "",
      category: "",
    },
    validate: (values) => {
      const result = createTourSchema
        .pick({
          title: true,
          price: true,
          duration: true,
          location: true,
          category: true,
        })
        .safeParse(values);

      if (result.success) {
        return {};
      }

      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });

      return errors;
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log("Form submitted with values:", values);
    // Handle form submission
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Simple usage with getFieldProps */}
      <TextInput label="Tour Title" {...form.getFieldProps("title")} required />

      <NumberInput label="Price" {...form.getFieldProps("price")} min={0} />

      <Select
        label="Category"
        {...form.getFieldProps("category")}
        data={[
          { value: "Adventure", label: "Adventure" },
          { value: "Cultural", label: "Cultural" },
        ]}
      />

      {/* Manual field management */}
      <TextInput
        label="Duration"
        value={form.values.duration}
        error={form.errors.duration}
        onChange={(value) => form.setFieldValue("duration", value)}
        onBlur={() => form.setFieldTouched("duration", true)}
        required
      />

      {/* Form state display */}
      <div>
        <p>Form is valid: {form.isValid ? "Yes" : "No"}</p>
        <p>Form is dirty: {form.isDirty ? "Yes" : "No"}</p>
        <p>Form is submitting: {form.isSubmitting ? "Yes" : "No"}</p>
      </div>

      {/* Submit button */}
      <button type="submit" disabled={!form.isValid || form.isSubmitting}>
        {form.isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* Reset button */}
      <button type="button" onClick={form.reset}>
        Reset Form
      </button>
    </form>
  );
};

export default ExampleForm;
