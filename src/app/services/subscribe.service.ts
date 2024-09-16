import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  addUserToFamilyPlan(data: { planId: number, userId: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add/1`, data);
  }

  addUserToIndividualPlan(data: { planId: number, userId: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add/2`, data);
  }

  deleteSubscription():Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/delete`);}

}