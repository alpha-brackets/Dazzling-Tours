import { PaginatedResponse, SingleResponse } from "./common";
import { TourStatus } from "../enums/tourStatus";

export interface Tour {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  images: string[];
  highlights: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  includes: string[];
  excludes: string[];
  difficulty: string;
  groupSize: number;
  rating: number;
  reviews: number;
  featured: boolean;
  status: TourStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourData {
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  images: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  includes?: string[];
  excludes?: string[];
  difficulty?: string;
  groupSize?: number;
  rating?: number;
  reviews?: number;
  featured?: boolean;
  status?: TourStatus;
}

export interface UpdateTourData extends Partial<CreateTourData> {
  _id: string;
}

export type ToursResponse = PaginatedResponse<Tour>;

export type TourResponse = SingleResponse<Tour>;
