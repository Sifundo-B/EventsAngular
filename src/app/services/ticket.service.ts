import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tickets } from '../models/tickets';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  purchaseTicket(eventId: number, ticketType: string): Observable<Tickets> {
    const body = { eventId, ticketType };
    return this.http.post<Tickets>(`${this.baseUrl}/${eventId}/purchase`, body, { headers: this.getAuthHeaders() });
  }
  
  getUserTicketHistory(): Observable<Tickets[]> {
    const userId = this.authService.getUserId(); 
    return this.http.get<Tickets[]>(`${this.baseUrl}/user/${userId}/history`, { headers: this.getAuthHeaders() });
  }
}
