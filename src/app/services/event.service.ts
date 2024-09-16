import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Event } from '../models/Event';
import { EventCategory } from '../models/EventCategory';
import { environment } from '../environments/environment';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = `${environment.apiUrl}/events`;
  private categoriesUrl = `${environment.apiUrl}/eventCategories`;
  private eventSubject: BehaviorSubject<Event | null> = new BehaviorSubject<Event | null>(null);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  setEvent(event: Event): void {
    this.eventSubject.next(event);
  }

  getEvent(): Observable<Event | null> {
    return this.eventSubject.asObservable();
  }

  getAllEvents(): Observable<Event[]> {
    const token = localStorage.getItem('jwt_token');
    let headers = new HttpHeaders();
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return this.http.get<Event[]>(this.baseUrl, { headers }).pipe(
      map(events => events.map(event => ({
        ...event,
        date: new Date(event.date),
        submissionDate: new Date(event.submissionDate)
      })))
    );
  }
  

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      map(event => ({
        ...event,
        date: new Date(event.date),
        submissionDate: new Date(event.submissionDate)
      }))
    );
  }

  createEvent(event: FormData): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event, { headers: this.getAuthHeaders() });
  }

  updateEvent(id: number, event: FormData): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${id}`, event, { headers: this.getAuthHeaders() });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  approveEvent(id: number, organizerId: number): Observable<Event> {
    const params = new HttpParams().set('organizerId', organizerId.toString());
    return this.http.put<Event>(`${this.baseUrl}/${id}/approve`, {}, {
        headers: this.getAuthHeaders(),
        params
    }).pipe(
        catchError(this.handleError)
    );
}

rejectEvent(id: number, organizerId: number, rejectionComment: string): Observable<Event> {
    const params = new HttpParams().set('organizerId', organizerId.toString());
    return this.http.put<Event>(`${this.baseUrl}/${id}/reject`, { rejectionComment }, {
        headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
        params
    }).pipe(
        catchError(this.handleError)
    );
}

  getCategories(): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(this.categoriesUrl, { headers: this.getAuthHeaders() });
  }

  searchByName(name: string): Observable<Event[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Event[]>(`${this.baseUrl}/searchByName`, { headers: this.getAuthHeaders(), params });
  }

  searchByCategoryName(categoryName: string): Observable<Event[]> {
    const params = new HttpParams().set('categoryName', categoryName);
    return this.http.get<Event[]>(`${this.baseUrl}/searchByCategoryName`, { headers: this.getAuthHeaders(), params });
  }

  autocomplete(partialName: string): Observable<string[]> {
    const params = new HttpParams().set('partialName', partialName);
    return this.http.get<string[]>(`${this.baseUrl}/autocomplete`, { headers: this.getAuthHeaders(), params });
  }

  purchaseTicket(eventId: number): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/${eventId}/purchase`, {}, { headers: this.getAuthHeaders() });
  }
  downloadTicket(eventId: number): Observable<string> {  // Changed return type to string to handle URL
    return this.http.get<string>(`${environment.apiUrl}/tickets/download/${eventId}`, {
      headers: this.getAuthHeaders()
    });
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // Server-side errors
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
}
}


