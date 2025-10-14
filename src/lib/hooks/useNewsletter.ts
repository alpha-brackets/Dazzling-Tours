import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
interface NewsletterSubscriber {
  _id: string;
  email: string;
  status: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  source?: string;
  tags?: string[];
}

interface CreateSubscriberData {
  email: string;
  source?: string;
  tags?: string[];
}

interface UpdateSubscriberData {
  email: string;
  status?: string;
  tags?: string[];
}

interface NewsletterResponse {
  success: boolean;
  data: NewsletterSubscriber[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface NewsletterStatsResponse {
  success: boolean;
  data: {
    total: number;
    active: number;
    unsubscribed: number;
    monthlyGrowth: Array<{ month: string; count: number }>;
    sourceBreakdown: Record<string, number>;
  };
}

// Query Keys
export const newsletterKeys = {
  all: ["newsletter"] as const,
  lists: () => [...newsletterKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...newsletterKeys.lists(), filters] as const,
  stats: () => [...newsletterKeys.all, "stats"] as const,
};

// Hooks
export const useGetNewsletterSubscribers = (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  source?: string;
}) => {
  return useQuery<NewsletterResponse>({
    queryKey: newsletterKeys.list(params || {}),
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
        `/api/newsletter?${searchParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter subscribers");
      }
      return response.json();
    },
  });
};

export const useGetNewsletterStats = () => {
  return useQuery<NewsletterStatsResponse>({
    queryKey: newsletterKeys.stats(),
    queryFn: async () => {
      const response = await fetch("/api/newsletter/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch newsletter stats");
      }
      return response.json();
    },
  });
};

export const useSubscribeNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; message: string },
    Error,
    CreateSubscriberData
  >({
    mutationFn: async (data) => {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe to newsletter");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useUpdateNewsletterSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, UpdateSubscriberData>({
    mutationFn: async (data) => {
      const response = await fetch("/api/newsletter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update newsletter subscription");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useUnsubscribeNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (email) => {
      const response = await fetch("/api/newsletter", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to unsubscribe from newsletter");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};

export const useBulkUpdateNewsletter = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { emails: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ emails, action, data }) => {
      const response = await fetch("/api/newsletter", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails, action, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update newsletter subscriptions");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.stats() });
    },
  });
};
