import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetUserSubscriptionService {

  private apiUrl = `${environment.apiUrl}/subscriptions/plan`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getSubscriptionPlan(): Observable<SubscriptionPlan> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError('No token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<SubscriptionPlan>(`${this.apiUrl}`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching subscription details:', error.message);
          return throwError('Failed to fetch subscription details');
        })
      );
  }
  updateSubscriptionPlan(newPlanId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError('No token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<any>(`${this.apiUrl}/update`, { planId: newPlanId }, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating subscription plan:', error.message);
          return throwError('Failed to update subscription plan');
        })
      );
  }
  
}
