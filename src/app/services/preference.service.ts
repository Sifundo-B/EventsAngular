import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Preference } from 'src/app/models/Preference';
import { Event } from 'src/app/models/Event';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  private baseUrl = `${environment.apiUrl}/preferences`;

  constructor(private http: HttpClient) {}

  updatePreferences(categoryIds: number[]): Observable<Preference[]> {
    return this.http.post<Preference[]>(this.baseUrl, categoryIds)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPreferences(): Observable<Preference[]> {
    return this.http.get<Preference[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEventsByPreferences(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error.message);
    return throwError(error.error.message);
  }
}
