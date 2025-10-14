import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  tourId?: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTestimonialData {
  name: string;
  designation: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  location?: string;
  tourId?: string;
  status?: string;
  featured?: boolean;
}

interface UpdateTestimonialData extends Partial<CreateTestimonialData> {
  _id: string;
}

interface TestimonialsResponse {
  success: boolean;
  data: Testimonial[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface TestimonialResponse {
  success: boolean;
  data: Testimonial;
}

// Query Keys
export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...testimonialKeys.lists(), filters] as const,
  details: () => [...testimonialKeys.all, "detail"] as const,
  detail: (id: string) => [...testimonialKeys.details(), id] as const,
};

// Hooks
export const useGetTestimonials = (params?: {
  status?: string;
  featured?: boolean;
  tourId?: string;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<TestimonialsResponse>({
    queryKey: testimonialKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(
        `/api/testimonials?${searchParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
      }
      return response.json();
    },
  });
};

export const useGetTestimonial = (id: string) => {
  return useQuery<TestimonialResponse>({
    queryKey: testimonialKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/testimonials/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch testimonial");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation<TestimonialResponse, Error, CreateTestimonialData>({
    mutationFn: async (data) => {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create testimonial");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation<TestimonialResponse, Error, UpdateTestimonialData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await fetch(`/api/testimonials/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update testimonial");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: testimonialKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
    },
  });
};

export const useBulkUpdateTestimonials = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await fetch("/api/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, action, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update testimonials");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.lists() });
    },
  });
};
