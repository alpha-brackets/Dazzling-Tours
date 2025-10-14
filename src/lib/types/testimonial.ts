import { PaginatedResponse, SingleResponse } from "./common";

export interface Testimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  review: string;
  tourId?: string;
  tourTitle?: string;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialData {
  name: string;
  email: string;
  rating: number;
  review: string;
  tourId?: string;
  status?: string;
  featured?: boolean;
}

export interface UpdateTestimonialData extends Partial<CreateTestimonialData> {
  _id: string;
}

export type TestimonialsResponse = PaginatedResponse<Testimonial>;

export type TestimonialResponse = SingleResponse<Testimonial>;
