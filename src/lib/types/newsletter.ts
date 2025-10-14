import { PaginatedResponse, SingleResponse } from "./common";

export interface Newsletter {
  _id: string;
  email: string;
  status: string;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface CreateNewsletterData {
  email: string;
  status?: string;
}

export interface UpdateNewsletterData extends Partial<CreateNewsletterData> {
  _id: string;
}

export type NewslettersResponse = PaginatedResponse<Newsletter>;

export type NewsletterResponse = SingleResponse<Newsletter>;
