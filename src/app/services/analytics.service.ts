import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private baseUrl = `${environment.apiUrl}/analytics`;

  private analyticsSubject = new BehaviorSubject<any>(null);
  analytics$ = this.analyticsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getSalesAnalytics(organizerId: number, startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams()
      .set('organizerId', organizerId.toString())
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<any>(`${this.baseUrl}/sales`, { params });
  }

  getUserTicketHistory(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ticket-history/${userId}`);
  }

  refreshAnalytics(): void {
    this.analyticsSubject.next(null); // Clear current analytics data
  }
}
