import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface UpdateContactData extends Partial<CreateContactData> {
  _id: string;
  status?: string;
}

interface ContactResponse {
  success: boolean;
  data: ContactInquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ContactInquiryResponse {
  success: boolean;
  data: ContactInquiry;
}

interface ContactStatsResponse {
  success: boolean;
  data: {
    total: number;
    byStatus: Record<string, number>;
    recentActivity: number;
    monthlyTrends: Array<{ month: string; count: number }>;
  };
}

// Query Keys
export const contactKeys = {
  all: ["contact"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, "detail"] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
  stats: () => [...contactKeys.all, "stats"] as const,
};

// Hooks
export const useGetContactInquiries = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
}) => {
  return useQuery<ContactResponse>({
    queryKey: contactKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/contact?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch contact inquiries");
      }
      return response.json();
    },
  });
};

export const useGetContactInquiry = (id: string) => {
  return useQuery<ContactInquiryResponse>({
    queryKey: contactKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/contact/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch contact inquiry");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useGetContactStats = () => {
  return useQuery<ContactStatsResponse>({
    queryKey: contactKeys.stats(),
    queryFn: async () => {
      const response = await fetch("/api/contact/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch contact stats");
      }
      return response.json();
    },
  });
};

export const useCreateContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactInquiryResponse, Error, CreateContactData>({
    mutationFn: async (data) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit contact inquiry");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};

export const useUpdateContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<ContactInquiryResponse, Error, UpdateContactData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await fetch(`/api/contact/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update contact inquiry");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: contactKeys.detail(data.data._id),
      });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};

export const useDeleteContactInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete contact inquiry");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};

export const useBulkUpdateContactInquiries = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, action, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update contact inquiries");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.stats() });
    },
  });
};
