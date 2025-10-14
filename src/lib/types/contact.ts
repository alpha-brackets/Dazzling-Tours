import { PaginatedResponse, SingleResponse } from "./common";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
}

export interface UpdateContactData extends Partial<CreateContactData> {
  _id: string;
}

export type ContactsResponse = PaginatedResponse<Contact>;

export type ContactResponse = SingleResponse<Contact>;
