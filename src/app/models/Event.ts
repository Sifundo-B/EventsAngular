import { EventCategory } from "./EventCategory";

export interface Event {
  id?: number;
  name: string;
  description: string;
  date: Date;  
  imageUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  price: number;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submissionDate: Date;
  eventCategory: EventCategory;
  numberOfTickets: number;
  userId?: number;
  organizerId: number;
  backgroundColor?: string;
}
