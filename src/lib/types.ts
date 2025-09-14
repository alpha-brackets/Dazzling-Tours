// MongoDB Query Types
export interface MongoQuery {
  [key: string]:
    | string
    | boolean
    | number
    | { $regex: string; $options: string }
    | Array<{ [key: string]: { $regex: string; $options: string } }>
    | undefined;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Query Parameters Types
export interface QueryParams {
  page?: string;
  limit?: string;
  category?: string;
  status?: string;
  search?: string;
  featured?: string;
  tourId?: string;
}
