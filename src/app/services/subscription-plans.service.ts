import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlansService {

  private apiUrl = `${environment.apiUrl}/subscriptions/all`;

  constructor(private http: HttpClient) { }

  getSubscriptionPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(this.apiUrl);
  }

  
}
