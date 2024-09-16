import { Users } from "./Users";

export interface Tickets {
  id: number;
  eventName: string;
  image: string | null;
  attendeeName: string;
  ticketNumber: string;
  purchaseDate: Date | string; // Adjusted to handle both Date and string formats
  price: number;
  eventDate: Date | string; // Adjusted to handle both Date and string formats
  location: string;
  ticketType: string;
  user: Users; //  User is an object representing the user details
}
