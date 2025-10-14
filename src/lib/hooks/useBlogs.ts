import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types
interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: string;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateBlogData {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: string;
  featured?: boolean;
}

interface UpdateBlogData extends Partial<CreateBlogData> {
  _id: string;
}

interface BlogsResponse {
  success: boolean;
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface BlogResponse {
  success: boolean;
  data: Blog;
}

// Query Keys
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
};

// Hooks
export const useGetBlogs = (params?: {
  status?: string;
  featured?: boolean;
  category?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<BlogsResponse>({
    queryKey: blogKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`/api/blogs?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      return response.json();
    },
  });
};

export const useGetBlog = (id: string) => {
  return useQuery<BlogResponse>({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<BlogResponse, Error, CreateBlogData>({
    mutationFn: async (data) => {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create blog");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<BlogResponse, Error, UpdateBlogData>({
    mutationFn: async (data) => {
      const { _id, ...updateData } = data;
      const response = await fetch(`/api/blogs/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update blog");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: blogKeys.detail(data.data._id),
      });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useBulkUpdateBlogs = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { ids: string[]; action: string; data?: Record<string, unknown> }
  >({
    mutationFn: async ({ ids, action, data }) => {
      const response = await fetch("/api/blogs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids, action, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to bulk update blogs");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};
