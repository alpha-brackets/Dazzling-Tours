import { PaginatedResponse, SingleResponse } from "./common";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: string;
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags?: string[];
  featuredImage?: string;
  status?: string;
  featured?: boolean;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  _id: string;
}

export type BlogsResponse = PaginatedResponse<Blog>;

export type BlogResponse = SingleResponse<Blog>;
