import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateTourData,
  UpdateTourData,
  ToursResponse,
  TourResponse,
} from "@/lib/types/tour";

// Query Keys
export const tourKeys = {
  all: ["tours"] as const,
  lists: () => [...tourKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...tourKeys.lists(), filters] as const,
  details: () => [...tourKeys.all, "detail"] as const,
  detail: (id: string) => [...tourKeys.details(), id] as const,
};

// Hooks
export const useGetTours = (params?: {
  status?: string;
  featured?: boolean;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery<ToursResponse>({
    queryKey: tourKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/tours?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tours");
      }
      return response.json();
    },
  });
};

export const useGetTour = (id: string) => {
  return useQuery<TourResponse>({
    queryKey: tourKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/tours/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tour");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation<TourResponse, Error, CreateTourData>({
    mutationFn: async (data) => {
      const response = await fetch("/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create tour");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
    },
  });
};

export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation<TourResponse, Error, UpdateTourData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await fetch(`/api/tours/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update tour");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tourKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/tours/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete tour");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
    },
  });
};

export const useBulkUpdateTours = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await fetch("/api/tours", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, action, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update tours");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
    },
  });
};
