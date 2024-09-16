import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { AuthService } from './auth.service';
import { GetUserSubscriptionService } from './get-user-subscription.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateSubscriptionService {
  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient,private authService :AuthService,userSubscriptionService:GetUserSubscriptionService) {}

  updateSubscriptionPlan(newPlanId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError('No token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Create HttpParams to include the query parameter
    const params = new HttpParams().set('newPlanId', newPlanId.toString());

    // Construct the URL and include query parameters using HttpParams
    const url = `${this.apiUrl}/update`;

    // Since PUT requests typically send the payload in the request body, you can send an empty object
    return this.http.put<any>(url, {}, { headers, params })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error updating subscription plan:', error.message);
          return throwError('Failed to update subscription plan');
        })
      );
  }
  getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError('No token available');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/all`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching subscription plans:', error.message);
        return throwError('Failed to fetch subscription plans');
      })
    );
  }
}


