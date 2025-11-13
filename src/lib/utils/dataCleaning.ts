/**
 * Utility function to clean data before saving to MongoDB
 * Removes empty strings and converts them to undefined, then removes undefined fields
 * to prevent MongoDB casting issues
 */
export function cleanDataForMongoDB<T extends Record<string, unknown>>(
  data: T,
  optionalFields: (keyof T)[] = []
): Partial<T> {
  const cleanedData = { ...data };

  // Convert empty strings to undefined for optional fields
  optionalFields.forEach((field) => {
    const fieldValue = cleanedData[field];
    if (
      fieldValue !== undefined &&
      typeof fieldValue === "string" &&
      fieldValue.trim() === ""
    ) {
      (cleanedData as Record<string, unknown>)[field as string] = undefined;
    }
  });

  // Remove undefined fields completely to avoid MongoDB casting issues
  Object.keys(cleanedData).forEach((key) => {
    if ((cleanedData as Record<string, unknown>)[key] === undefined) {
      delete (cleanedData as Record<string, unknown>)[key];
    }
  });

  return cleanedData as Partial<T>;
}

/**
 * Utility function specifically for testimonial data cleaning
 */
export function cleanTestimonialData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, ["tourId", "image", "location"]);
}

/**
 * Utility function specifically for tour data cleaning
 */
export function cleanTourData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, [
    "category",
    "location",
    "images",
    "highlights",
    "itinerary",
    "includes",
    "excludes",
    "shortDescription",
  ]);
}

/**
 * Utility function specifically for contact data cleaning
 */
export function cleanContactData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, ["phone", "subject", "message"]);
}

/**
 * Utility function specifically for blog data cleaning
 */
export function cleanBlogData(data: Record<string, unknown>) {
  return cleanDataForMongoDB(data, [
    "category",
    "tags",
    "featuredImage",
    "excerpt",
  ]);
}
