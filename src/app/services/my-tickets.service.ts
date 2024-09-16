import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tickets } from '../models/tickets';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from './auth.service'; // Import AuthService
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyTicketsService {

  private baseUrl = `${environment.apiUrl}/ticketHistory`;

  constructor(private http: HttpClient, private authService: AuthService) {} // Inject AuthService

  // getting the tickets according to the user that is logged in
  getTicketsByUserId(): Observable<Tickets[]> {
    const id = this.authService.extractUserIdFromToken();
    if (!id) {
      return throwError('User ID not available');
    }
    const url = `${this.baseUrl}/tickets/user/${id}`;
    return this.http.get<Tickets[]>(url).pipe(
      map(response => this.mapResponse(response)),
      catchError(this.handleError)
    );
  }

  //method that returns the data from the model and viewed 
  private mapResponse(response: any[]): Tickets[] {
    return response.map(ticket => ({
      id: ticket.id,
      eventName: ticket.eventName,
      image: ticket.image,
      attendeeName: ticket.attendeeName,
      ticketNumber: ticket.ticketNumber,
      purchaseDate: ticket.purchaseDate, 
      price: ticket.price,
      eventDate: ticket.eventDate,
      location: ticket.location,
      ticketType: ticket.ticketType,
      user: ticket.user
    }));
  }

  // getting a ticket to a specific id
  getTicketById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching ticket:', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  // removing the tickets if you no longer wish for it to be in your history
  removeTicket(ticketId: number): Observable<void> {
    const url = `${this.baseUrl}/${ticketId}`;
    return this.http.delete<void>(url);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
